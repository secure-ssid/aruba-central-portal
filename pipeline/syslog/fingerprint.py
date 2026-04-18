"""
Event fingerprint — collapse cosmetically-different copies of the same log.

Problem: a single client failing WPA handshake emits lines like:

  MIC failed in WPA2 Key Message 2 from Station 60:74:f4:3e:ae:a2 ...
  MIC failed in WPA2 Key Message 2 from Station 60:74:f4:3e:ae:a2 ...
  MIC failed in WPA2 Key Message 2 from Station aa:bb:cc:dd:ee:ff ...

They only differ in the client MAC (and maybe an AP IP). Treating each
copy as a distinct log makes the events list useless and causes the
LLM writer to get re-called for the same story over and over.

Fingerprint = sha1 of (device_key, event_code, normalized_message).
`normalized_message` replaces volatile tokens with placeholders:

  60:74:f4:3e:ae:a2  → <MAC>
  10.11.154.54       → <IP>
  <1234>             → <TOKEN>       (AOS angle-bracket tokens)
  48:00:20:c9:ab:0a  → <MAC>
  0x1a2b3c           → <HEX>
  2026-04-18...      → <TIME>
  12345 / long nums  → <N>           (only 4+ digit runs; preserve short ids)

The hash is stable across the cluster-window boundary — identical content
gets the same fingerprint even when it arrives hours apart, so the UI
count accumulates across time.
"""

from __future__ import annotations

import hashlib
import re

_MAC_RE = re.compile(r"\b(?:[0-9a-fA-F]{2}[:\-]){5}[0-9a-fA-F]{2}\b")
_IP_RE = re.compile(r"\b(?:\d{1,3}\.){3}\d{1,3}\b")
_ANGLE_TOKEN_RE = re.compile(r"<\d{3,}>")       # AOS <132094> numeric tokens
_HEX_RE = re.compile(r"\b0x[0-9a-fA-F]+\b")
_TS_RE = re.compile(r"\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?\b")
_LONG_NUM_RE = re.compile(r"\b\d{4,}\b")        # only 4+ digit runs — keep short ids readable
_WS_RE = re.compile(r"\s+")


def normalize_message(msg: str) -> str:
    """Lowercase + scrub volatile tokens so repeated logs collapse.

    We do this purely on the message body. Caller is responsible for
    combining with device_key and event_code before hashing.
    """
    if not msg:
        return ""
    s = msg.lower()
    s = _MAC_RE.sub("<mac>", s)
    s = _IP_RE.sub("<ip>", s)
    s = _TS_RE.sub("<time>", s)
    s = _HEX_RE.sub("<hex>", s)
    s = _ANGLE_TOKEN_RE.sub("<token>", s)
    s = _LONG_NUM_RE.sub("<n>", s)
    s = _WS_RE.sub(" ", s).strip()
    return s


def fingerprint(device_key: str | None, event_code: str | None, message: str | None) -> str:
    """Short sha1 of the normalized triple. 16 chars is plenty for dedup."""
    dev = (device_key or "unknown").strip()
    code = (event_code or "NOCODE").strip()
    body = normalize_message(message or "")
    raw = f"{dev}|{code}|{body}"
    return hashlib.sha1(raw.encode("utf-8")).hexdigest()[:16]


__all__ = ["fingerprint", "normalize_message"]
