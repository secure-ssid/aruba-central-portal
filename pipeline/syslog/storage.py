"""
SQLite-backed storage for syslog events, incidents, and alerts.

Design notes:
- WAL mode for concurrent reads (API) while writer (syslog server) appends.
- Schema covers all phases so future migrations aren't needed: raw `events`,
  clustered `incidents` (phase 2), and `alerts` (phase 5). Only `events`
  is written in phase 1.
- 7-day retention enforced by `prune_older_than`. Caller decides cadence.
- Single shared connection per thread — sqlite3 disallows sharing across
  threads by default; we use `check_same_thread=False` and guard writes
  with a lock since syslog UDP can fan in from many sources.
"""

from __future__ import annotations

import json
import logging
import os
import sqlite3
import threading
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)

DEFAULT_DB_PATH = Path(
    os.environ.get(
        "SYSLOG_DB_PATH",
        str(Path(__file__).resolve().parent.parent.parent / "data" / "syslog.db"),
    )
)

# 7-day retention, overridable via env for testing.
RETENTION_DAYS = int(os.environ.get("SYSLOG_RETENTION_DAYS", "7"))


SCHEMA = """
CREATE TABLE IF NOT EXISTS events (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    received_at     TEXT    NOT NULL,      -- ISO8601 UTC, server-side ingest time
    event_time      TEXT,                  -- ISO8601 UTC from the syslog timestamp (may be null)
    source_ip       TEXT    NOT NULL,
    transport       TEXT    NOT NULL,      -- 'udp' | 'tcp' | 'api'
    source          TEXT    DEFAULT 'udp', -- 'udp' | 'tcp' | 'central' | 'test'
    facility        INTEGER,
    severity        INTEGER,               -- 0 emerg .. 7 debug (RFC 5424)
    hostname        TEXT,
    app_name        TEXT,                  -- e.g. 'stm', 'sapd', 'fpapps'
    proc_id         TEXT,
    msg_id          TEXT,
    device_serial   TEXT,                  -- Aruba serial, extracted when present
    device_name     TEXT,                  -- Aruba AP/switch name
    event_code      TEXT,                  -- Aruba-style code like 'AP_EVENT_DOT11_ASSOC'
    message         TEXT    NOT NULL,      -- free-text remainder after header
    raw             TEXT    NOT NULL,      -- original bytes as utf-8 (or replace-decoded)
    structured_data TEXT                   -- RFC 5424 SD-ELEMENTs as JSON, else null
);

CREATE INDEX IF NOT EXISTS idx_events_received_at ON events(received_at);
CREATE INDEX IF NOT EXISTS idx_events_device_serial ON events(device_serial);
CREATE INDEX IF NOT EXISTS idx_events_severity ON events(severity);
CREATE INDEX IF NOT EXISTS idx_events_event_code ON events(event_code);
-- Note: idx_events_source_msgid depends on the `source` column added in
-- Phase 8. It's created in _POST_MIGRATION_INDEXES below so it runs
-- AFTER the ALTER TABLE migrations, otherwise existing pre-Phase-8 DBs
-- break at startup with "no such column: source".

-- Phase 2+ schema reserved now so migrations aren't needed later.
CREATE TABLE IF NOT EXISTS incidents (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    first_seen        TEXT NOT NULL,
    last_seen         TEXT NOT NULL,
    device_serial     TEXT,
    device_name       TEXT,        -- human-friendly label (AP name, hostname)
    client_mac        TEXT,        -- phase 11: per-client grouping on dashboard
    event_code        TEXT,
    severity          INTEGER,
    event_count       INTEGER NOT NULL DEFAULT 0,
    anomaly_score     REAL,
    cluster_signature TEXT,       -- hash of (device, code, window) for dedup
    status            TEXT NOT NULL DEFAULT 'open'  -- open | ack | resolved
);

CREATE INDEX IF NOT EXISTS idx_incidents_last_seen ON incidents(last_seen);
CREATE UNIQUE INDEX IF NOT EXISTS idx_incidents_signature ON incidents(cluster_signature);

CREATE TABLE IF NOT EXISTS incident_events (
    incident_id INTEGER NOT NULL,
    event_id    INTEGER NOT NULL,
    PRIMARY KEY (incident_id, event_id),
    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id)    REFERENCES events(id)    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS proposed_actions (
    id                     INTEGER PRIMARY KEY AUTOINCREMENT,
    incident_id            INTEGER NOT NULL,
    created_at             TEXT NOT NULL,
    action_type            TEXT NOT NULL,       -- matches ACTION_CATALOG key
    target_device_serial   TEXT,
    target_device_name     TEXT,
    params                 TEXT,                -- JSON blob of action-specific args
    status                 TEXT NOT NULL DEFAULT 'pending',
    -- pending | approved | rejected | executed | failed
    review_notes           TEXT,
    preflight_results      TEXT,                -- JSON of reviewer verdict
    executed_at            TEXT,
    execution_error        TEXT,
    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_actions_incident ON proposed_actions(incident_id);
CREATE INDEX IF NOT EXISTS idx_actions_status ON proposed_actions(status);

CREATE TABLE IF NOT EXISTS alerts (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    incident_id     INTEGER NOT NULL UNIQUE,
    created_at      TEXT NOT NULL,
    summary         TEXT NOT NULL,        -- LLM writer output (human summary)
    troubleshooting TEXT,                 -- JSON array of step strings
    review_notes    TEXT,                 -- LLM reviewer output
    approved        INTEGER NOT NULL DEFAULT 0,  -- 0 pending, 1 approved, -1 rejected
    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE
);

-- Phase 14a: reuse prior writer+reviewer output for a cluster signature
-- whose fingerprint set hasn't changed. Saves LLM calls across ticks and
-- across restarts (the in-memory skip in the clusterer loses state on
-- process exit; this table survives).
CREATE TABLE IF NOT EXISTS llm_summary_cache (
    signature        TEXT PRIMARY KEY,     -- incidents.cluster_signature
    fingerprints_hash TEXT NOT NULL,
    summary          TEXT NOT NULL,
    troubleshooting  TEXT,                 -- JSON array of steps
    review_notes     TEXT,
    approved         INTEGER NOT NULL DEFAULT 0,
    created_at       TEXT NOT NULL,
    last_used_at     TEXT NOT NULL,
    hits             INTEGER NOT NULL DEFAULT 0
);

-- Phase 14a: per-day LLM call counters so we can enforce a daily cap
-- and surface a "summaries today: N / cap" chip on the dashboard.
CREATE TABLE IF NOT EXISTS llm_metrics (
    date               TEXT PRIMARY KEY,   -- YYYY-MM-DD UTC
    calls_made         INTEGER NOT NULL DEFAULT 0,
    calls_skipped_cache     INTEGER NOT NULL DEFAULT 0,
    calls_skipped_cooldown  INTEGER NOT NULL DEFAULT 0,
    calls_skipped_min_size  INTEGER NOT NULL DEFAULT 0,
    calls_skipped_daily_cap INTEGER NOT NULL DEFAULT 0,
    calls_skipped_tick_cap  INTEGER NOT NULL DEFAULT 0,
    calls_skipped_fp_growth INTEGER NOT NULL DEFAULT 0
);
"""

# Lightweight in-line migration — additive columns added after the initial
# schema shipped. Safe to re-run; "duplicate column" is swallowed below.
_MIGRATIONS = [
    "ALTER TABLE alerts ADD COLUMN troubleshooting TEXT",
    "ALTER TABLE incidents ADD COLUMN device_name TEXT",
    # Phase 8: events can come from LAN syslog or the Aruba Central API.
    # 'udp' | 'tcp' | 'central' | 'test'. Back-filled to 'udp' for legacy
    # rows via the default; new rows will carry their actual source.
    "ALTER TABLE events ADD COLUMN source TEXT DEFAULT 'udp'",
    # Phase 11: carry client_mac on the incident so the dashboard can
    # roll up "same client bouncing off the same AP" as one group
    # without a second query per row.
    "ALTER TABLE incidents ADD COLUMN client_mac TEXT",
    # Phase 13: fingerprint = sha1(device_key, event_code, normalized_message).
    # Identical log lines repeating dozens of times collapse under the same
    # fingerprint. Used by the grouped-events UI to show one row per
    # distinct story with a count, and by the clusterer's LLM gate to
    # skip re-summarizing when only duplicate content has arrived.
    "ALTER TABLE events ADD COLUMN fingerprint TEXT",
    # Remember the fingerprint set an incident's alert was written for.
    # When the next tick adds only duplicate-fingerprint events, we
    # can reuse the existing summary — no LLM call needed.
    "ALTER TABLE alerts ADD COLUMN fingerprints_hash TEXT",
]

# Indexes that depend on migrated columns — must run AFTER _MIGRATIONS.
# Keeping them out of SCHEMA avoids the "no such column: source" crash
# that hit pre-Phase-8 DBs on upgrade (the CREATE INDEX was trying to
# reference a column the ALTER TABLE hadn't added yet).
_POST_MIGRATION_INDEXES = [
    "CREATE UNIQUE INDEX IF NOT EXISTS idx_events_source_msgid "
    "ON events(source, msg_id) WHERE msg_id IS NOT NULL",
    # Phase 13: grouped-events dashboard query plans over this.
    "CREATE INDEX IF NOT EXISTS idx_events_fingerprint ON events(fingerprint)",
]


@dataclass
class StoredEvent:
    """Row shape returned by queries."""
    id: int
    received_at: str
    event_time: str | None
    source_ip: str
    transport: str
    facility: int | None
    severity: int | None
    hostname: str | None
    app_name: str | None
    proc_id: str | None
    msg_id: str | None
    device_serial: str | None
    device_name: str | None
    event_code: str | None
    message: str
    raw: str
    structured_data: dict[str, Any] | None
    source: str = "udp"
    fingerprint: str | None = None

    @classmethod
    def from_row(cls, row: sqlite3.Row) -> StoredEvent:
        sd = row["structured_data"]
        # `source` is a phase-8 column; keys() membership guard lets the
        # dataclass load cleanly from legacy rows that predate the migration.
        keys = row.keys() if hasattr(row, "keys") else ()
        return cls(
            id=row["id"],
            received_at=row["received_at"],
            event_time=row["event_time"],
            source_ip=row["source_ip"],
            transport=row["transport"],
            facility=row["facility"],
            severity=row["severity"],
            hostname=row["hostname"],
            app_name=row["app_name"],
            proc_id=row["proc_id"],
            msg_id=row["msg_id"],
            device_serial=row["device_serial"],
            device_name=row["device_name"],
            event_code=row["event_code"],
            message=row["message"],
            raw=row["raw"],
            structured_data=json.loads(sd) if sd else None,
            source=row["source"] if "source" in keys else "udp",
            fingerprint=row["fingerprint"] if "fingerprint" in keys else None,
        )

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "received_at": self.received_at,
            "event_time": self.event_time,
            "source_ip": self.source_ip,
            "transport": self.transport,
            "facility": self.facility,
            "severity": self.severity,
            "hostname": self.hostname,
            "app_name": self.app_name,
            "proc_id": self.proc_id,
            "msg_id": self.msg_id,
            "device_serial": self.device_serial,
            "device_name": self.device_name,
            "event_code": self.event_code,
            "message": self.message,
            "structured_data": self.structured_data,
            "source": self.source,
        }


class SyslogStore:
    """Thread-safe SQLite wrapper for syslog persistence."""

    def __init__(self, db_path: Path | str = DEFAULT_DB_PATH) -> None:
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._write_lock = threading.Lock()
        self._conn = sqlite3.connect(
            self.db_path,
            check_same_thread=False,
            isolation_level=None,  # autocommit; we manage txns explicitly
        )
        self._conn.row_factory = sqlite3.Row
        self._init_schema()

    def _init_schema(self) -> None:
        with self._write_lock:
            # WAL lets readers run concurrently with the syslog writer thread.
            self._conn.execute("PRAGMA journal_mode=WAL")
            self._conn.execute("PRAGMA synchronous=NORMAL")
            self._conn.execute("PRAGMA foreign_keys=ON")
            self._conn.executescript(SCHEMA)
            # Additive column migrations — swallow "duplicate column name"
            # so this is idempotent across restarts.
            for stmt in _MIGRATIONS:
                try:
                    self._conn.execute(stmt)
                except sqlite3.OperationalError as exc:
                    if "duplicate column" not in str(exc).lower():
                        raise
            # Indexes that reference migrated columns — safe to run now.
            for stmt in _POST_MIGRATION_INDEXES:
                self._conn.execute(stmt)
        logger.info("SyslogStore initialized at %s", self.db_path)

    def close(self) -> None:
        with self._write_lock:
            self._conn.close()

    # ─────────────────────── writes ───────────────────────

    def insert_event(
        self,
        *,
        received_at: datetime,
        event_time: datetime | None,
        source_ip: str,
        transport: str,
        facility: int | None,
        severity: int | None,
        hostname: str | None,
        app_name: str | None,
        proc_id: str | None,
        msg_id: str | None,
        device_serial: str | None,
        device_name: str | None,
        event_code: str | None,
        message: str,
        raw: str,
        structured_data: dict[str, Any] | None,
        source: str = "udp",
    ) -> int:
        sd_json = json.dumps(structured_data) if structured_data else None
        # Compute the fingerprint once at insert time so downstream queries
        # and the dashboard rollup are a single GROUP BY instead of a full
        # scan. Normalized so identical content collapses across repeats.
        from .fingerprint import fingerprint as _fp  # local import avoids circular
        fp = _fp(
            device_serial or device_name or hostname or source_ip,
            event_code,
            message,
        )
        with self._write_lock:
            # INSERT OR IGNORE so a duplicate (source, msg_id) — common when
            # the Central poller re-scans an overlapping window — silently
            # skips without blowing up the whole batch.
            cur = self._conn.execute(
                """
                INSERT OR IGNORE INTO events (
                    received_at, event_time, source_ip, transport, source,
                    facility, severity, hostname, app_name, proc_id, msg_id,
                    device_serial, device_name, event_code, message, raw,
                    structured_data, fingerprint
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                """,
                (
                    _iso(received_at),
                    _iso(event_time) if event_time else None,
                    source_ip,
                    transport,
                    source,
                    facility,
                    severity,
                    hostname,
                    app_name,
                    proc_id,
                    msg_id,
                    device_serial,
                    device_name,
                    event_code,
                    message,
                    raw,
                    sd_json,
                    fp,
                ),
            )
            # If the INSERT was ignored (duplicate), look up the existing id.
            if cur.rowcount == 0 and msg_id is not None:
                existing = self._conn.execute(
                    "SELECT id FROM events WHERE source = ? AND msg_id = ?",
                    (source, msg_id),
                ).fetchone()
                if existing:
                    return int(existing["id"])
            return int(cur.lastrowid)

    def event_exists_by_source_msgid(self, source: str, msg_id: str | None) -> bool:
        """Used by the Central Events poller to tell insert-vs-dedup apart
        without relying on cursor.rowcount (which lies on INSERT OR IGNORE
        on some SQLite builds)."""
        if msg_id is None:
            return False
        row = self._conn.execute(
            "SELECT 1 FROM events WHERE source = ? AND msg_id = ? LIMIT 1",
            (source, msg_id),
        ).fetchone()
        return row is not None

    # ─────────────────────── reads ────────────────────────

    def list_events(
        self,
        *,
        limit: int = 100,
        offset: int = 0,
        since: datetime | None = None,
        severity_max: int | None = None,
        device_serial: str | None = None,
        event_code: str | None = None,
        search: str | None = None,
    ) -> list[StoredEvent]:
        sql = ["SELECT * FROM events WHERE 1=1"]
        params: list[Any] = []
        if since:
            sql.append("AND received_at >= ?")
            params.append(_iso(since))
        if severity_max is not None:
            sql.append("AND severity <= ?")
            params.append(severity_max)
        if device_serial:
            sql.append("AND device_serial = ?")
            params.append(device_serial)
        if event_code:
            sql.append("AND event_code = ?")
            params.append(event_code)
        if search:
            sql.append("AND message LIKE ?")
            params.append(f"%{search}%")
        sql.append("ORDER BY id DESC LIMIT ? OFFSET ?")
        params.extend([int(limit), int(offset)])

        cur = self._conn.execute(" ".join(sql), params)
        return [StoredEvent.from_row(r) for r in cur.fetchall()]

    def grouped_events(
        self,
        *,
        since: datetime | None = None,
        severity_max: int | None = None,
        device_key: str | None = None,
        limit: int = 200,
    ) -> list[dict[str, Any]]:
        """Return events rolled up by fingerprint (device + code + normalized
        message). Each row carries a count, first/last seen, a sample
        message, and the most-severe severity observed.

        Powers the "grouped events" tab — turns 500 identical MIC-failure
        lines into 1 row labelled "× 500".
        """
        sql = [
            "SELECT fingerprint,",
            "       COUNT(*) AS occurrences,",
            "       MIN(COALESCE(event_time, received_at)) AS first_seen,",
            "       MAX(COALESCE(event_time, received_at)) AS last_seen,",
            "       MIN(severity) AS worst_severity,",
            "       MAX(event_code) AS event_code,",
            "       MAX(device_serial) AS device_serial,",
            "       MAX(device_name) AS device_name,",
            "       MAX(hostname) AS hostname,",
            "       MAX(source) AS source,",
            "       MAX(message) AS sample_message",
            "FROM events WHERE fingerprint IS NOT NULL",
        ]
        params: list[Any] = []
        if since:
            sql.append("AND received_at >= ?")
            params.append(_iso(since))
        if severity_max is not None:
            sql.append("AND severity <= ?")
            params.append(severity_max)
        if device_key:
            sql.append("AND (device_serial = ? OR device_name = ? OR hostname = ?)")
            params.extend([device_key, device_key, device_key])
        sql.append("GROUP BY fingerprint")
        sql.append("ORDER BY occurrences DESC, last_seen DESC")
        sql.append("LIMIT ?")
        params.append(int(limit))
        cur = self._conn.execute(" ".join(sql), params)
        return [dict(r) for r in cur.fetchall()]

    def count_events(
        self,
        *,
        since: datetime | None = None,
        severity_max: int | None = None,
    ) -> int:
        sql = ["SELECT COUNT(*) AS n FROM events WHERE 1=1"]
        params: list[Any] = []
        if since:
            sql.append("AND received_at >= ?")
            params.append(_iso(since))
        if severity_max is not None:
            sql.append("AND severity <= ?")
            params.append(severity_max)
        row = self._conn.execute(" ".join(sql), params).fetchone()
        return int(row["n"])

    def stats(self, *, window: timedelta = timedelta(hours=24)) -> dict[str, Any]:
        """Summary counters for the dashboard widget."""
        since = datetime.now(timezone.utc) - window
        since_iso = _iso(since)
        total = self._conn.execute(
            "SELECT COUNT(*) n FROM events WHERE received_at >= ?",
            (since_iso,),
        ).fetchone()["n"]
        by_sev = {
            r["severity"]: r["n"]
            for r in self._conn.execute(
                "SELECT severity, COUNT(*) n FROM events "
                "WHERE received_at >= ? GROUP BY severity",
                (since_iso,),
            ).fetchall()
        }
        top_devices = [
            dict(r)
            for r in self._conn.execute(
                "SELECT device_serial, device_name, COUNT(*) n FROM events "
                "WHERE received_at >= ? AND device_serial IS NOT NULL "
                "GROUP BY device_serial ORDER BY n DESC LIMIT 10",
                (since_iso,),
            ).fetchall()
        ]
        top_codes = [
            dict(r)
            for r in self._conn.execute(
                "SELECT event_code, COUNT(*) n FROM events "
                "WHERE received_at >= ? AND event_code IS NOT NULL "
                "GROUP BY event_code ORDER BY n DESC LIMIT 10",
                (since_iso,),
            ).fetchall()
        ]
        return {
            "window_hours": window.total_seconds() / 3600,
            "total": int(total),
            "by_severity": by_sev,
            "top_devices": top_devices,
            "top_event_codes": top_codes,
        }

    # ─────────────────────── retention ────────────────────

    def prune_older_than(self, days: int = RETENTION_DAYS) -> int:
        """Delete events older than N days. Returns rows deleted.

        Note: we intentionally do NOT run VACUUM here. VACUUM requires an
        exclusive lock on the database and under WAL blocks every reader
        (dashboard API) for the duration. The page cache does reclaim
        freed pages as new rows arrive, so skipping VACUUM only costs us
        a small amount of on-disk slack. Set `SYSLOG_VACUUM_AFTER_PRUNE=true`
        to opt into the old behavior if the DB file ever gets large
        enough to justify the stall.
        """
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        vacuum = os.environ.get("SYSLOG_VACUUM_AFTER_PRUNE", "").lower() in ("1", "true", "yes")
        with self._write_lock:
            cur = self._conn.execute(
                "DELETE FROM events WHERE received_at < ?", (_iso(cutoff),)
            )
            deleted = cur.rowcount or 0
        if deleted and vacuum:
            # Run VACUUM outside the main connection so dashboard reads
            # can still use `self._conn`. Opens a short-lived connection,
            # executes VACUUM, closes. Still blocks writers — intentional.
            try:
                aux = sqlite3.connect(self.db_path, isolation_level=None)
                aux.execute("VACUUM")
                aux.close()
            except sqlite3.OperationalError as exc:
                logger.warning("VACUUM skipped (db busy): %s", exc)
        if deleted:
            logger.info("Pruned %d syslog events older than %d days", deleted, days)
        return deleted

    # ─────────────────────── incidents (phase 2) ──────────────

    def unclustered_events(
        self,
        *,
        since: datetime | None = None,
        limit: int = 1000,
    ) -> list[StoredEvent]:
        """Events not yet attached to any incident.

        Phase 2 clusterer reads this each tick, groups, and writes
        incident_events rows so the same event isn't reprocessed next tick.
        """
        sql = [
            "SELECT e.* FROM events e "
            "LEFT JOIN incident_events ie ON ie.event_id = e.id "
            "WHERE ie.event_id IS NULL",
        ]
        params: list[Any] = []
        if since:
            sql.append("AND e.received_at >= ?")
            params.append(_iso(since))
        sql.append("ORDER BY e.id ASC LIMIT ?")
        params.append(int(limit))
        cur = self._conn.execute(" ".join(sql), params)
        return [StoredEvent.from_row(r) for r in cur.fetchall()]

    def upsert_incident(
        self,
        *,
        cluster_signature: str,
        device_serial: str | None,
        device_name: str | None = None,
        client_mac: str | None = None,
        event_code: str | None,
        severity: int | None,
        first_seen: datetime,
        last_seen: datetime,
        event_ids: list[int],
    ) -> int:
        """Insert a new incident or extend an existing one with more events.

        Returns the incident id. The caller supplies `event_ids` — they are
        linked via `incident_events` so the same event is never double-counted
        by later clusterer ticks.
        """
        if not event_ids:
            raise ValueError("event_ids must be non-empty")
        with self._write_lock:
            row = self._conn.execute(
                "SELECT id, first_seen, last_seen, event_count, severity "
                "FROM incidents WHERE cluster_signature = ?",
                (cluster_signature,),
            ).fetchone()

            if row is None:
                cur = self._conn.execute(
                    "INSERT INTO incidents ("
                    "  first_seen, last_seen, device_serial, device_name, client_mac, "
                    "  event_code, severity, event_count, cluster_signature, status"
                    ") VALUES (?,?,?,?,?,?,?,?,?, 'open')",
                    (
                        _iso(first_seen),
                        _iso(last_seen),
                        device_serial,
                        device_name,
                        client_mac,
                        event_code,
                        severity,
                        len(event_ids),
                        cluster_signature,
                    ),
                )
                incident_id = int(cur.lastrowid)
            else:
                incident_id = int(row["id"])
                new_first = min(row["first_seen"], _iso(first_seen))
                new_last = max(row["last_seen"], _iso(last_seen))
                # Lowest severity number wins (emerg=0 beats debug=7).
                cur_sev = row["severity"]
                new_sev = severity if cur_sev is None else (
                    cur_sev if severity is None else min(cur_sev, severity)
                )
                # Back-fill device_name if the existing row didn't have one
                # (early events for a device may have been parsed before the
                # AOS 8 enricher could extract the human label).
                self._conn.execute(
                    "UPDATE incidents SET first_seen=?, last_seen=?, "
                    "event_count = event_count + ?, severity=?, "
                    "device_name = COALESCE(device_name, ?), "
                    "client_mac  = COALESCE(client_mac, ?) "
                    "WHERE id=?",
                    (new_first, new_last, len(event_ids), new_sev,
                     device_name, client_mac, incident_id),
                )

            self._conn.executemany(
                "INSERT OR IGNORE INTO incident_events (incident_id, event_id) VALUES (?,?)",
                [(incident_id, eid) for eid in event_ids],
            )
            return incident_id

    def list_incidents(
        self,
        *,
        limit: int = 50,
        offset: int = 0,
        status: str | None = None,
        since: datetime | None = None,
        severity_max: int | None = None,
        anomaly_min: float | None = None,
        order_by: str = "last_seen",
    ) -> list[dict[str, Any]]:
        sql = ["SELECT * FROM incidents WHERE 1=1"]
        params: list[Any] = []
        if status:
            sql.append("AND status = ?")
            params.append(status)
        if since:
            sql.append("AND last_seen >= ?")
            params.append(_iso(since))
        if severity_max is not None:
            sql.append("AND (severity IS NULL OR severity <= ?)")
            params.append(severity_max)
        if anomaly_min is not None:
            sql.append("AND COALESCE(anomaly_score, 0) >= ?")
            params.append(float(anomaly_min))

        # Allow-listed sort columns so query params can't inject SQL.
        sort_col = {"last_seen": "last_seen DESC",
                    "first_seen": "first_seen DESC",
                    "anomaly_score": "COALESCE(anomaly_score, 0) DESC, last_seen DESC",
                    "severity": "COALESCE(severity, 99) ASC, last_seen DESC",
                    }.get(order_by, "last_seen DESC")
        sql.append(f"ORDER BY {sort_col} LIMIT ? OFFSET ?")
        params.extend([int(limit), int(offset)])
        cur = self._conn.execute(" ".join(sql), params)
        return [dict(r) for r in cur.fetchall()]

    def overview_rows(
        self,
        *,
        since_hours: float = 24,
        limit: int = 50,
        include_resolved: bool = False,
        severity_max: int | None = None,
    ) -> list[dict[str, Any]]:
        """Problem-summary rows for the Overview landing page. One row per
        open/ack incident, with the LLM-written summary and first
        troubleshooting step surfaced so the dashboard renders without
        a second round-trip per row. Resolved and dismissed incidents
        are hidden by default.
        """
        since_iso = _iso(datetime.now(timezone.utc) - timedelta(hours=float(since_hours)))
        status_filter = "AND i.status IN ('open','ack')" if not include_resolved else ""
        sev_clause = ""
        params: list[Any] = [since_iso]
        if severity_max is not None:
            sev_clause = "AND (i.severity IS NULL OR i.severity <= ?)"
            params.append(int(severity_max))
        params.extend([int(limit)])

        sql = f"""
            SELECT
                i.id                 AS incident_id,
                i.cluster_signature  AS cluster_signature,
                i.first_seen         AS first_seen,
                i.last_seen          AS last_seen,
                i.device_serial      AS device_serial,
                i.device_name        AS device_name,
                i.client_mac         AS client_mac,
                i.event_code         AS event_code,
                i.severity           AS severity,
                i.event_count        AS event_count,
                i.anomaly_score      AS anomaly_score,
                i.status             AS status,
                a.summary            AS summary,
                a.troubleshooting    AS troubleshooting,
                a.approved           AS approved
            FROM incidents i
            LEFT JOIN alerts a ON a.incident_id = i.id
            WHERE i.last_seen >= ?
              {status_filter}
              {sev_clause}
            ORDER BY
              COALESCE(i.anomaly_score, 0) DESC,
              COALESCE(i.severity, 99) ASC,
              i.last_seen DESC
            LIMIT ?
        """
        cur = self._conn.execute(sql, params)
        rows: list[dict[str, Any]] = []
        for r in cur.fetchall():
            d = dict(r)
            tb_raw = d.pop("troubleshooting", None)
            try:
                steps = json.loads(tb_raw) if tb_raw else []
            except (ValueError, TypeError):
                steps = []
            d["troubleshooting"] = steps
            d["suggested_fix"] = steps[0] if steps else None
            d["has_llm_summary"] = bool(d.get("summary"))
            rows.append(d)
        return rows

    def get_incident(self, incident_id: int) -> dict[str, Any] | None:
        row = self._conn.execute(
            "SELECT * FROM incidents WHERE id = ?", (incident_id,)
        ).fetchone()
        return dict(row) if row else None

    def get_incident_by_signature(self, signature: str) -> dict[str, Any] | None:
        row = self._conn.execute(
            "SELECT * FROM incidents WHERE cluster_signature = ?", (signature,)
        ).fetchone()
        return dict(row) if row else None

    def incident_events(self, incident_id: int, *, limit: int = 200) -> list[StoredEvent]:
        cur = self._conn.execute(
            "SELECT e.* FROM events e "
            "JOIN incident_events ie ON ie.event_id = e.id "
            "WHERE ie.incident_id = ? "
            "ORDER BY e.id ASC LIMIT ?",
            (incident_id, int(limit)),
        )
        return [StoredEvent.from_row(r) for r in cur.fetchall()]

    def update_incident_status(self, incident_id: int, status: str) -> bool:
        if status not in ("open", "ack", "resolved"):
            raise ValueError(f"invalid status: {status}")
        with self._write_lock:
            cur = self._conn.execute(
                "UPDATE incidents SET status = ? WHERE id = ?",
                (status, incident_id),
            )
        return (cur.rowcount or 0) > 0

    def delete_incident(self, incident_id: int) -> bool:
        """Hard-delete an incident and its FK-linked alert + incident_events.

        Used by the dashboard "dismiss" button when an operator wants a row
        to disappear entirely. The raw `events` rows stay in place so the
        same burst won't immediately re-cluster — they're still linked to
        the incident row via `incident_events` (which ON DELETE CASCADE's
        those link rows away).
        """
        with self._write_lock:
            cur = self._conn.execute(
                "DELETE FROM incidents WHERE id = ?", (incident_id,)
            )
        return (cur.rowcount or 0) > 0

    def set_incident_anomaly_score(self, incident_id: int, score: float) -> None:
        with self._write_lock:
            self._conn.execute(
                "UPDATE incidents SET anomaly_score = ? WHERE id = ?",
                (float(score), incident_id),
            )

    # ─────────────────────── alerts (phase 4+) ────────────────

    def upsert_alert(
        self,
        *,
        incident_id: int,
        summary: str,
        troubleshooting: list[str] | None = None,
        review_notes: str | None = None,
        approved: int = 0,
    ) -> int:
        """Create or replace the alert row for an incident.

        The alerts table has a UNIQUE constraint on incident_id, so
        re-writing a summary (e.g. after the incident grew) updates the
        same row instead of stacking duplicates in the UI.
        """
        now_iso = _iso(datetime.now(timezone.utc))
        ts_json = json.dumps(list(troubleshooting)) if troubleshooting else None
        with self._write_lock:
            row = self._conn.execute(
                "SELECT id FROM alerts WHERE incident_id = ?", (incident_id,)
            ).fetchone()
            if row is None:
                cur = self._conn.execute(
                    "INSERT INTO alerts ("
                    "  incident_id, created_at, summary, troubleshooting, "
                    "  review_notes, approved"
                    ") VALUES (?,?,?,?,?,?)",
                    (incident_id, now_iso, summary, ts_json, review_notes, int(approved)),
                )
                return int(cur.lastrowid)
            alert_id = int(row["id"])
            self._conn.execute(
                "UPDATE alerts SET summary=?, troubleshooting=?, review_notes=?, approved=? "
                "WHERE id=?",
                (summary, ts_json, review_notes, int(approved), alert_id),
            )
            return alert_id

    def get_alert_by_incident(self, incident_id: int) -> dict[str, Any] | None:
        row = self._conn.execute(
            "SELECT * FROM alerts WHERE incident_id = ?", (incident_id,)
        ).fetchone()
        if not row:
            return None
        return _decode_alert_row(row)

    def list_alerts(
        self,
        *,
        limit: int = 50,
        offset: int = 0,
        approved_only: bool = False,
        since: datetime | None = None,
    ) -> list[dict[str, Any]]:
        """Alerts joined with their incident row so the dashboard gets both
        the LLM summary and the underlying severity/score in one call.
        """
        sql = [
            "SELECT a.*, i.device_serial, i.device_name, i.client_mac, "
            "       i.event_code, i.severity, i.event_count, i.anomaly_score, "
            "       i.first_seen, i.last_seen, i.status AS incident_status "
            "FROM alerts a JOIN incidents i ON i.id = a.incident_id WHERE 1=1",
        ]
        params: list[Any] = []
        if approved_only:
            sql.append("AND a.approved = 1")
        if since:
            sql.append("AND a.created_at >= ?")
            params.append(_iso(since))
        sql.append("ORDER BY a.created_at DESC LIMIT ? OFFSET ?")
        params.extend([int(limit), int(offset)])
        cur = self._conn.execute(" ".join(sql), params)
        return [_decode_alert_row(r) for r in cur.fetchall()]

    def incident_fingerprints_hash(self, incident_id: int) -> str:
        """Hash of the sorted, distinct fingerprints covered by this
        incident. Used by the clusterer to tell "same content" (skip
        the LLM) apart from "new content" (re-run writer + reviewer).
        """
        cur = self._conn.execute(
            """
            SELECT DISTINCT e.fingerprint
            FROM events e
            JOIN incident_events ie ON ie.event_id = e.id
            WHERE ie.incident_id = ? AND e.fingerprint IS NOT NULL
            ORDER BY e.fingerprint
            """,
            (incident_id,),
        )
        fps = [r["fingerprint"] for r in cur.fetchall()]
        if not fps:
            return ""
        import hashlib
        return hashlib.sha1("|".join(fps).encode("utf-8")).hexdigest()[:16]

    def alert_fingerprints_hash(self, incident_id: int) -> str | None:
        """Return the last fingerprints_hash we wrote into the alert row
        for this incident, or None if no alert yet."""
        row = self._conn.execute(
            "SELECT fingerprints_hash FROM alerts WHERE incident_id = ?",
            (incident_id,),
        ).fetchone()
        return row["fingerprints_hash"] if row else None

    def set_alert_fingerprints_hash(self, incident_id: int, fp_hash: str) -> None:
        """Record the fingerprint set the current alert was written for."""
        with self._write_lock:
            self._conn.execute(
                "UPDATE alerts SET fingerprints_hash = ? WHERE incident_id = ?",
                (fp_hash, incident_id),
            )

    # ─────────────────────── LLM summary cache / metrics (phase 14a) ──────

    def get_cached_summary(
        self, signature: str, fingerprints_hash: str
    ) -> dict[str, Any] | None:
        """Return a prior writer+reviewer output for this cluster signature
        iff its fingerprint set hasn't changed. Caller should reuse it
        verbatim instead of re-calling the LLM. Bumps hit counter."""
        if not signature or not fingerprints_hash:
            return None
        row = self._conn.execute(
            "SELECT * FROM llm_summary_cache WHERE signature = ?",
            (signature,),
        ).fetchone()
        if not row or row["fingerprints_hash"] != fingerprints_hash:
            return None
        with self._write_lock:
            self._conn.execute(
                "UPDATE llm_summary_cache SET hits = hits + 1, last_used_at = ? "
                "WHERE signature = ?",
                (_iso(datetime.now(timezone.utc)), signature),
            )
        tb = row["troubleshooting"]
        return {
            "summary": row["summary"],
            "troubleshooting": json.loads(tb) if tb else [],
            "review_notes": row["review_notes"],
            "approved": int(row["approved"] or 0),
            "last_used_at": row["last_used_at"],
        }

    def put_cached_summary(
        self,
        *,
        signature: str,
        fingerprints_hash: str,
        summary: str,
        troubleshooting: list[str] | None,
        review_notes: str | None,
        approved: int,
    ) -> None:
        if not signature:
            return
        now = _iso(datetime.now(timezone.utc))
        tb = json.dumps(troubleshooting or [])
        with self._write_lock:
            self._conn.execute(
                """
                INSERT INTO llm_summary_cache
                    (signature, fingerprints_hash, summary, troubleshooting,
                     review_notes, approved, created_at, last_used_at, hits)
                VALUES (?,?,?,?,?,?,?,?,0)
                ON CONFLICT(signature) DO UPDATE SET
                    fingerprints_hash = excluded.fingerprints_hash,
                    summary           = excluded.summary,
                    troubleshooting   = excluded.troubleshooting,
                    review_notes      = excluded.review_notes,
                    approved          = excluded.approved,
                    last_used_at      = excluded.last_used_at
                """,
                (signature, fingerprints_hash, summary, tb,
                 review_notes, int(approved), now, now),
            )

    def cached_summary_age_seconds(self, signature: str) -> float | None:
        """How long ago was this signature's LLM summary generated?
        Used by the cooldown gate — skip the LLM if a recent call exists
        even when fingerprints have drifted slightly."""
        row = self._conn.execute(
            "SELECT last_used_at FROM llm_summary_cache WHERE signature = ?",
            (signature,),
        ).fetchone()
        if not row:
            return None
        try:
            ts = datetime.fromisoformat(row["last_used_at"].replace("Z", "+00:00"))
        except (ValueError, AttributeError):
            return None
        return (datetime.now(timezone.utc) - ts).total_seconds()

    def _today_utc(self) -> str:
        return datetime.now(timezone.utc).strftime("%Y-%m-%d")

    def incr_llm_metric(self, field: str, delta: int = 1) -> None:
        """Bump one of the llm_metrics counters for today. `field` must be
        one of the column names on llm_metrics — caller's responsibility
        (validated here to prevent SQL injection through the column name)."""
        allowed = {
            "calls_made",
            "calls_skipped_cache",
            "calls_skipped_cooldown",
            "calls_skipped_min_size",
            "calls_skipped_daily_cap",
            "calls_skipped_tick_cap",
            "calls_skipped_fp_growth",
        }
        if field not in allowed:
            raise ValueError(f"unknown llm metric field: {field}")
        today = self._today_utc()
        with self._write_lock:
            self._conn.execute(
                "INSERT INTO llm_metrics (date) VALUES (?) "
                "ON CONFLICT(date) DO NOTHING",
                (today,),
            )
            self._conn.execute(
                f"UPDATE llm_metrics SET {field} = {field} + ? WHERE date = ?",
                (int(delta), today),
            )

    def llm_calls_today(self) -> int:
        row = self._conn.execute(
            "SELECT calls_made FROM llm_metrics WHERE date = ?",
            (self._today_utc(),),
        ).fetchone()
        return int(row["calls_made"]) if row else 0

    def get_llm_metrics(self, days: int = 1) -> dict[str, Any]:
        """Return today's counters plus an N-day rollup."""
        today = self._today_utc()
        today_row = self._conn.execute(
            "SELECT * FROM llm_metrics WHERE date = ?", (today,),
        ).fetchone()
        fields = [
            "calls_made", "calls_skipped_cache", "calls_skipped_cooldown",
            "calls_skipped_min_size", "calls_skipped_daily_cap",
            "calls_skipped_tick_cap", "calls_skipped_fp_growth",
        ]
        today_d = {f: int(today_row[f]) if today_row else 0 for f in fields}
        cutoff = (datetime.now(timezone.utc) - timedelta(days=days)).strftime("%Y-%m-%d")
        agg_sql = ",".join(f"COALESCE(SUM({f}),0) AS {f}" for f in fields)
        agg_row = self._conn.execute(
            f"SELECT {agg_sql} FROM llm_metrics WHERE date >= ?", (cutoff,),
        ).fetchone()
        window_d = {f: int(agg_row[f]) if agg_row else 0 for f in fields}
        return {"today": today_d, "window_days": days, "window": window_d}

    def update_alert_review(
        self,
        alert_id: int,
        *,
        review_notes: str | None,
        approved: int,
    ) -> bool:
        """Reviewer agent writes back its verdict (approved=-1 rejected,
        0 pending, 1 approved)."""
        if approved not in (-1, 0, 1):
            raise ValueError(f"invalid approved flag: {approved}")
        with self._write_lock:
            cur = self._conn.execute(
                "UPDATE alerts SET review_notes=?, approved=? WHERE id=?",
                (review_notes, int(approved), alert_id),
            )
        return (cur.rowcount or 0) > 0

    # ─────────────────────── proposed actions (phase 10) ──────

    def insert_proposed_action(
        self,
        *,
        incident_id: int,
        action_type: str,
        target_device_serial: str | None = None,
        target_device_name: str | None = None,
        params: dict[str, Any] | None = None,
    ) -> int:
        now_iso = _iso(datetime.now(timezone.utc))
        params_json = json.dumps(params) if params else None
        with self._write_lock:
            cur = self._conn.execute(
                """
                INSERT INTO proposed_actions (
                    incident_id, created_at, action_type,
                    target_device_serial, target_device_name, params, status
                ) VALUES (?,?,?,?,?,?, 'pending')
                """,
                (incident_id, now_iso, action_type,
                 target_device_serial, target_device_name, params_json),
            )
        return int(cur.lastrowid)

    def list_proposed_actions(
        self,
        *,
        incident_id: int | None = None,
        status: str | None = None,
        limit: int = 100,
    ) -> list[dict[str, Any]]:
        sql = ["SELECT * FROM proposed_actions WHERE 1=1"]
        params: list[Any] = []
        if incident_id is not None:
            sql.append("AND incident_id = ?")
            params.append(int(incident_id))
        if status:
            sql.append("AND status = ?")
            params.append(status)
        sql.append("ORDER BY created_at DESC LIMIT ?")
        params.append(int(limit))
        cur = self._conn.execute(" ".join(sql), params)
        return [_decode_action_row(r) for r in cur.fetchall()]

    def get_proposed_action(self, action_id: int) -> dict[str, Any] | None:
        row = self._conn.execute(
            "SELECT * FROM proposed_actions WHERE id = ?", (action_id,)
        ).fetchone()
        return _decode_action_row(row) if row else None

    def update_proposed_action(
        self,
        action_id: int,
        *,
        status: str | None = None,
        review_notes: str | None = None,
        preflight_results: dict[str, str] | None = None,
        executed_at: datetime | None = None,
        execution_error: str | None = None,
    ) -> bool:
        """Partial update — only non-None kwargs are written. Raises
        ValueError on an unknown status so typos fail loud."""
        valid = ("pending", "approved", "rejected", "executed", "failed")
        if status is not None and status not in valid:
            raise ValueError(f"invalid action status: {status}")

        fields: list[str] = []
        values: list[Any] = []
        if status is not None:
            fields.append("status = ?")
            values.append(status)
        if review_notes is not None:
            fields.append("review_notes = ?")
            values.append(review_notes)
        if preflight_results is not None:
            fields.append("preflight_results = ?")
            values.append(json.dumps(preflight_results))
        if executed_at is not None:
            fields.append("executed_at = ?")
            values.append(_iso(executed_at))
        if execution_error is not None:
            fields.append("execution_error = ?")
            values.append(execution_error)

        if not fields:
            return False
        values.append(action_id)
        with self._write_lock:
            cur = self._conn.execute(
                f"UPDATE proposed_actions SET {', '.join(fields)} WHERE id = ?",
                values,
            )
        return (cur.rowcount or 0) > 0

    # ─────────────────────── anomaly baseline (phase 3) ───────

    def bucketed_event_counts(
        self,
        *,
        device_key: str,
        event_code: str | None,
        window_sec: int,
        since: datetime,
        before: datetime,
    ) -> list[tuple[str, int]]:
        """
        Return per-bucket event counts for a (device_key, event_code) pair,
        excluding the bucket that starts at `before`. Bucket boundaries are
        aligned to the epoch with the given `window_sec` — identical to the
        clusterer's `_bucket_start` so counts are comparable.

        `device_key` may match any of `device_serial`, `hostname`, or
        `source_ip` (in that priority). `event_code` None means NOCODE, i.e.
        rows where `event_code` column is NULL.

        Returns [(bucket_iso, count), ...] sorted by bucket ascending.
        """
        # Use strftime('%s') to get epoch seconds from the stored ISO
        # timestamp. Prefer event_time; fall back to received_at.
        ts_expr = "CAST(strftime('%s', COALESCE(event_time, received_at)) AS INTEGER)"
        bucket_expr = f"({ts_expr} / ?) * ?"

        sql = [
            "SELECT",
            f"  {bucket_expr} AS bucket_epoch,",
            "  COUNT(*) AS n",
            "FROM events",
            "WHERE (device_serial = ? OR hostname = ? OR source_ip = ?)",
        ]
        params: list[Any] = [window_sec, window_sec, device_key, device_key, device_key]

        if event_code is None:
            sql.append("AND event_code IS NULL")
        else:
            sql.append("AND event_code = ?")
            params.append(event_code)

        # Time bounds — COALESCE again so events without event_time still
        # fall into a bucket based on ingest time.
        sql.append("AND COALESCE(event_time, received_at) >= ?")
        params.append(_iso(since))
        sql.append("AND COALESCE(event_time, received_at) < ?")
        params.append(_iso(before))

        sql.append("GROUP BY bucket_epoch ORDER BY bucket_epoch ASC")

        cur = self._conn.execute(" ".join(sql), params)
        out: list[tuple[str, int]] = []
        for row in cur.fetchall():
            bucket_dt = datetime.fromtimestamp(row["bucket_epoch"], tz=timezone.utc)
            out.append((_iso(bucket_dt), int(row["n"])))
        return out


def _iso(dt: datetime) -> str:
    """Normalize to ISO8601 UTC with trailing Z, microsecond precision."""
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def _decode_action_row(row: sqlite3.Row) -> dict[str, Any]:
    """Parse the JSON columns on a proposed_actions row into real types
    so callers don't have to juggle json.loads everywhere."""
    d = dict(row)
    for key in ("params", "preflight_results"):
        raw_val = d.get(key)
        if raw_val:
            try:
                d[key] = json.loads(raw_val)
            except (TypeError, ValueError):
                d[key] = {}
        else:
            d[key] = {} if key == "preflight_results" else None
    return d


def _decode_alert_row(row: sqlite3.Row) -> dict[str, Any]:
    """Turn an alerts row into a dashboard-friendly dict. Parses the
    JSON-encoded `troubleshooting` column into a list; keeps an empty
    list when the column is null/blank so the frontend never has to
    guard against `undefined.map`."""
    d = dict(row)
    raw_ts = d.get("troubleshooting")
    if raw_ts:
        try:
            parsed = json.loads(raw_ts)
            d["troubleshooting"] = parsed if isinstance(parsed, list) else []
        except (TypeError, ValueError):
            d["troubleshooting"] = []
    else:
        d["troubleshooting"] = []
    return d
