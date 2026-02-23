def test_register_and_login(client):
    r = client.post("/api/auth/register", json={"email": "a@b.com", "password": "password123"})
    assert r.status_code == 201
    assert "access_token" in r.json()

    r = client.post(
        "/api/auth/login",
        data={"username": "a@b.com", "password": "password123"},
    )
    assert r.status_code == 200
    assert r.json()["token_type"] == "bearer"


def test_duplicate_email_rejected(client):
    client.post("/api/auth/register", json={"email": "dup@b.com", "password": "password123"})
    r = client.post("/api/auth/register", json={"email": "dup@b.com", "password": "password123"})
    assert r.status_code == 400


def test_login_wrong_password(client):
    client.post("/api/auth/register", json={"email": "x@b.com", "password": "password123"})
    r = client.post(
        "/api/auth/login",
        data={"username": "x@b.com", "password": "nope-nope-1"},
    )
    assert r.status_code == 401


def test_me_requires_token(client):
    r = client.get("/api/auth/me")
    assert r.status_code == 401


def test_me_returns_user(client, auth_headers):
    r = client.get("/api/auth/me", headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["email"] == "test@example.com"
