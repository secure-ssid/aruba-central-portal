"""Unit tests for the syslog parser."""

from datetime import datetime, timezone

from pipeline.syslog.parser import parse_syslog


def test_rfc3164_basic():
    line = b"<134>Apr 17 21:45:01 AP-FLOOR-3 stm[1234]: AP_EVENT_DOT11_ASSOC client=aa:bb:cc:dd:ee:ff"
    ev = parse_syslog(line, now=datetime(2026, 4, 17, 22, 0, tzinfo=timezone.utc))

    assert ev.format == "3164"
    assert ev.facility == 16  # 134 >> 3
    assert ev.severity == 6   # 134 & 7
    assert ev.hostname == "AP-FLOOR-3"
    assert ev.app_name == "stm"
    assert ev.proc_id == "1234"
    assert "AP_EVENT_DOT11_ASSOC" in ev.message
    assert ev.event_code == "AP_EVENT_DOT11_ASSOC"
    assert ev.device_name == "AP-FLOOR-3"
    assert ev.event_time is not None
    assert ev.event_time.month == 4


def test_rfc3164_year_rollover_heuristic():
    # Parsing a Dec 31 log in January → should resolve to previous year.
    line = b"<38>Dec 31 23:59:58 sw-core sshd: login success"
    now = datetime(2026, 1, 2, 0, 0, tzinfo=timezone.utc)
    ev = parse_syslog(line, now=now)
    assert ev.event_time is not None
    assert ev.event_time.year == 2025


def test_rfc5424_full():
    line = (
        b"<165>1 2026-04-17T21:45:01.123Z sw-core fpapps 4567 ID47 "
        b'[exampleSDID@32473 iut="3" eventSource="App"] BGP neighbor down'
    )
    ev = parse_syslog(line)
    assert ev.format == "5424"
    assert ev.facility == 20
    assert ev.severity == 5
    assert ev.hostname == "sw-core"
    assert ev.app_name == "fpapps"
    assert ev.proc_id == "4567"
    assert ev.msg_id == "ID47"
    assert ev.message == "BGP neighbor down"
    assert ev.structured_data is not None
    assert ev.structured_data["exampleSDID@32473"]["iut"] == "3"
    assert ev.event_time == datetime(2026, 4, 17, 21, 45, 1, 123000, tzinfo=timezone.utc)


def test_rfc5424_nil_sd():
    line = b"<14>1 2026-04-17T21:45:01Z - - - - - hello world"
    ev = parse_syslog(line)
    assert ev.format == "5424"
    assert ev.hostname is None
    assert ev.structured_data is None
    assert ev.message == "hello world"


def test_aruba_serial_extraction():
    line = b"<134>Apr 17 21:45:01 CNABC12345 sapd: radio up"
    ev = parse_syslog(line, now=datetime(2026, 4, 17, 22, 0, tzinfo=timezone.utc))
    assert ev.device_serial == "CNABC12345"


def test_unknown_fallback():
    line = b"not really a syslog frame at all"
    ev = parse_syslog(line)
    assert ev.format == "unknown"
    assert ev.message == "not really a syslog frame at all"
    assert ev.severity is None


def test_never_raises_on_garbage():
    # Random bytes incl. invalid utf-8 — must not raise.
    ev = parse_syslog(b"<\xff\xfe bogus")
    assert ev.format == "unknown"
    assert ev.raw  # still captured
