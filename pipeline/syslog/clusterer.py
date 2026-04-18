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
from .event_families import cluster_key_for
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

# Phase 14a — cost-control gates. All numeric, all tunable via env so
# operators can widen the throttle when a Pro tier is paid for.
WRITER_MIN_EVENTS = int(os.environ.get("SYSLOG_WRITER_MIN_EVENTS", "3"))
WRITER_COOLDOWN_SEC = int(os.environ.get("SYSLOG_WRITER_COOLDOWN_SEC", "900"))
WRITER_MAX_CALLS_PER_TICK = int(os.environ.get("SYSLOG_WRITER_MAX_CALLS_PER_TICK", "5"))
WRITER_DAILY_CAP = int(os.environ.get("SYSLOG_WRITER_DAILY_CAP", "200"))

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


def _find_continuing_incident(
    store: SyslogStore,
    device_key: str,
    cluster_key: str,
    new_event_ts: datetime,
    window: timedelta,
) -> str | None:
    """Return the cluster_signature of an existing incident this event
    should extend, or None if the event should start a fresh bucket.

    "Continuing" = same device + same cluster_key + last_seen within
    `window` of the new event's timestamp. Works across bucket
    boundaries — that's the whole point.
    """
    cutoff_iso = (new_event_ts - window).isoformat().replace("+00:00", "Z")
    # Only match incidents whose device_serial OR device_name equals the
    # current event's device_key. Previously we also included
    # `device_serial IS NULL` — which matched EVERY unnamed incident in
    # the window, letting a syslog event without a serial silently extend
    # an unrelated incident. Python-side filtering caught most of these
    # but burned a per-candidate lookup; now the SQL itself is tight.
    row = store._conn.execute(  # noqa: SLF001 — intentional direct read
        """
        SELECT cluster_signature
        FROM incidents
        WHERE (device_serial = ? OR device_name = ?)
          AND last_seen >= ?
          AND status = 'open'
        ORDER BY last_seen DESC
        LIMIT 20
        """,
        (device_key, device_key, cutoff_iso),
    ).fetchall()

    for candidate in row:
        # Confirm the cluster_key (family-or-raw-code) matches too —
        # same device + same story, different bucket.
        incident = store.get_incident_by_signature(candidate["cluster_signature"])
        if not incident:
            continue
        incident_key = cluster_key_for(incident.get("event_code"))
        if incident_key == cluster_key:
            return str(candidate["cluster_signature"])
    return None


def _event_client_mac(ev: StoredEvent) -> str | None:
    """Pull client_mac out of Central events (it's in structured_data).
    Syslog parser doesn't currently extract it, so those just return None."""
    sd = ev.structured_data or {}
    if not isinstance(sd, dict):
        return None
    for key in ("client-mac", "clientMac", "client_mac", "calling-station-id"):
        val = sd.get(key)
        if val:
            return str(val).lower()
    return None


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


@dataclass
class _WriterDecision:
    """Outcome of the pre-LLM gate stack. When `skip_reason` is set the
    caller must NOT call the LLM; if `cached` is also set, the caller
    should upsert that prior summary onto the incident instead."""
    skip_reason: str | None
    cached: dict | None
    fp_now: str


def _should_call_writer(
    *,
    store: SyslogStore,
    incident_id: int,
    signature: str,
    event_count: int,
    calls_this_tick: int,
) -> _WriterDecision:
    """All pre-LLM gates in cheapest-first order. Each gate that fires
    bumps the matching metric so the operator can see which throttle
    saved the most money this week."""
    fp_now = store.incident_fingerprints_hash(incident_id)

    # Gate 1 — min cluster size. Single-event "anomalies" almost always
    # turn out to be noise, and the LLM produces a generic summary for
    # them. Blanket-skip below N.
    if event_count < WRITER_MIN_EVENTS:
        store.incr_llm_metric("calls_skipped_min_size")
        return _WriterDecision(
            skip_reason=f"below-min-size ({event_count}<{WRITER_MIN_EVENTS})",
            cached=None, fp_now=fp_now,
        )

    # Gate 2 — fingerprint unchanged since last alert on this incident.
    # The old single-tick skip lived inline; now it's a named gate so the
    # metric shows up in the dashboard.
    fp_prev = store.alert_fingerprints_hash(incident_id)
    if fp_now and fp_now == fp_prev:
        store.incr_llm_metric("calls_skipped_fp_growth")
        return _WriterDecision(
            skip_reason=f"fingerprint-unchanged ({fp_now})",
            cached=None, fp_now=fp_now,
        )

    # Gate 3 — signature-level cache. A different incident (or a restart)
    # may have already summarized this exact content. Reuse verbatim.
    if fp_now:
        cached = store.get_cached_summary(signature, fp_now)
        if cached:
            store.incr_llm_metric("calls_skipped_cache")
            return _WriterDecision(
                skip_reason="llm-cache-hit", cached=cached, fp_now=fp_now,
            )

    # Gate 4 — per-signature cooldown. Even if fingerprints drift, don't
    # re-ask the LLM about the same signature more often than the
    # cooldown window. Prevents a hot device from chewing quota.
    age = store.cached_summary_age_seconds(signature)
    if age is not None and age < WRITER_COOLDOWN_SEC:
        store.incr_llm_metric("calls_skipped_cooldown")
        return _WriterDecision(
            skip_reason=f"cooldown ({int(age)}s<{WRITER_COOLDOWN_SEC}s)",
            cached=None, fp_now=fp_now,
        )

    # Gate 5 — per-tick cap. Protects against a flood day burning the
    # daily quota in one cluster pass. Remaining incidents re-evaluate
    # on the next tick.
    if calls_this_tick >= WRITER_MAX_CALLS_PER_TICK:
        store.incr_llm_metric("calls_skipped_tick_cap")
        return _WriterDecision(
            skip_reason=f"tick-cap ({WRITER_MAX_CALLS_PER_TICK})",
            cached=None, fp_now=fp_now,
        )

    # Gate 6 — per-day quota ceiling. Hard cap independent of cooldown;
    # once hit, nothing new gets summarized until the UTC day rolls over.
    if store.llm_calls_today() >= WRITER_DAILY_CAP:
        store.incr_llm_metric("calls_skipped_daily_cap")
        return _WriterDecision(
            skip_reason=f"daily-cap ({WRITER_DAILY_CAP})",
            cached=None, fp_now=fp_now,
        )

    return _WriterDecision(skip_reason=None, cached=None, fp_now=fp_now)


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

    # Group events by (signature, device_key, family, bucket).
    #
    # `cluster_key_for` returns the event family when the raw code is
    # known (e.g. AOS codes 132094 and 520013 both map to WPA_HANDSHAKE
    # so they land in the same incident), or the raw code otherwise.
    #
    # Bucket alignment is kept because it's our primary dedup knob;
    # sliding-window merging below extends *existing* incidents whose
    # last_seen is within `window` of the new event.
    groups: dict[str, dict] = {}
    for ev in events:
        ts = _event_ts(ev)
        bucket = _bucket_start(ts, window)
        dkey = _device_key(ev)
        cluster_key = cluster_key_for(ev.event_code)
        sig = _signature(dkey, cluster_key, bucket)

        # Sliding-window extension: if an incident with the same
        # (device, cluster_key) already exists and its last_seen is
        # within `window` of this event, reuse its signature so the
        # event appends to that row instead of spawning a new one.
        # This collapses the classic "spans the 12:00 bucket boundary"
        # case — signatures from adjacent buckets now merge.
        if sig not in groups:
            prior = _find_continuing_incident(
                store, dkey, cluster_key, ts, window,
            )
            if prior is not None:
                sig = prior

        client_mac = _event_client_mac(ev)
        g = groups.get(sig)
        if g is None:
            groups[sig] = {
                "device_key": dkey,
                "device_serial": ev.device_serial,
                "device_name": ev.device_name,
                "client_mac": client_mac,
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
        # Lowest severity wins (emerg=0 beats debug=7). Only touch the
        # group's severity when the new event brings a real number;
        # otherwise leave whatever we had — a None from the first event
        # used to get stuck even after a later event carried severity 3.
        if ev.severity is not None:
            if g["severity"] is None or ev.severity < g["severity"]:
                g["severity"] = ev.severity
        # Prefer a real device_serial / device_name / client_mac over None.
        if not g["device_serial"] and ev.device_serial:
            g["device_serial"] = ev.device_serial
        if not g["device_name"] and ev.device_name:
            g["device_name"] = ev.device_name
        if not g.get("client_mac") and client_mac:
            g["client_mac"] = client_mac

    new_count = 0
    touched = 0
    calls_this_tick = 0
    for sig, g in groups.items():
        existed_row = store.get_incident_by_signature(sig)
        incident_id = store.upsert_incident(
            cluster_signature=sig,
            device_serial=g["device_serial"],
            device_name=g.get("device_name"),
            client_mac=g.get("client_mac"),
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
        # human summary. Gates run in cheapest-first order — anything that
        # can avoid an LLM call happens before we spend tokens.
        if WRITER_ENABLED and result.score >= WRITER_THRESHOLD:
            decision = _should_call_writer(
                store=store,
                incident_id=incident_id,
                signature=sig,
                event_count=int(updated["event_count"]),
                calls_this_tick=calls_this_tick,
            )
            if decision.skip_reason:
                logger.debug(
                    "writer: incident=%s skipped (%s)", incident_id, decision.skip_reason,
                )
                if decision.cached:
                    # Reuse prior summary verbatim — the incident row still
                    # needs an alert if it doesn't have one yet.
                    store.upsert_alert(
                        incident_id=incident_id,
                        summary=decision.cached["summary"],
                        troubleshooting=decision.cached["troubleshooting"],
                        review_notes=decision.cached.get("review_notes"),
                        approved=int(decision.cached.get("approved") or 0),
                    )
                    if decision.fp_now:
                        store.set_alert_fingerprints_hash(incident_id, decision.fp_now)
                continue

            updated["anomaly_score"] = result.score  # include latest score in prompt
            events_for_prompt = store.incident_events(incident_id, limit=20)
            summary_text: str | None = None
            troubleshooting: list[str] = []
            notes: str | None = None
            approved = 0
            used_fallback = False

            llm_verdict: str | None = None
            llm_device_category: str | None = None
            llm_benign_items: list[str] = []
            llm_real_items: list[str] = []

            try:
                llm = write_alert(updated, events_for_prompt)
                summary_text = llm.summary
                troubleshooting = llm.troubleshooting or fallback_troubleshooting(updated)
                llm_verdict = llm.verdict
                llm_device_category = llm.device_category
                llm_benign_items = llm.benign_items
                llm_real_items = llm.real_items
                store.incr_llm_metric("calls_made")
                calls_this_tick += 1
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
                    review_verdict = review_alert(updated, events_for_prompt, summary_text)
                    if review_verdict.pending:
                        approved = 0
                        notes = f"review pending: {review_verdict.notes}"
                    else:
                        approved = 1 if review_verdict.approved else -1
                        notes = review_verdict.notes
                    store.incr_llm_metric("calls_made")
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
                verdict=llm_verdict,
                device_category=llm_device_category,
                benign_items=llm_benign_items,
                real_items=llm_real_items,
            )
            # Stamp the alert with the fingerprint set we just summarized
            # so the next tick can skip the LLM if nothing new arrived.
            if decision.fp_now:
                store.set_alert_fingerprints_hash(incident_id, decision.fp_now)
            # Cache the LLM output keyed on cluster_signature so a restart
            # or a replay doesn't re-spend tokens on the same content.
            if not used_fallback and decision.fp_now:
                store.put_cached_summary(
                    signature=sig,
                    fingerprints_hash=decision.fp_now,
                    summary=summary_text or "",
                    troubleshooting=troubleshooting,
                    review_notes=notes,
                    approved=approved,
                )

    logger.info(
        "clusterer: processed=%d groups=%d new=%d",
        len(events), touched, new_count,
    )
    return ClusterResult(processed=len(events), incidents_touched=touched, new_incidents=new_count)
