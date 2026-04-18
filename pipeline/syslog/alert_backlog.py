"""
Backlog pass: generate alerts for over-threshold incidents that have no
alert row yet.

Why this exists: the clusterer only writes alerts as a side effect of
mutating an incident (new events extending the row). Incidents that
crossed the anomaly threshold *before* a config change — e.g. the user
bumping SYSLOG_WRITER_THRESHOLD down from 4.0 to 2.5 — never see a
writer call. This function catches them up in one sweep.

Safe to re-run. Skips any incident that already has an alert row, so
running it every startup is a no-op when nothing's behind.

Rate-limited by per-call LLM budget, not by incident count — we cap how
many incidents we process per pass so a big backlog doesn't blow the
free tier in 10 seconds.
"""

from __future__ import annotations

import logging
import os

from pipeline.llm import LLMError

from .reviewer_agent import review_alert
from .storage import SyslogStore
from .writer_agent import fallback_summary, fallback_troubleshooting, write_alert

logger = logging.getLogger(__name__)

BACKLOG_ENABLED = os.environ.get("SYSLOG_BACKLOG_ENABLED", "true").lower() in ("1", "true", "yes")
BACKLOG_LIMIT = int(os.environ.get("SYSLOG_BACKLOG_LIMIT", "20"))
BACKLOG_THRESHOLD = float(os.environ.get("SYSLOG_WRITER_THRESHOLD", "2.5"))


def run_backlog(store: SyslogStore, *, limit: int = BACKLOG_LIMIT) -> dict:
    """Generate alerts for incidents that cleared the threshold but have
    no alert row. Returns a summary dict for logging."""
    if not BACKLOG_ENABLED:
        return {"skipped": "disabled"}

    all_incidents = store.list_incidents(limit=10_000)
    pending = [
        i for i in all_incidents
        if (i.get("anomaly_score") or 0) >= BACKLOG_THRESHOLD
        and not store.get_alert_by_incident(i["id"])
    ]
    if not pending:
        return {"checked": len(all_incidents), "backlog": 0}

    logger.info("alert backlog: %d incidents above threshold need alerts", len(pending))
    processed = 0
    fell_back = 0
    approved = 0
    rejected = 0
    for inc in pending[:limit]:
        events = store.incident_events(inc["id"], limit=20)
        notes: str | None = None
        used_fallback = False
        try:
            llm = write_alert(inc, events)
            summary = llm.summary
            troubleshooting = llm.troubleshooting or fallback_troubleshooting(inc)
        except LLMError as exc:
            logger.warning("backlog: writer unavailable for incident=%s (%s)", inc["id"], exc)
            summary = fallback_summary(inc)
            troubleshooting = fallback_troubleshooting(inc)
            notes = f"fallback: {exc}"
            used_fallback = True

        approved_flag = 0
        if not used_fallback:
            try:
                verdict = review_alert(inc, events, summary)
                if verdict.pending:
                    approved_flag = 0
                    notes = f"review pending: {verdict.notes}"
                else:
                    approved_flag = 1 if verdict.approved else -1
                    notes = verdict.notes
                    if verdict.approved:
                        approved += 1
                    else:
                        rejected += 1
            except LLMError as exc:
                notes = f"review unavailable: {exc}"

        store.upsert_alert(
            incident_id=inc["id"],
            summary=summary,
            troubleshooting=troubleshooting,
            review_notes=notes,
            approved=approved_flag,
        )
        processed += 1
        if used_fallback:
            fell_back += 1

    summary_dict = {
        "checked": len(all_incidents),
        "backlog": len(pending),
        "processed": processed,
        "fallback": fell_back,
        "approved": approved,
        "rejected": rejected,
    }
    logger.info("alert backlog complete: %s", summary_dict)
    return summary_dict
