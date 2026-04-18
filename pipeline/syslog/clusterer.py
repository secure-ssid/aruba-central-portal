"""
Rule-based event clusterer.

Groups unclustered events by (device, event_code, time-bucket) and writes
them to the `incidents` table. Intentionally deterministic — no ML, no LLM —
so operators can predict why two events joined the same incident.

Design
------
- A "bucket" is an aligned window of size `CLUSTER_WINDOW` (default 5 min).
  Two events with the same (device_key, event_code) fall in the same
  incident iff they land in the same bucket.
- `device_key` = `device_serial or hostname or source_ip`. Keeps events
  from the same physical box together even when one log line is missing
  the serial (common on boot).
- `event_code` missing → `"NOCODE"`. We still cluster by device so a
  device spamming generic messages shows up as one incident.
- Signature = sha1("{device_key}|{code}|{bucket_iso}") truncated to 16
  chars. Short enough for logs, unique enough for this corpus.
- Events already in `incident_events` are skipped (see
  `SyslogStore.unclustered_events`), so repeated ticks are idempotent.
"""

from __future__ import annotations

import hashlib
import logging
import os
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

from .anomaly import score_incident
from .reviewer_agent import review_alert
from .storage import StoredEvent, SyslogStore
from .writer_agent import (
    LLMError,
    fallback_summary,
    fallback_troubleshooting,
    write_alert,
)

# Minimum anomaly_score above which we invoke the LLM writer. Below this,
# the clusterer still creates the incident but doesn't spend tokens
# generating a human summary. Tunable via env for cost control.
WRITER_THRESHOLD = float(os.environ.get("SYSLOG_WRITER_THRESHOLD", "2.0"))
WRITER_ENABLED = os.environ.get("SYSLOG_WRITER_ENABLED", "true").lower() in ("1", "true", "yes")

# Reviewer agent — audits the writer's output before publication. Disabling
# it leaves alerts pending (approved=0) until a human decides.
REVIEWER_ENABLED = os.environ.get("SYSLOG_REVIEWER_ENABLED", "true").lower() in ("1", "true", "yes")

logger = logging.getLogger(__name__)

# Bucket size. 5 minutes matches the Phase 1 design doc; tunable via env
# so operators can tighten (burst detection) or loosen (noisy devices).
CLUSTER_WINDOW = timedelta(seconds=int(os.environ.get("SYSLOG_CLUSTER_WINDOW_SEC", "300")))

# How far back the clusterer looks on each tick. Should comfortably exceed
# `CLUSTER_WINDOW` + ingest jitter so late events still find their bucket.
CLUSTER_LOOKBACK = timedelta(seconds=int(os.environ.get("SYSLOG_CLUSTER_LOOKBACK_SEC", "1800")))

# Hard cap per tick so a backlog doesn't monopolize the event loop.
CLUSTER_BATCH_LIMIT = int(os.environ.get("SYSLOG_CLUSTER_BATCH", "1000"))


@dataclass
class ClusterResult:
    """Summary of one clusterer run, useful for logs and tests."""
    processed: int
    incidents_touched: int
    new_incidents: int


def _device_key(ev: StoredEvent) -> str:
    return ev.device_serial or ev.hostname or ev.source_ip or "unknown"


def _bucket_start(ts: datetime, window: timedelta) -> datetime:
    """Floor `ts` to the nearest window boundary, UTC."""
    if ts.tzinfo is None:
        ts = ts.replace(tzinfo=timezone.utc)
    ts = ts.astimezone(timezone.utc)
    window_s = int(window.total_seconds())
    epoch = int(ts.timestamp())
    floored = epoch - (epoch % window_s)
    return datetime.fromtimestamp(floored, tz=timezone.utc)


def _signature(device_key: str, code: str, bucket: datetime) -> str:
    raw = f"{device_key}|{code}|{bucket.isoformat()}"
    return hashlib.sha1(raw.encode("utf-8")).hexdigest()[:16]


def _event_ts(ev: StoredEvent) -> datetime:
    """Prefer the device-reported time; fall back to server ingest time."""
    for candidate in (ev.event_time, ev.received_at):
        if not candidate:
            continue
        if isinstance(candidate, datetime):
            return candidate if candidate.tzinfo else candidate.replace(tzinfo=timezone.utc)
        # Stored as ISO string
        try:
            s = candidate.replace("Z", "+00:00")
            dt = datetime.fromisoformat(s)
            return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
        except ValueError:
            continue
    return datetime.now(timezone.utc)


def cluster_once(
    store: SyslogStore,
    *,
    window: timedelta = CLUSTER_WINDOW,
    lookback: timedelta = CLUSTER_LOOKBACK,
    batch_limit: int = CLUSTER_BATCH_LIMIT,
    now: datetime | None = None,
) -> ClusterResult:
    """Run one clustering pass. Returns counts; never raises on data issues."""
    now = now or datetime.now(timezone.utc)
    since = now - lookback

    events = store.unclustered_events(since=since, limit=batch_limit)
    if not events:
        return ClusterResult(processed=0, incidents_touched=0, new_incidents=0)

    # Group events by (signature, device_key, code, bucket).
    # We bucket in-memory so we can compute first_seen/last_seen per group
    # with a single INSERT/UPDATE each.
    groups: dict[str, dict] = {}
    for ev in events:
        ts = _event_ts(ev)
        bucket = _bucket_start(ts, window)
        dkey = _device_key(ev)
        code = ev.event_code or "NOCODE"
        sig = _signature(dkey, code, bucket)

        g = groups.get(sig)
        if g is None:
            groups[sig] = {
                "device_key": dkey,
                "device_serial": ev.device_serial,
                "device_name": ev.device_name,
                "event_code": ev.event_code,
                "severity": ev.severity,
                "first_seen": ts,
                "last_seen": ts,
                "event_ids": [ev.id],
            }
            continue

        g["event_ids"].append(ev.id)
        if ts < g["first_seen"]:
            g["first_seen"] = ts
        if ts > g["last_seen"]:
            g["last_seen"] = ts
        # Lowest severity wins (emerg=0 beats debug=7).
        if g["severity"] is None or ev.severity is not None and ev.severity < g["severity"]:
            g["severity"] = ev.severity
        # Prefer a real device_serial / device_name over None.
        if not g["device_serial"] and ev.device_serial:
            g["device_serial"] = ev.device_serial
        if not g["device_name"] and ev.device_name:
            g["device_name"] = ev.device_name

    new_count = 0
    touched = 0
    for sig, g in groups.items():
        existed_row = store.get_incident_by_signature(sig)
        incident_id = store.upsert_incident(
            cluster_signature=sig,
            device_serial=g["device_serial"],
            device_name=g.get("device_name"),
            event_code=g["event_code"],
            severity=g["severity"],
            first_seen=g["first_seen"],
            last_seen=g["last_seen"],
            event_ids=g["event_ids"],
        )
        touched += 1
        if existed_row is None:
            new_count += 1

        # Anomaly score uses the *total* count now on the incident (includes
        # events added to an existing row), not just this tick's event_ids,
        # so the score stays stable across reruns.
        updated = store.get_incident(incident_id)
        if not updated:
            continue
        bucket = _bucket_start(g["first_seen"], window)
        result = score_incident(
            store,
            device_key=g["device_key"],
            event_code=g["event_code"],
            current_count=int(updated["event_count"]),
            bucket_start=bucket,
            window_sec=int(window.total_seconds()),
        )
        store.set_incident_anomaly_score(incident_id, result.score)

        # If the incident is interesting enough, ask the LLM to produce a
        # human summary. Below threshold we skip the call entirely (saves
        # tokens; the incident is still available via /api/syslog/incidents).
        if WRITER_ENABLED and result.score >= WRITER_THRESHOLD:
            updated["anomaly_score"] = result.score  # include latest score in prompt
            events_for_prompt = store.incident_events(incident_id, limit=20)
            summary_text: str | None = None
            troubleshooting: list[str] = []
            notes: str | None = None
            approved = 0
            used_fallback = False

            try:
                llm = write_alert(updated, events_for_prompt)
                summary_text = llm.summary
                troubleshooting = llm.troubleshooting or fallback_troubleshooting(updated)
            except LLMError as exc:
                logger.warning(
                    "writer: LLM unavailable for incident=%s — using fallback (%s)",
                    incident_id, exc,
                )
                summary_text = fallback_summary(updated)
                troubleshooting = fallback_troubleshooting(updated)
                notes = f"fallback: {exc}"
                used_fallback = True

            # Reviewer pass — only runs when we have an LLM-generated summary
            # (skipped for fallback text, which isn't the writer's work).
            if REVIEWER_ENABLED and not used_fallback:
                try:
                    verdict = review_alert(updated, events_for_prompt, summary_text)
                    if verdict.pending:
                        approved = 0
                        notes = f"review pending: {verdict.notes}"
                    else:
                        approved = 1 if verdict.approved else -1
                        notes = verdict.notes
                except LLMError as exc:
                    logger.warning(
                        "reviewer: LLM unavailable for incident=%s — leaving pending (%s)",
                        incident_id, exc,
                    )
                    notes = f"review unavailable: {exc}"

            store.upsert_alert(
                incident_id=incident_id,
                summary=summary_text,
                troubleshooting=troubleshooting,
                review_notes=notes,
                approved=approved,
            )

    logger.info(
        "clusterer: processed=%d groups=%d new=%d",
        len(events), touched, new_count,
    )
    return ClusterResult(processed=len(events), incidents_touched=touched, new_incidents=new_count)
