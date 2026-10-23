import pytest
import jwt
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from pydantic import ValidationError

@pytest.mark.parametrize("payload,status", [
    ({"id": 7, "role": "manager"}, 200),
    ({"id": 7, "role": "student"}, 403),
    ({"id": 7, "role": "customer"}, 403),
    ({"role": "manager"}, 403),
])
def test_manager_role(api, payload, status):
    credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=api.create_access_token(payload))
    if status == 200:
        assert api.get_current_manager(credentials) == 7
    else:
        with pytest.raises(HTTPException) as caught:
            api.get_current_manager(credentials)
        assert caught.value.status_code == status

@pytest.mark.parametrize("kind", ["expired", "tampered"])
def test_invalid_token_rejected(api, kind):
    payload = {"id": 7, "role": "manager", "exp": datetime.now(timezone.utc) - timedelta(seconds=1)}
    token = jwt.encode(payload, api.SECRET_KEY if kind == "expired" else "different-secret-at-least-32-characters", algorithm=api.ALGORITHM)
    with pytest.raises(HTTPException) as caught:
        api.get_current_manager(HTTPAuthorizationCredentials(scheme="Bearer", credentials=token))
    assert caught.value.status_code == 401

@pytest.mark.parametrize("password", ["abcdefgh!", "12345678!", "abcd12345", "a1!"])
def test_registration_rejects_weak_password(api, password):
    model = getattr(api, "StudentRegister", None) or api.Register
    with pytest.raises(ValidationError):
        model(name="테스트", username="test@example.com", password=password, birth_date="2000-01-01", phone="01012345678")

def test_registration_normalizes_email(api):
    model = getattr(api, "StudentRegister", None) or api.Register
    record = model(name="테스트", username=" TEST@EXAMPLE.COM ", password="Example123!", birth_date="2000-01-01", phone="01012345678")
    assert record.username == "test@example.com"

@pytest.mark.parametrize("phone", ["010-1234-5678", "0212345678", "010123"])
def test_invalid_phone(api, phone):
    model = getattr(api, "StudentRegister", None) or api.Register
    with pytest.raises(ValidationError):
        model(name="테스트", username="test@example.com", password="Example123!", birth_date="2000-01-01", phone=phone)

def test_admin_endpoint_requires_auth(client):
    path = "/admin/students" if any(r.path == "/admin/students" for r in client.app.routes) else "/customers"
    assert client.get(path).status_code in (401, 403)

def test_sensitive_response_is_not_cached(client):
    response = client.post("/register", json={})
    assert response.status_code == 422
    assert "no-store" in response.headers["cache-control"]
