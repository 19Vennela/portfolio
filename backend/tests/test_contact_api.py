"""
Backend tests for Vennela Portfolio API.
Covers: health, contact endpoint (validation, honeypot, success, rate limit).
"""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://cultivated-strategy.preview.emergentagent.com").rstrip("/")


# --- Health endpoint ------------------------------------------------
class TestHealth:
    def test_health_ok(self):
        r = requests.get(f"{BASE_URL}/api/health", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "ok"


# --- Contact endpoint: happy path -----------------------------------
class TestContactSuccess:
    def test_contact_valid_payload_returns_id(self):
        payload = {
            "name": "TEST_Butterfly Tester",
            "email": "test+butterfly@example.com",
            "message": "TEST_ Automated verification - please ignore.",
            "company": "",
        }
        r = requests.post(f"{BASE_URL}/api/contact", json=payload, timeout=30)
        assert r.status_code == 200, f"Unexpected {r.status_code}: {r.text}"
        data = r.json()
        assert data.get("status") == "ok"
        # Resend returns an id on success
        assert "id" in data, f"Missing id: {data}"
        assert isinstance(data["id"], str) and len(data["id"]) > 0


# --- Contact endpoint: validation errors ----------------------------
class TestContactValidation:
    def test_invalid_email_returns_422(self):
        payload = {
            "name": "TEST_User",
            "email": "not-an-email",
            "message": "hello",
            "company": "",
        }
        r = requests.post(f"{BASE_URL}/api/contact", json=payload, timeout=15)
        assert r.status_code == 422, f"Expected 422, got {r.status_code}: {r.text}"

    def test_empty_message_returns_422(self):
        payload = {
            "name": "TEST_User",
            "email": "user@example.com",
            "message": "",
            "company": "",
        }
        r = requests.post(f"{BASE_URL}/api/contact", json=payload, timeout=15)
        assert r.status_code == 422

    def test_empty_name_returns_422(self):
        payload = {
            "name": "",
            "email": "user@example.com",
            "message": "hi there",
            "company": "",
        }
        r = requests.post(f"{BASE_URL}/api/contact", json=payload, timeout=15)
        assert r.status_code == 422


# --- Contact endpoint: honeypot -------------------------------------
class TestContactHoneypot:
    def test_honeypot_filled_returns_silent_ok_without_id(self):
        payload = {
            "name": "TEST_Bot",
            "email": "bot@example.com",
            "message": "spam spam spam",
            "company": "acme corp",  # honeypot filled
        }
        r = requests.post(f"{BASE_URL}/api/contact", json=payload, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "ok"
        # honeypot path should NOT include an id (no send)
        assert "id" not in data, f"Honeypot should not send email, got id: {data}"


# --- Contact endpoint: rate limiting --------------------------------
class TestContactRateLimit:
    def test_rate_limit_5_per_minute(self):
        """
        Send 7 requests rapidly with honeypot (to avoid burning real emails).
        Expect at least one 429 within the burst (limit is 5/min per IP).
        """
        codes = []
        for i in range(7):
            payload = {
                "name": f"TEST_RL_{uuid.uuid4().hex[:6]}",
                "email": "rl@example.com",
                "message": "rate limit probe",
                "company": "honeypot-fill",  # avoid actual send
            }
            r = requests.post(f"{BASE_URL}/api/contact", json=payload, timeout=15)
            codes.append(r.status_code)
        # at least one should be 429 (Too Many Requests) if limiter is active
        assert 429 in codes, f"Expected rate limit 429 in burst, got codes: {codes}"
