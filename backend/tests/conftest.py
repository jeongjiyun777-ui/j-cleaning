"""테스트용 환경만 사용합니다. 실제 DB/HTTP 접속은 즉시 실패합니다."""
import importlib.util
import os
import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]

@pytest.fixture(scope="session")
def api():
    fake_engine = MagicMock()
    fake_engine.connect.side_effect = AssertionError("실제 DB 대신 db fixture를 사용하세요")
    fake_engine.begin.side_effect = AssertionError("실제 DB 대신 db fixture를 사용하세요")
    settings = dict(DB_USER="test", DB_PASSWORD="test", DB_HOST="invalid.test",
                    DB_PORT="5432", DB_NAME="test", SESSION_SECRET="test-only-secret-at-least-32-characters",
                    ADMIN_NAME="테스트관리자", ADMIN_USERNAME="admin@example.com",
                    ADMIN_PASSWORD_HASH="unused-test-hash", ADMIN_AGE="30", COOKIE_SECURE="false",
                    BREVO_API_KEY="", BREVO_SENDER_EMAIL="")
    sys.path.insert(0, str(ROOT))
    try:
        with patch.dict(os.environ, settings), patch("dotenv.load_dotenv", return_value=False), patch("sqlalchemy.create_engine", return_value=fake_engine):
            spec = importlib.util.spec_from_file_location("tested_backend", ROOT / "main.py")
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
    finally:
        sys.path.pop(0)
    return module

@pytest.fixture(autouse=True)
def block_external_services(monkeypatch):
    def blocked(*args, **kwargs):
        raise AssertionError("테스트에서는 외부 서비스에 요청할 수 없습니다")
    monkeypatch.setattr("requests.sessions.Session.request", blocked)
    monkeypatch.setattr("socket.create_connection", blocked)

@pytest.fixture
def client(api):
    with TestClient(api.app) as client:
        yield client
    api.app.dependency_overrides.clear()
