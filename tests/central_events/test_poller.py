"""Tests for the Central Events poller — idempotent ingest + error paths."""

from pathlib import Path
from unittest.mock import MagicMock

import pytest

from pipeline.central_events.poller import PollResult, poll_once
from pipeline.syslog.storage import SyslogStore


@pytest.fixture()
def store(tmp_path: Path) -> SyslogStore:
    s = SyslogStore(tmp_path / "syslog.db")
    yield s
    s.close()


def _mk_api(events: list[dict]) -> MagicMock:
    api = MagicMock()
    api.get.return_value = {"events": events}
    return api


def _fake_event(eid: str, ts: str = "2026-04-18T00:01:50Z", code: str = "Client Onboarding Failure - Key Exchange") -> dict:
    return {
        "event-id": eid,
        "occurred-at": ts,
        "serial": "PHSXM52029",
        "device-hostname": "LR-AP735",
        "event-type": code,
        "description": f"event {eid}",
    }


def test_poll_empty_response_safe(store):
    api = _mk_api([])
    result = poll_once(store, api)
    assert result.ingested == 0
    assert result.skipped_duplicates == 0
    assert result.api_error is None


def test_poll_api_error_returned_not_raised(store):
    api = MagicMock()
    api.get.side_effect = Exception("boom")
    result = poll_once(store, api)
    assert result.api_error == "boom"
    assert result.ingested == 0


def test_poll_ingests_events(store):
    api = _mk_api([_fake_event("evt-1"), _fake_event("evt-2")])
    result = poll_once(store, api)
    assert result.ingested == 2
    assert result.skipped_duplicates == 0
    assert store.count_events() == 2


def test_poll_is_idempotent_on_reruns(store):
    api = _mk_api([_fake_event("evt-1"), _fake_event("evt-2")])
    first = poll_once(store, api)
    second = poll_once(store, api)
    assert first.ingested == 2
    assert second.ingested == 0
    assert second.skipped_duplicates == 2
    # Still only 2 rows — the UNIQUE index on (source, msg_id) held.
    assert store.count_events() == 2


def test_poll_accepts_list_response_shape(store):
    """Some Central variants return a bare list instead of {'events': ...}."""
    api = MagicMock()
    api.get.return_value = [_fake_event("evt-1")]
    result = poll_once(store, api)
    assert result.ingested == 1


def test_poll_continues_past_one_bad_row(store):
    """A row the normalizer chokes on must not poison the whole batch."""
    # `normalize_central_event` accepts anything, but if we point `event_type`
    # at something weird the insert could still succeed — use a proxy that
    # throws for one item.
    events = [_fake_event("good-1"), object(), _fake_event("good-2")]
    api = MagicMock()
    api.get.return_value = {"events": events}
    result = poll_once(store, api)
    # object() gets filtered out by _extract_event_list (only dicts allowed),
    # so we end up with 2 good rows, 0 errors.
    assert result.ingested == 2


def test_poll_sets_watermark_to_latest_event_time(store):
    events = [
        _fake_event("evt-early", ts="2026-04-18T00:01:00Z"),
        _fake_event("evt-late",  ts="2026-04-18T00:05:00Z"),
    ]
    api = _mk_api(events)
    result = poll_once(store, api)
    assert result.watermark is not None
    assert result.watermark.isoformat().startswith("2026-04-18T00:05:00")


def test_poll_params_use_rfc3339_with_ms_and_z(store):
    from datetime import datetime, timezone
    api = _mk_api([])
    poll_once(store, api, since=datetime(2026, 4, 18, 0, 0, tzinfo=timezone.utc),
              now=datetime(2026, 4, 18, 0, 1, tzinfo=timezone.utc))
    args, kwargs = api.get.call_args
    params = kwargs["params"]
    # Format example: 2026-04-17T23:59:30.000Z (note: overlap shifts `since`)
    assert params["end-at"].endswith("Z")
    assert "T" in params["start-at"]
    assert "." in params["end-at"]  # has milliseconds
