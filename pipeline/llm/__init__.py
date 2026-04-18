"""Shared LLM client used by syslog writer/reviewer agents (and others)."""

from .client import LLMError, LLMResult, LLMUnavailable, generate, get_provider

__all__ = ["generate", "get_provider", "LLMResult", "LLMError", "LLMUnavailable"]
