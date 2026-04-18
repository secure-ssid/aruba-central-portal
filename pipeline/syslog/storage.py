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
    transport       TEXT    NOT NULL,      -- 'udp' | 'tcp'
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

-- Phase 2+ schema reserved now so migrations aren't needed later.
CREATE TABLE IF NOT EXISTS incidents (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    first_seen        TEXT NOT NULL,
    last_seen         TEXT NOT NULL,
    device_serial     TEXT,
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

CREATE TABLE IF NOT EXISTS alerts (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    incident_id   INTEGER NOT NULL UNIQUE,
    created_at    TEXT NOT NULL,
    summary       TEXT NOT NULL,       -- LLM writer output
    review_notes  TEXT,                -- LLM reviewer output
    approved      INTEGER NOT NULL DEFAULT 0,  -- 0 pending, 1 approved, -1 rejected
    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE
);
"""


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

    @classmethod
    def from_row(cls, row: sqlite3.Row) -> StoredEvent:
        sd = row["structured_data"]
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
    ) -> int:
        sd_json = json.dumps(structured_data) if structured_data else None
        with self._write_lock:
            cur = self._conn.execute(
                """
                INSERT INTO events (
                    received_at, event_time, source_ip, transport,
                    facility, severity, hostname, app_name, proc_id, msg_id,
                    device_serial, device_name, event_code, message, raw, structured_data
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                """,
                (
                    _iso(received_at),
                    _iso(event_time) if event_time else None,
                    source_ip,
                    transport,
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
                ),
            )
            return int(cur.lastrowid)

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
        """Delete events older than N days. Returns rows deleted."""
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        with self._write_lock:
            cur = self._conn.execute(
                "DELETE FROM events WHERE received_at < ?", (_iso(cutoff),)
            )
            deleted = cur.rowcount or 0
            if deleted:
                self._conn.execute("VACUUM")
        if deleted:
            logger.info("Pruned %d syslog events older than %d days", deleted, days)
        return deleted


def _iso(dt: datetime) -> str:
    """Normalize to ISO8601 UTC with trailing Z, microsecond precision."""
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")
