"""Tests for the event fingerprint normalizer."""

from pipeline.syslog.fingerprint import fingerprint, normalize_message


def test_normalize_scrubs_mac_and_ip():
    a = normalize_message("MIC fail from station 60:74:f4:3e:ae:a2 on ap 10.11.154.54")
    b = normalize_message("MIC fail from station aa:bb:cc:dd:ee:ff on ap 192.168.1.1")
    assert a == b


def test_normalize_scrubs_angle_tokens_and_long_numbers():
    a = normalize_message("<132094> clarity: timeout 1234567")
    b = normalize_message("<520013> clarity: timeout 9876543")
    assert a == b


def test_normalize_preserves_short_ids():
    """Short numbers like port 1/0/3 stay readable — we only collapse 4+ digit runs."""
    a = normalize_message("port 1/0/3 down")
    b = normalize_message("port 1/0/7 down")
    # These should NOT collapse — 3 and 7 are legitimate distinguishers.
    assert a != b


def test_fingerprint_same_content_same_hash():
    """Two identical log bursts from the same AP/client must share fingerprint."""
    a = fingerprint("LR-AP735", "132094",
                    "MIC failed from station 60:74:f4:3e:ae:a2 48:00:20:1a:b0:a1")
    b = fingerprint("LR-AP735", "132094",
                    "MIC failed from station aa:bb:cc:dd:ee:ff 00:11:22:33:44:55")
    assert a == b
    assert len(a) == 16


def test_fingerprint_different_device_different_hash():
    a = fingerprint("LR-AP735", "132094", "x")
    b = fingerprint("Off_655",  "132094", "x")
    assert a != b


def test_fingerprint_different_code_different_hash():
    a = fingerprint("LR-AP735", "132094", "x")
    b = fingerprint("LR-AP735", "520013", "x")
    assert a != b


def test_fingerprint_handles_nones():
    """Empty / None inputs must not crash."""
    fp = fingerprint(None, None, None)
    assert len(fp) == 16
    fp = fingerprint("", "", "")
    assert len(fp) == 16
