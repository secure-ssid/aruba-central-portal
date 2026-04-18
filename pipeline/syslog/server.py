"""
Syslog server: asyncio UDP + TCP listeners, hosted on a background thread.

Why a background thread?
Flask (and gunicorn sync workers) own the main thread. Asyncio wants an
event loop. We spin a daemon thread, create a fresh loop there, and run
the UDP+TCP listeners in it. The Flask process stays unchanged.

Defaults are chosen for LAN use (Aruba devices → this container):
- UDP on 0.0.0.0:514 (RFC 3164 default)
- TCP on 0.0.0.0:1514 (non-privileged; 6514 would be TLS-only)
- Binding to <1024 requires root/CAP_NET_BIND_SERVICE, so in Docker we
  bind to 5140/5141 and map host 514→container 5140 in compose. Env vars
  let operators pick either path.
"""

from __future__ import annotations

import asyncio
import logging
import os
import threading
from datetime import datetime, timezone

from .parser import parse_syslog
from .storage import SyslogStore

logger = logging.getLogger(__name__)


SYSLOG_UDP_HOST = os.environ.get("SYSLOG_UDP_HOST", "0.0.0.0")
SYSLOG_UDP_PORT = int(os.environ.get("SYSLOG_UDP_PORT", "5140"))
SYSLOG_TCP_HOST = os.environ.get("SYSLOG_TCP_HOST", "0.0.0.0")
SYSLOG_TCP_PORT = int(os.environ.get("SYSLOG_TCP_PORT", "5141"))
SYSLOG_ENABLED = os.environ.get("SYSLOG_ENABLED", "true").lower() in ("1", "true", "yes")

# Retention sweep cadence: once an hour is plenty for a 7-day window.
PRUNE_INTERVAL_SEC = int(os.environ.get("SYSLOG_PRUNE_INTERVAL", "3600"))


class _SyslogUDPProtocol(asyncio.DatagramProtocol):
    """Parses and persists each datagram as it arrives."""

    def __init__(self, store: SyslogStore) -> None:
        self.store = store

    def datagram_received(self, data: bytes, addr: tuple[str, int]) -> None:  # type: ignore[override]
        _persist(self.store, data, addr[0], "udp")


async def _tcp_handler(
    store: SyslogStore,
    reader: asyncio.StreamReader,
    writer: asyncio.StreamWriter,
) -> None:
    """
    RFC 6587 says TCP syslog is either octet-counted or newline-framed.
    We use the simpler newline framing — all Aruba gear defaults to it.
    """
    peer = writer.get_extra_info("peername") or ("unknown", 0)
    src_ip = peer[0]
    try:
        while True:
            line = await reader.readline()
            if not line:
                break
            _persist(store, line, src_ip, "tcp")
    except ConnectionError:
        pass
    finally:
        writer.close()
        try:
            await writer.wait_closed()
        except Exception:  # noqa: BLE001 — best-effort cleanup
            pass


def _persist(store: SyslogStore, data: bytes, src_ip: str, transport: str) -> None:
    """Shared parse+insert path for UDP and TCP listeners."""
    try:
        parsed = parse_syslog(data)
        store.insert_event(
            received_at=datetime.now(timezone.utc),
            event_time=parsed.event_time,
            source_ip=src_ip,
            transport=transport,
            facility=parsed.facility,
            severity=parsed.severity,
            hostname=parsed.hostname,
            app_name=parsed.app_name,
            proc_id=parsed.proc_id,
            msg_id=parsed.msg_id,
            device_serial=parsed.device_serial,
            device_name=parsed.device_name,
            event_code=parsed.event_code,
            message=parsed.message,
            raw=parsed.raw,
            structured_data=parsed.structured_data,
        )
    except Exception:  # noqa: BLE001 — never let one bad frame kill the listener
        logger.exception("syslog: failed to persist frame from %s/%s", src_ip, transport)


class SyslogServer:
    """
    Lifecycle wrapper. Call `.start()` once at app boot and `.stop()` on
    shutdown. Safe to call start/stop only once per instance.
    """

    def __init__(
        self,
        store: SyslogStore,
        *,
        udp_host: str = SYSLOG_UDP_HOST,
        udp_port: int = SYSLOG_UDP_PORT,
        tcp_host: str = SYSLOG_TCP_HOST,
        tcp_port: int = SYSLOG_TCP_PORT,
    ) -> None:
        self.store = store
        self.udp_host = udp_host
        self.udp_port = udp_port
        self.tcp_host = tcp_host
        self.tcp_port = tcp_port

        self._thread: threading.Thread | None = None
        self._loop: asyncio.AbstractEventLoop | None = None
        self._started = threading.Event()
        self._udp_transport: asyncio.DatagramTransport | None = None
        self._tcp_server: asyncio.AbstractServer | None = None
        self._prune_task: asyncio.Task[None] | None = None

    # ─────────────────────── lifecycle ────────────────────

    def start(self, *, wait: bool = False, timeout: float = 2.0) -> None:
        """
        Start the syslog server thread. Returns immediately by default so the
        Flask import chain is never blocked by an unreachable bind or a slow
        resolver. Tests pass `wait=True` to confirm the listener is ready.
        """
        if self._thread and self._thread.is_alive():
            return
        self._thread = threading.Thread(
            target=self._run, name="syslog-server", daemon=True
        )
        self._thread.start()
        if wait:
            self._started.wait(timeout=timeout)

    def stop(self) -> None:
        loop = self._loop
        if not loop:
            return
        # Drain async resources first, then stop the loop separately.
        # Stopping the loop inside `_shutdown` would cancel the future we're
        # awaiting on from this thread and deadlock.
        asyncio.run_coroutine_threadsafe(self._shutdown(), loop).result(timeout=5)
        loop.call_soon_threadsafe(loop.stop)
        if self._thread:
            self._thread.join(timeout=5)

    # ─────────────────────── internals ────────────────────

    def _run(self) -> None:
        loop = asyncio.new_event_loop()
        self._loop = loop
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(self._boot())
            self._started.set()
            loop.run_forever()
        except Exception:
            logger.exception("syslog server crashed")
            self._started.set()  # unblock start() even on failure
        finally:
            loop.close()

    async def _boot(self) -> None:
        loop = asyncio.get_running_loop()

        self._udp_transport, _ = await loop.create_datagram_endpoint(
            lambda: _SyslogUDPProtocol(self.store),
            local_addr=(self.udp_host, self.udp_port),
            allow_broadcast=True,
        )
        logger.info("syslog: UDP listening on %s:%d", self.udp_host, self.udp_port)

        self._tcp_server = await asyncio.start_server(
            lambda r, w: _tcp_handler(self.store, r, w),
            host=self.tcp_host,
            port=self.tcp_port,
        )
        logger.info("syslog: TCP listening on %s:%d", self.tcp_host, self.tcp_port)

        self._prune_task = asyncio.create_task(self._prune_loop())

    async def _prune_loop(self) -> None:
        while True:
            try:
                await asyncio.sleep(PRUNE_INTERVAL_SEC)
                # Run the blocking sqlite call in the default executor.
                await asyncio.get_running_loop().run_in_executor(
                    None, self.store.prune_older_than
                )
            except asyncio.CancelledError:
                raise
            except Exception:
                logger.exception("syslog: prune loop error")

    async def _shutdown(self) -> None:
        if self._prune_task:
            self._prune_task.cancel()
            try:
                await self._prune_task
            except asyncio.CancelledError:
                pass
        if self._udp_transport:
            self._udp_transport.close()
        if self._tcp_server:
            self._tcp_server.close()
            await self._tcp_server.wait_closed()


# ────────────────────── module-level singleton ────────────────────

_GLOBAL_STORE: SyslogStore | None = None
_GLOBAL_SERVER: SyslogServer | None = None
_GLOBAL_LOCK = threading.Lock()


def get_store() -> SyslogStore:
    """Shared store instance for the Flask process."""
    global _GLOBAL_STORE
    with _GLOBAL_LOCK:
        if _GLOBAL_STORE is None:
            _GLOBAL_STORE = SyslogStore()
        return _GLOBAL_STORE


def start_default_server() -> SyslogServer | None:
    """Start the singleton syslog server unless disabled via env."""
    global _GLOBAL_SERVER
    if not SYSLOG_ENABLED:
        logger.info("syslog: disabled via SYSLOG_ENABLED")
        return None
    # Resolve the store BEFORE taking the lock — get_store() takes the same
    # lock internally, and threading.Lock is non-reentrant, so inlining the
    # call would deadlock.
    store = get_store()
    with _GLOBAL_LOCK:
        if _GLOBAL_SERVER is None:
            _GLOBAL_SERVER = SyslogServer(store)
            _GLOBAL_SERVER.start()
        return _GLOBAL_SERVER
