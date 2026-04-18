"""Integration test for the asyncio syslog listeners (UDP + TCP)."""

import socket
import time
from pathlib import Path

import pytest

from pipeline.syslog.server import SyslogServer
from pipeline.syslog.storage import SyslogStore


def _free_port(kind: str = "udp") -> int:
    """Ask the kernel for an ephemeral port."""
    fam = socket.SOCK_DGRAM if kind == "udp" else socket.SOCK_STREAM
    with socket.socket(socket.AF_INET, fam) as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


@pytest.fixture()
def running_server(tmp_path: Path):
    store = SyslogStore(tmp_path / "syslog.db")
    server = SyslogServer(
        store,
        udp_host="127.0.0.1",
        udp_port=_free_port("udp"),
        tcp_host="127.0.0.1",
        tcp_port=_free_port("tcp"),
    )
    server.start(wait=True, timeout=3.0)
    yield server, store
    server.stop()
    store.close()


def _wait_for_count(store: SyslogStore, target: int, timeout: float = 3.0) -> int:
    """Poll the store until we see `target` events or time out."""
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        n = store.count_events()
        if n >= target:
            return n
        time.sleep(0.05)
    return store.count_events()


def test_udp_ingest(running_server):
    server, store = running_server
    line = b"<134>Apr 17 21:45:01 AP-FLOOR-3 stm[1234]: AP_EVENT_DOT11_ASSOC client=aa:bb:cc"
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        s.sendto(line, (server.udp_host, server.udp_port))
    assert _wait_for_count(store, 1) == 1
    ev = store.list_events(limit=1)[0]
    assert ev.transport == "udp"
    assert ev.event_code == "AP_EVENT_DOT11_ASSOC"


def test_tcp_ingest(running_server):
    server, store = running_server
    lines = [
        b"<134>Apr 17 21:45:01 sw-core fpapps: LINK_UP port=1/0/1\n",
        b"<131>Apr 17 21:45:02 sw-core fpapps: LINK_DOWN port=1/0/2\n",
    ]
    with socket.create_connection((server.tcp_host, server.tcp_port), timeout=2) as s:
        for line in lines:
            s.sendall(line)
    assert _wait_for_count(store, 2) == 2
    events = store.list_events(limit=10)
    codes = {e.event_code for e in events}
    assert "LINK_UP" in codes and "LINK_DOWN" in codes
    assert all(e.transport == "tcp" for e in events)
