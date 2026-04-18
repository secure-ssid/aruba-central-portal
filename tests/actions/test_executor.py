"""Executor tests — stubbed handlers, real state transitions."""

from datetime import datetime, timezone
from pathlib import Path

import pytest

from pipeline.actions.executor import ExecutionError, execute_action
from pipeline.syslog.storage import SyslogStore


@pytest.fixture()
def store(tmp_path: Path) -> SyslogStore:
    s = SyslogStore(tmp_path / "syslog.db")
    yield s
    s.close()


def _seed_approved_action(store: SyslogStore, action_type: str = "dfs_optimization") -> int:
    """Minimum plumbing to get an action row into status=approved."""
    now = datetime.now(timezone.utc)
    event_id = store.insert_event(
        received_at=now, event_time=now, source_ip="1.1.1.1", transport="udp",
        facility=16, severity=4, hostname="h", app_name="a", proc_id=None,
        msg_id=None, device_serial="SN", device_name="h",
        event_code="DFS_RADAR_DETECTED", message="", raw="", structured_data=None,
    )
    incident_id = store.upsert_incident(
        cluster_signature=f"sig-{action_type}", device_serial="SN",
        device_name="h", event_code="DFS_RADAR_DETECTED", severity=4,
        first_seen=now, last_seen=now, event_ids=[event_id],
    )
    action_id = store.insert_proposed_action(
        incident_id=incident_id, action_type=action_type,
        target_device_serial="SN", target_device_name="h",
    )
    store.update_proposed_action(action_id, status="approved")
    return action_id


def test_execute_marks_row_executed(store):
    action_id = _seed_approved_action(store)
    result = execute_action(store, action_id)
    assert result["status"] == "executed"
    assert result["meta"]["simulated"] is True

    row = store.get_proposed_action(action_id)
    assert row["status"] == "executed"
    assert row["executed_at"] is not None


def test_execute_refuses_non_approved_status(store):
    action_id = _seed_approved_action(store)
    # Flip back to pending — executor must refuse.
    store.update_proposed_action(action_id, status="pending")
    with pytest.raises(ExecutionError):
        execute_action(store, action_id)
    row = store.get_proposed_action(action_id)
    assert row["status"] == "pending"  # unchanged


def test_execute_missing_action(store):
    with pytest.raises(ExecutionError) as exc:
        execute_action(store, 9999)
    assert "not found" in str(exc.value).lower()


def test_execute_records_handler_failure(store, monkeypatch):
    """When a handler raises, the row transitions to failed with the error."""
    action_id = _seed_approved_action(store)

    def boom(_row, _client):
        raise RuntimeError("simulated bad day")

    monkeypatch.setitem(
        __import__("pipeline.actions.executor", fromlist=["HANDLERS"]).HANDLERS,
        "dfs_optimization", boom,
    )

    with pytest.raises(ExecutionError):
        execute_action(store, action_id)
    row = store.get_proposed_action(action_id)
    assert row["status"] == "failed"
    assert "simulated bad day" in (row.get("execution_error") or "")


def test_execute_unknown_action_type_marks_failed(store):
    action_id = _seed_approved_action(store, action_type="dfs_optimization")
    # Overwrite to an unknown type — the catalog lookup should refuse.
    with store._write_lock:  # noqa: SLF001
        store._conn.execute(
            "UPDATE proposed_actions SET action_type='not_real_action' WHERE id=?",
            (action_id,),
        )
    with pytest.raises(ExecutionError):
        execute_action(store, action_id)
    row = store.get_proposed_action(action_id)
    assert row["status"] == "failed"
