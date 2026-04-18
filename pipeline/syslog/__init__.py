"""
Syslog ingest pipeline.

Receives RFC 3164 / RFC 5424 syslog from Aruba APs, switches, and gateways
on the local network, parses and persists to SQLite for downstream
clustering, anomaly detection, and human-readable alerting.

Phase 1 scope: ingest + parse + store + list API. No clustering yet.
"""

from .anomaly import AnomalyScore, score_incident
from .clusterer import ClusterResult, cluster_once
from .parser import ParsedEvent, parse_syslog
from .server import SyslogServer, get_store, start_default_server
from .storage import DEFAULT_DB_PATH, SyslogStore
from .writer_agent import fallback_summary, write_alert

__all__ = [
    "SyslogStore",
    "DEFAULT_DB_PATH",
    "parse_syslog",
    "ParsedEvent",
    "SyslogServer",
    "get_store",
    "start_default_server",
    "cluster_once",
    "ClusterResult",
    "score_incident",
    "AnomalyScore",
    "write_alert",
    "fallback_summary",
]
