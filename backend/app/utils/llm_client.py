import json
import os
import time

import httpx
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

SYSTEM_PROMPT = "You extract and score resume data. Reply with one JSON object and no other text."

# Prefixes decide the provider. Switching models is a new API_KEY, not a code change.
PROVIDERS = (
    ("sk-ant-", None),
    ("sk-", "openai"),
    ("AIza", "gemini"),
    ("AQ.", "gemini"),
)

DEFAULT_MODELS = {
    "gemini": "gemini-3.5-flash-lite",
    "openai": "gpt-4o-mini",
}


def _clean(value):
    value = (value or "").strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
        value = value[1:-1].strip()
    return value


def resolve_api_key():
    for name in ("API_KEY", "GEMINI_API_KEY", "GOOGLE_API_KEY", "OPENAI_API_KEY"):
        value = _clean(os.getenv(name))
        if value:
            return value
    raise RuntimeError(
        "API_KEY is missing. Paste a Gemini or OpenAI key into API_KEY in backend/.env, then restart the backend container."
    )


def detect_provider(api_key):
    for prefix, provider in PROVIDERS:
        if api_key.startswith(prefix):
            if provider is None:
                raise RuntimeError(
                    "This API key is not supported yet. Paste a Gemini key (AQ. or AIza) or an OpenAI key (sk-)."
                )
            return provider
    raise RuntimeError(
        "Unrecognized API key. Paste a Gemini key (starts with AQ. or AIza) or an OpenAI key (starts with sk-) into API_KEY."
    )


def model_name(provider):
    configured = _clean(os.getenv("LLM_MODEL") or os.getenv("GPT_MODEL"))
    if provider == "gemini" and configured.startswith("gemini"):
        return configured
    if provider == "openai" and configured and not configured.startswith("gemini"):
        return configured
    return DEFAULT_MODELS[provider]


def complete(prompt, temperature, max_tokens):
    api_key = resolve_api_key()
    provider = detect_provider(api_key)
    model = model_name(provider)
    last_error = None

    for attempt in range(3):
        try:
            if provider == "gemini":
                return _complete_gemini(api_key, model, prompt, temperature, max_tokens)
            return _complete_openai(api_key, model, prompt, temperature, max_tokens)
        except Exception as exc:
            last_error = exc
            print(f"{provider} request failed: {exc}")
            if attempt < 2:
                time.sleep(8)

    raise RuntimeError(f"Model request failed after retries: {last_error}")


def _complete_openai(api_key, model, prompt, temperature, max_tokens):
    client = OpenAI(api_key=api_key)
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": prompt},
    ]
    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            response_format={"type": "json_object"},
        )
    except Exception as exc:
        if "response_format" not in str(exc).lower():
            raise
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )
    content = response.choices[0].message.content
    if not content:
        raise RuntimeError("The model returned an empty response.")
    return content.strip()


def _complete_gemini(api_key, model, prompt, temperature, max_tokens):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    payload = {
        "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": max(max_tokens, 1024),
            "responseMimeType": "application/json",
        },
    }
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": api_key,
    }
    with httpx.Client(timeout=120) as client:
        response = client.post(url, headers=headers, json=payload)
        if response.status_code >= 400 and "responseMimeType" in response.text:
            payload["generationConfig"].pop("responseMimeType", None)
            response = client.post(url, headers=headers, json=payload)
    if response.status_code >= 400:
        raise RuntimeError(_gemini_error(response))

    data = response.json()
    candidates = data.get("candidates") or []
    if not candidates:
        feedback = data.get("promptFeedback") or {}
        raise RuntimeError(f"Gemini returned no content: {feedback}")
    parts = ((candidates[0].get("content") or {}).get("parts")) or []
    text = "".join(part.get("text", "") for part in parts if not part.get("thought"))
    if not text.strip():
        raise RuntimeError("Gemini returned an empty response.")
    return text.strip()


def _gemini_error(response):
    try:
        body = response.json()
    except Exception:
        body = {"message": response.text[:400]}
    message = ((body.get("error") or {}).get("message")) or body
    return f"Gemini request failed ({response.status_code}): {message}"


def parse_json_object(text):
    if not text:
        raise ValueError("The model returned an empty response.")
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end <= start:
        raise ValueError("The model response did not contain a JSON object.")
    return json.loads(text[start : end + 1])
