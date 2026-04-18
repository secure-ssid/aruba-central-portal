"""Action reviewer tests — LLM is mocked; CI stays offline."""

from unittest.mock import patch

import pytest

from pipeline.actions.reviewer import (
    ActionReview,
    _parse_verdict,
    review_action,
)
from pipeline.llm import LLMError, LLMResult


def test_parse_verdict_happy_path():
    text = '{"approved": true, "notes": "safe", "preflight_results": {"x": "pass"}}'
    approved, notes, pre = _parse_verdict(text)
    assert approved is True
    assert notes == "safe"
    assert pre == {"x": "pass"}


def test_parse_verdict_tolerates_fenced_json():
    text = '```json\n{"approved": false, "notes": "preflight fail"}\n```'
    approved, notes, pre = _parse_verdict(text)
    assert approved is False
    assert "preflight" in notes
    assert pre == {}


def test_parse_verdict_pending_on_malformed():
    approved, notes, pre = _parse_verdict("not json at all")
    assert approved is None
    assert pre == {}


def test_parse_verdict_string_boolean():
    approved, _, _ = _parse_verdict('{"approved": "yes", "notes": ""}')
    assert approved is True


def test_review_action_unknown_type_marked_pending():
    result = review_action({"event_code": "X"}, "never_heard_of_this")
    assert result.pending is True
    assert result.approved is False
    assert "unknown action" in result.notes.lower()


def test_review_action_approves_from_mocked_llm():
    with patch(
        "pipeline.actions.reviewer.generate",
        return_value=LLMResult(
            text='{"approved": true, "notes": "ok", "preflight_results": {"a": "pass"}}',
            provider="gemini", model="m",
        ),
    ):
        result = review_action(
            {"device_serial": "S1", "device_name": "AP-1",
             "event_code": "DFS_RADAR_DETECTED", "severity": 4,
             "event_count": 10, "anomaly_score": 5.0},
            "dfs_optimization",
            state_context={"site_status": "clean"},
        )
    assert result.approved is True
    assert result.notes == "ok"
    assert result.preflight_results == {"a": "pass"}


def test_review_action_rejects_from_mocked_llm():
    with patch(
        "pipeline.actions.reviewer.generate",
        return_value=LLMResult(
            text='{"approved": false, "notes": "serving 42 clients right now"}',
            provider="gemini", model="m",
        ),
    ):
        result = review_action(
            {"device_serial": "S1", "device_name": "AP-1",
             "event_code": "SWITCH_PORT_LINK_DOWN", "severity": 4,
             "event_count": 10, "anomaly_score": 5.0},
            "bounce_switch_port",
        )
    assert result.approved is False
    assert result.pending is False
    assert "42 clients" in result.notes


def test_review_action_pending_on_bad_json():
    with patch(
        "pipeline.actions.reviewer.generate",
        return_value=LLMResult(text="sure, approved", provider="gemini", model="m"),
    ):
        result = review_action(
            {"event_code": "DFS_RADAR"}, "dfs_optimization",
        )
    assert result.pending is True
    assert result.approved is False


def test_review_action_propagates_llm_error():
    with patch(
        "pipeline.actions.reviewer.generate",
        side_effect=LLMError("provider down"),
    ):
        with pytest.raises(LLMError):
            review_action({"event_code": "DFS_RADAR"}, "dfs_optimization")
