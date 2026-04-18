"""
Central Events API poller.

Calls `/network-troubleshooting/v1/events` on a configurable cadence,
normalizes each event, and writes it to the same `events` table the
syslog listener uses. Downstream (clusterer, anomaly, writer, reviewer)
treats both streams identically.

Why polling instead of streaming (today)
----------------------------------------
Streaming/webhook needs a public URL — we're on a LAN-only Mac. When the
app moves to Docker with a reachable address we'll switch to the gRPC
streaming or webhook endpoint and keep this poller as the fallback for
when the stream drops. The normalizer module is already shared.

Dedup
-----
`insert_event` is INSERT OR IGNORE on (source, msg_id), so overlapping
poll windows are safe: the first call wins, repeats are no-ops.

Watermark
---------
We remember the `occurred_at` of the newest event seen last tick and
start the next tick slightly before that (OVERLAP_SEC) to defend against
clock skew and out-of-order delivery.
"""

from __future__ import annotations

import logging
import os
import threading
import time
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from typing import Any, Callable

from .normalizer import normalize_central_event

logger = logging.getLogger(__name__)


CENTRAL_POLL_INTERVAL_SEC = int(os.environ.get("CENTRAL_EVENTS_POLL_SEC", "60"))
CENTRAL_POLL_ENABLED = os.environ.get("CENTRAL_EVENTS_ENABLED", "true").lower() in ("1", "true", "yes")
CENTRAL_POLL_LIMIT = int(os.environ.get("CENTRAL_EVENTS_LIMIT", "1000"))
# Seconds to overlap with the previous window — tolerates clock skew +
# late delivery by re-asking Central for the last N seconds every tick.
CENTRAL_POLL_OVERLAP_SEC = int(os.environ.get("CENTRAL_EVENTS_OVERLAP_SEC", "30"))
# First poll reaches back this far so we don't miss a backlog on cold start.
CENTRAL_POLL_COLD_START_HOURS = int(os.environ.get("CENTRAL_EVENTS_COLD_START_HOURS", "1"))


@dataclass
class PollResult:
    ingested: int
    skipped_duplicates: int
    api_error: str | None = None
    watermark: datetime | None = None


def _rfc3339_ms(dt: datetime) -> str:
    """Central's start-at / end-at expect ISO 8601 with ms + Z."""
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    dt = dt.astimezone(timezone.utc)
    return dt.strftime("%Y-%m-%dT%H:%M:%S.") + f"{dt.microsecond // 1000:03d}Z"


def _extract_event_list(resp: Any) -> list[dict]:
    """Central's response shape isn't contractually documented — tolerate
    the common variants the existing `routes/events.py` already handles."""
    if isinstance(resp, list):
        return [e for e in resp if isinstance(e, dict)]
    if isinstance(resp, dict):
        for key in ("events", "items", "result", "data"):
            val = resp.get(key)
            if isinstance(val, list):
                return [e for e in val if isinstance(e, dict)]
    return []


def poll_once(
    store,
    api_client,
    *,
    since: datetime | None = None,
    now: datetime | None = None,
    limit: int = CENTRAL_POLL_LIMIT,
) -> PollResult:
    """Run one pull. Pure-ish — reads `api_client`, writes `store`."""
    now = now or datetime.now(timezone.utc)
    if since is None:
        since = now - timedelta(hours=CENTRAL_POLL_COLD_START_HOURS)
    else:
        since = since - timedelta(seconds=CENTRAL_POLL_OVERLAP_SEC)

    params = {
        "start-at": _rfc3339_ms(since),
        "end-at": _rfc3339_ms(now),
        "limit": limit,
    }

    try:
        resp = api_client.get("/network-troubleshooting/v1/events", params=params)
    except Exception as exc:  # noqa: BLE001 — surface in result, not raise
        logger.warning("central-events: API call failed: %s", exc)
        return PollResult(ingested=0, skipped_duplicates=0, api_error=str(exc))

    events = _extract_event_list(resp)
    if not events:
        return PollResult(ingested=0, skipped_duplicates=0, watermark=now)

    ingested = 0
    seen_before = 0
    latest_seen: datetime | None = None

    for ev in events:
        try:
            kwargs = normalize_central_event(ev)
        except Exception:  # noqa: BLE001 — one bad row mustn't kill the batch
            logger.exception("central-events: failed to normalize row: %r", ev)
            continue
        ev_time = kwargs.get("event_time")
        if isinstance(ev_time, datetime) and (latest_seen is None or ev_time > latest_seen):
            latest_seen = ev_time

        # `insert_event` returns the row id on both insert and the
        # "already exists" branch (see INSERT OR IGNORE path). We can't
        # tell them apart from the return value, so instead we check
        # whether the dedup index caught us by pre-looking-up.
        msg_id = kwargs["msg_id"]
        existed = store.event_exists_by_source_msgid("central", msg_id)
        store.insert_event(**kwargs)
        if existed:
            seen_before += 1
        else:
            ingested += 1

    return PollResult(
        ingested=ingested,
        skipped_duplicates=seen_before,
        watermark=latest_seen or now,
    )


# ──────────────────────── lifecycle wrapper ────────────────────────


class CentralEventsPoller:
    """Background thread that calls `poll_once` on a loop."""

    def __init__(
        self,
        store,
        api_client_provider: Callable[[], Any],
        *,
        interval_sec: int = CENTRAL_POLL_INTERVAL_SEC,
    ) -> None:
        self.store = store
        self._api_client_provider = api_client_provider
        self.interval_sec = interval_sec

        self._thread: threading.Thread | None = None
        self._stop = threading.Event()
        self._watermark: datetime | None = None

    def start(self) -> None:
        if self._thread and self._thread.is_alive():
            return
        self._stop.clear()
        self._thread = threading.Thread(
            target=self._run, name="central-events-poller", daemon=True,
        )
        self._thread.start()

    def stop(self, timeout: float = 3.0) -> None:
        self._stop.set()
        if self._thread:
            self._thread.join(timeout=timeout)

    def _run(self) -> None:
        logger.info("central-events: poller running every %ds", self.interval_sec)
        while not self._stop.is_set():
            api = self._api_client_provider()
            if api is None:
                # Credentials not configured yet — retry next tick.
                if self._stop.wait(timeout=self.interval_sec):
                    break
                continue
            try:
                result = poll_once(self.store, api, since=self._watermark)
                if result.api_error:
                    logger.warning("central-events: %s", result.api_error)
                else:
                    if result.ingested or result.skipped_duplicates:
                        logger.info(
                            "central-events: ingested=%d duplicates=%d",
                            result.ingested, result.skipped_duplicates,
                        )
                    if result.watermark:
                        self._watermark = result.watermark
            except Exception:  # noqa: BLE001 — loop must survive one bad tick
                logger.exception("central-events: poll tick failed")
            if self._stop.wait(timeout=self.interval_sec):
                break
        logger.info("central-events: poller stopped")


# Start-at-boot helper mirroring `start_default_server` in the syslog server.
_GLOBAL_POLLER: CentralEventsPoller | None = None
_GLOBAL_LOCK = threading.Lock()


def start_default_poller(store, api_client_provider: Callable[[], Any]) -> CentralEventsPoller | None:
    global _GLOBAL_POLLER
    if not CENTRAL_POLL_ENABLED:
        logger.info("central-events: disabled via CENTRAL_EVENTS_ENABLED")
        return None
    with _GLOBAL_LOCK:
        if _GLOBAL_POLLER is None:
            _GLOBAL_POLLER = CentralEventsPoller(store, api_client_provider)
            _GLOBAL_POLLER.start()
        return _GLOBAL_POLLER
