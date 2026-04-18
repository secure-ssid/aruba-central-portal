"""
Shared LLM client for the syslog pipeline (and any other agent work).

Reuses the exact same env vars the chat blueprint already recognizes so
operators configure one set of credentials in the Settings UI and all
agents (chat, syslog writer, syslog reviewer) pick them up:

  GEMINI_API_KEY, GEMINI_MODEL               (Google AI Studio — free tier)
  ANTHROPIC_API_KEY, CLAUDE_MODEL            (Anthropic cloud — paid)
  OLLAMA_URL, OLLAMA_MODEL                   (local Ollama — free)

Priority order mirrors `chat.py /api/chat/status`: Gemini → Claude → Ollama.

This module is plain text-in / text-out. It does NOT do tool calling,
streaming, or function declarations — those live in chat.py. The syslog
writer/reviewer only need a short prompt and a short answer.
"""

from __future__ import annotations

import logging
import os
from dataclasses import dataclass
from typing import Literal

import httpx

logger = logging.getLogger(__name__)

Provider = Literal["gemini", "claude", "ollama"]


@dataclass
class LLMResult:
    text: str
    provider: Provider
    model: str


class LLMError(RuntimeError):
    """LLM call failed (network, HTTP error, bad response shape)."""


class LLMUnavailable(LLMError):
    """No LLM provider is configured — caller should skip gracefully."""


# ──────────────────────── provider detection ────────────────────────


def _gemini_configured() -> bool:
    return bool(os.environ.get("GEMINI_API_KEY", "").strip())


def _claude_configured() -> bool:
    return bool(os.environ.get("ANTHROPIC_API_KEY", "").strip())


def _ollama_configured(timeout: float = 1.5) -> bool:
    url = os.environ.get("OLLAMA_URL", "http://localhost:11434")
    try:
        r = httpx.get(f"{url}/api/tags", timeout=timeout)
        return r.status_code == 200
    except Exception:  # noqa: BLE001 — probe only
        return False


def get_provider() -> Provider | None:
    """Return the provider we would use right now, or None if none is ready.

    `LLM_PROVIDER` env var can force a specific choice (gemini|claude|ollama);
    otherwise the order matches chat.py (Gemini → Claude → Ollama).
    """
    forced = os.environ.get("LLM_PROVIDER", "").strip().lower()
    if forced in ("gemini", "claude", "ollama"):
        return forced  # type: ignore[return-value]

    if _gemini_configured():
        return "gemini"
    if _claude_configured():
        return "claude"
    if _ollama_configured():
        return "ollama"
    return None


# ──────────────────────── text generation ────────────────────────


def _rate_limited_or_server_error(exc: Exception) -> bool:
    """Heuristic — worth trying another provider for these."""
    msg = str(exc).lower()
    return (
        "429" in msg
        or "too many requests" in msg
        or "rate limit" in msg
        or "500" in msg
        or "502" in msg
        or "503" in msg
        or "504" in msg
        or "timeout" in msg
    )


def _ordered_providers(primary: Provider | None) -> list[Provider]:
    """Return the chain of providers to try. Primary first, then whatever
    else is configured as a fallback. Ollama (local, free) is always
    appended last if it's reachable, so rate-limited cloud providers
    degrade gracefully to the local model."""
    chain: list[Provider] = []
    if primary:
        chain.append(primary)
    for cand in ("gemini", "claude", "ollama"):
        if cand in chain:
            continue
        if cand == "gemini" and _gemini_configured():
            chain.append("gemini")
        elif cand == "claude" and _claude_configured():
            chain.append("claude")
        elif cand == "ollama" and _ollama_configured():
            chain.append("ollama")
    return chain


def generate(
    prompt: str,
    *,
    system: str | None = None,
    max_output_tokens: int = 512,
    temperature: float = 0.2,
    timeout: float = 20.0,
    provider: Provider | None = None,
) -> LLMResult:
    """Run one text-in / text-out call, cascading to the next provider
    on rate limits / transient server errors.

    Order: `provider` arg > primary chosen by `get_provider()` > remaining
    configured providers (Ollama is always last if reachable). Auth errors
    or malformed responses raise immediately — only rate limits and 5xx
    trigger the cascade.
    """
    primary = provider or get_provider()
    chain = _ordered_providers(primary)
    if not chain:
        raise LLMUnavailable(
            "No LLM configured — set GEMINI_API_KEY, ANTHROPIC_API_KEY, or run Ollama locally."
        )

    last_exc: Exception | None = None
    for prov in chain:
        try:
            if prov == "gemini":
                return _call_gemini(prompt, system, max_output_tokens, temperature, timeout)
            if prov == "claude":
                return _call_claude(prompt, system, max_output_tokens, temperature, timeout)
            if prov == "ollama":
                return _call_ollama(prompt, system, max_output_tokens, temperature, timeout)
        except LLMError as exc:
            last_exc = exc
            if not _rate_limited_or_server_error(exc):
                raise  # genuine error — don't mask it by trying a second provider
            logger.warning(
                "llm: %s rate-limited/transient (%s) — falling back", prov, exc,
            )
            continue

    # Exhausted all providers.
    raise last_exc or LLMError("all LLM providers failed")


# ──────────────────────── Gemini ────────────────────────


def _call_gemini(prompt, system, max_tokens, temperature, timeout) -> LLMResult:
    api_key = os.environ["GEMINI_API_KEY"].strip()
    model = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

    payload: dict = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generation_config": {
            "temperature": float(temperature),
            "max_output_tokens": int(max_tokens),
        },
    }
    if system:
        payload["system_instruction"] = {"parts": [{"text": system}]}

    try:
        resp = httpx.post(
            url,
            json=payload,
            headers={"x-goog-api-key": api_key, "Content-Type": "application/json"},
            timeout=timeout,
        )
        resp.raise_for_status()
    except httpx.HTTPError as exc:
        raise LLMError(f"Gemini HTTP error: {exc}") from exc

    data = resp.json()
    parts = (data.get("candidates") or [{}])[0].get("content", {}).get("parts", [])
    text = " ".join(p["text"].strip() for p in parts if p.get("text")).strip()
    if not text:
        raise LLMError(f"Gemini returned empty response: {data!r}")
    return LLMResult(text=text, provider="gemini", model=model)


# ──────────────────────── Claude ────────────────────────


def _call_claude(prompt, system, max_tokens, temperature, timeout) -> LLMResult:
    api_key = os.environ["ANTHROPIC_API_KEY"].strip()
    model = os.environ.get("CLAUDE_MODEL", "claude-haiku-4-5-20251001")

    payload: dict = {
        "model": model,
        "max_tokens": int(max_tokens),
        "temperature": float(temperature),
        "messages": [{"role": "user", "content": prompt}],
    }
    if system:
        payload["system"] = system

    try:
        resp = httpx.post(
            "https://api.anthropic.com/v1/messages",
            json=payload,
            headers={
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
                "Content-Type": "application/json",
            },
            timeout=timeout,
        )
        resp.raise_for_status()
    except httpx.HTTPError as exc:
        raise LLMError(f"Claude HTTP error: {exc}") from exc

    data = resp.json()
    blocks = data.get("content") or []
    text = " ".join(b["text"].strip() for b in blocks if b.get("type") == "text").strip()
    if not text:
        raise LLMError(f"Claude returned empty response: {data!r}")
    return LLMResult(text=text, provider="claude", model=model)


# ──────────────────────── Ollama ────────────────────────


def _call_ollama(prompt, system, max_tokens, temperature, timeout) -> LLMResult:
    url = os.environ.get("OLLAMA_URL", "http://localhost:11434")
    model = os.environ.get("OLLAMA_MODEL", "llama3.2:3b")

    messages: list[dict] = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    payload = {
        "model": model,
        "messages": messages,
        "stream": False,
        "options": {
            "temperature": float(temperature),
            "num_predict": int(max_tokens),
        },
    }
    try:
        resp = httpx.post(f"{url}/api/chat", json=payload, timeout=timeout)
        resp.raise_for_status()
    except httpx.HTTPError as exc:
        raise LLMError(f"Ollama HTTP error: {exc}") from exc

    data = resp.json()
    text = (data.get("message") or {}).get("content", "").strip()
    if not text:
        raise LLMError(f"Ollama returned empty response: {data!r}")
    return LLMResult(text=text, provider="ollama", model=model)
