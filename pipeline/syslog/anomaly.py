"""
Statistical anomaly scoring for clustered incidents.

Goal: answer "is this burst of events unusual for this device?" without ML,
without calling an LLM, and without persistent state beyond what's already
in the `events` table.

Approach
--------
For an incident covering one (device, event_code, bucket), we compare its
`event_count` to the distribution of event counts for the SAME
(device, event_code) across prior aligned buckets inside the retention
window.

  score = max(0, (current - mean) / max(stddev, floor))

- Modified z-score, floored at 0 (only spikes matter for alerting).
- `floor=1.0` on stddev avoids division-by-zero when history is flat; it
  also makes "usually 0, now 5" score high without being infinite.
- Cold-start (< MIN_HISTORY buckets): score = `current / COLD_DIVISOR`
  so a genuine flood on a brand-new device/code still surfaces, but a
  single first-time event doesn't pretend to be a 10-sigma event.

Why buckets, not raw rates?
- The clusterer already aligns events to `CLUSTER_WINDOW` buckets, so
  comparing per-bucket counts makes the statistics consistent with the
  unit the operator sees in the UI ("this incident had 47 events; the
  baseline is 2").

This module is pure and side-effect-free — `score_incident()` reads
counts from the store and returns a float. The clusterer (or a future
scheduler) decides when to persist.
"""

from __future__ import annotations

import logging
import math
import os
from dataclasses import dataclass
from datetime import datetime, timedelta

from .storage import SyslogStore

logger = logging.getLogger(__name__)

# Inherit the cluster bucket size for apples-to-apples comparison.
ANOMALY_WINDOW_SEC = int(os.environ.get("SYSLOG_CLUSTER_WINDOW_SEC", "300"))

# How far back to pull baseline samples. Default = full retention window.
ANOMALY_LOOKBACK_DAYS = int(os.environ.get("SYSLOG_ANOMALY_LOOKBACK_DAYS", "7"))

# Below this many historical buckets we fall back to the cold-start rule.
ANOMALY_MIN_HISTORY = int(os.environ.get("SYSLOG_ANOMALY_MIN_HISTORY", "3"))

# Divisor for cold-start: score = current_count / this. Default 5 means a
# burst of 15 events on a brand-new device/code = score 3 (warning-ish).
ANOMALY_COLD_DIVISOR = float(os.environ.get("SYSLOG_ANOMALY_COLD_DIVISOR", "5"))

# Stddev floor — prevents infinite scores when history is perfectly flat.
ANOMALY_STDDEV_FLOOR = float(os.environ.get("SYSLOG_ANOMALY_STDDEV_FLOOR", "1.0"))


@dataclass
class AnomalyScore:
    """Result of scoring one incident. Useful for tests and debugging."""
    score: float
    samples: int          # number of historical buckets we found
    mean: float
    stddev: float
    cold_start: bool      # True when we fell back to the cold-start rule


def score_incident(
    store: SyslogStore,
    *,
    device_key: str,
    event_code: str | None,
    current_count: int,
    bucket_start: datetime,
    window_sec: int = ANOMALY_WINDOW_SEC,
    lookback_days: int = ANOMALY_LOOKBACK_DAYS,
    min_history: int = ANOMALY_MIN_HISTORY,
    cold_divisor: float = ANOMALY_COLD_DIVISOR,
    stddev_floor: float = ANOMALY_STDDEV_FLOOR,
) -> AnomalyScore:
    """Score one incident. Pure — never writes to the store."""
    if current_count <= 0:
        return AnomalyScore(0.0, 0, 0.0, 0.0, cold_start=False)

    lookback_cutoff = bucket_start - timedelta(days=lookback_days)
    # History = historical per-bucket counts EXCLUDING the current bucket.
    # `bucketed_event_counts` returns (bucket_iso, count) pairs.
    samples = store.bucketed_event_counts(
        device_key=device_key,
        event_code=event_code,
        window_sec=window_sec,
        since=lookback_cutoff,
        before=bucket_start,
    )

    if len(samples) < min_history:
        # Cold-start: a burst on a new device/code is still interesting,
        # but don't pretend we have statistics we don't have.
        score = max(0.0, float(current_count) / max(cold_divisor, 1.0))
        return AnomalyScore(
            score=round(score, 2),
            samples=len(samples),
            mean=0.0,
            stddev=0.0,
            cold_start=True,
        )

    counts = [c for _, c in samples]
    mean = sum(counts) / len(counts)
    variance = sum((c - mean) ** 2 for c in counts) / len(counts)
    stddev = math.sqrt(variance)
    denom = max(stddev, stddev_floor)
    z = (current_count - mean) / denom
    score = max(0.0, z)

    return AnomalyScore(
        score=round(score, 2),
        samples=len(samples),
        mean=round(mean, 2),
        stddev=round(stddev, 2),
        cold_start=False,
    )
