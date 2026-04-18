"""Unit tests for the shared LLM client — provider selection + payloads.

Never hits a real LLM endpoint. All HTTP calls are mocked.
"""

from unittest.mock import MagicMock, patch

import httpx
import pytest

from pipeline.llm import client as llm_client
from pipeline.llm.client import (
    LLMError,
    LLMUnavailable,
    _call_claude,
    _call_gemini,
    _call_ollama,
    generate,
    get_provider,
)

# ──────────────── provider selection ────────────────

def test_get_provider_gemini_wins(monkeypatch):
    monkeypatch.setenv("GEMINI_API_KEY", "g")
    monkeypatch.setenv("ANTHROPIC_API_KEY", "c")
    monkeypatch.delenv("LLM_PROVIDER", raising=False)
    assert get_provider() == "gemini"


def test_get_provider_claude_when_no_gemini(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    monkeypatch.setenv("ANTHROPIC_API_KEY", "c")
    monkeypatch.delenv("LLM_PROVIDER", raising=False)
    assert get_provider() == "claude"


def test_get_provider_ollama_fallback(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    monkeypatch.delenv("LLM_PROVIDER", raising=False)
    with patch.object(llm_client, "_ollama_configured", return_value=True):
        assert get_provider() == "ollama"


def test_get_provider_none_when_nothing(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    monkeypatch.delenv("LLM_PROVIDER", raising=False)
    with patch.object(llm_client, "_ollama_configured", return_value=False):
        assert get_provider() is None


def test_get_provider_forced(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "ollama")
    monkeypatch.setenv("GEMINI_API_KEY", "g")  # should be ignored
    assert get_provider() == "ollama"


def test_generate_raises_when_no_provider(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    monkeypatch.delenv("LLM_PROVIDER", raising=False)
    with patch.object(llm_client, "_ollama_configured", return_value=False):
        with pytest.raises(LLMUnavailable):
            generate("hi")


# ──────────────── Gemini payload ────────────────

def _mock_resp(json_data, status=200):
    m = MagicMock(spec=httpx.Response)
    m.status_code = status
    m.json.return_value = json_data
    m.raise_for_status = MagicMock()
    m.text = str(json_data)
    return m


def test_gemini_happy_path(monkeypatch):
    monkeypatch.setenv("GEMINI_API_KEY", "key-123")
    monkeypatch.setenv("GEMINI_MODEL", "gemini-2.5-flash")
    resp = _mock_resp({"candidates": [{"content": {"parts": [{"text": "hello"}]}}]})
    with patch.object(llm_client.httpx, "post", return_value=resp) as post:
        out = _call_gemini("prompt", "system", 100, 0.2, 10.0)
    assert out.text == "hello"
    assert out.provider == "gemini"
    assert out.model == "gemini-2.5-flash"
    # Verify we sent the system_instruction and the API key header.
    _, kwargs = post.call_args
    assert kwargs["json"]["system_instruction"]["parts"][0]["text"] == "system"
    assert kwargs["headers"]["x-goog-api-key"] == "key-123"


def test_gemini_empty_response_raises(monkeypatch):
    monkeypatch.setenv("GEMINI_API_KEY", "k")
    resp = _mock_resp({"candidates": [{"content": {"parts": []}}]})
    with patch.object(llm_client.httpx, "post", return_value=resp), pytest.raises(LLMError):
        _call_gemini("p", None, 10, 0.0, 5.0)


# ──────────────── Claude payload ────────────────

def test_claude_happy_path(monkeypatch):
    monkeypatch.setenv("ANTHROPIC_API_KEY", "sk-xxx")
    monkeypatch.setenv("CLAUDE_MODEL", "claude-haiku-4-5-20251001")
    resp = _mock_resp({"content": [{"type": "text", "text": "ok"}]})
    with patch.object(llm_client.httpx, "post", return_value=resp) as post:
        out = _call_claude("prompt", "sys", 50, 0.1, 10.0)
    assert out.text == "ok"
    assert out.provider == "claude"
    _, kwargs = post.call_args
    assert kwargs["headers"]["x-api-key"] == "sk-xxx"
    assert kwargs["json"]["system"] == "sys"


# ──────────────── Ollama payload ────────────────

def test_ollama_happy_path(monkeypatch):
    monkeypatch.setenv("OLLAMA_URL", "http://localhost:11434")
    monkeypatch.setenv("OLLAMA_MODEL", "llama3.2:3b")
    monkeypatch.delenv("OLLAMA_FALLBACK_MODEL", raising=False)
    # Stub the /api/tags probe so model-picker sees the model as present.
    tags_resp = _mock_resp({"models": [{"name": "llama3.2:3b"}]})
    chat_resp = _mock_resp({"message": {"content": "yo"}})
    with patch.object(llm_client.httpx, "get", return_value=tags_resp), \
         patch.object(llm_client.httpx, "post", return_value=chat_resp) as post:
        out = _call_ollama("prompt", "sys", 50, 0.1, 10.0)
    assert out.text == "yo"
    assert out.provider == "ollama"
    _, kwargs = post.call_args
    messages = kwargs["json"]["messages"]
    assert messages[0]["role"] == "system"
    assert messages[-1]["role"] == "user"


def test_ollama_http_error_wrapped(monkeypatch):
    monkeypatch.setenv("OLLAMA_URL", "http://localhost:11434")
    # Clear fallback so ConnectError doesn't get retried.
    monkeypatch.setenv("OLLAMA_FALLBACK_MODEL", "")
    with patch.object(llm_client.httpx, "get", side_effect=httpx.ConnectError("x")), \
         patch.object(llm_client.httpx, "post", side_effect=httpx.ConnectError("refused")):
        with pytest.raises(LLMError):
            _call_ollama("p", None, 10, 0.0, 5.0)


def test_ollama_model_picker_falls_back_when_requested_missing(monkeypatch):
    """User configures a model the server doesn't have — picker should
    loose-prefix-match or pick something present instead of 404-ing."""
    monkeypatch.setenv("OLLAMA_URL", "http://localhost:11434")
    monkeypatch.setenv("OLLAMA_MODEL", "gemma3:4b")  # requested
    monkeypatch.setenv("OLLAMA_FALLBACK_MODEL", "")
    # Only "gemma3:latest" exists — prefix match should still resolve.
    tags = _mock_resp({"models": [{"name": "gemma3:latest"}, {"name": "other"}]})
    chat = _mock_resp({"message": {"content": "ok"}})
    with patch.object(llm_client.httpx, "get", return_value=tags), \
         patch.object(llm_client.httpx, "post", return_value=chat) as post:
        out = _call_ollama("p", None, 10, 0.0, 5.0)
    assert out.text == "ok"
    assert post.call_args.kwargs["json"]["model"] == "gemma3:latest"


def test_ollama_qwen_fallback_on_primary_failure(monkeypatch):
    """Qwen Cloud fallback kicks in when the local model fails with a
    rate-limit / 5xx / timeout — not on genuine bad requests."""
    monkeypatch.setenv("OLLAMA_URL", "http://localhost:11434")
    monkeypatch.setenv("OLLAMA_MODEL", "gemma3:4b")
    monkeypatch.setenv("OLLAMA_FALLBACK_MODEL", "qwen3.5:cloud")
    tags = _mock_resp({"models": [{"name": "gemma3:4b"}, {"name": "qwen3.5:cloud"}]})

    # First POST raises 503 (Ollama rarely does, but mimics the cloud
    # backing-model being overloaded); second POST returns content.
    req_obj = httpx.Request("POST", "http://localhost:11434/api/chat")
    bad = httpx.Response(status_code=503, request=req_obj)
    bad_err = httpx.HTTPStatusError("503 Service Unavailable", request=req_obj, response=bad)
    good = _mock_resp({"message": {"content": "rescued"}})

    with patch.object(llm_client.httpx, "get", return_value=tags), \
         patch.object(llm_client.httpx, "post", side_effect=[
             type("R", (), {"raise_for_status": lambda self: (_ for _ in ()).throw(bad_err),
                            "json": lambda self: {}, "text": "503"})(),
             good,
         ]):
        out = _call_ollama("p", None, 10, 0.0, 5.0)
    assert out.text == "rescued"
    assert out.model == "qwen3.5:cloud"
