SAMPLE = {
    "tracking_number": "TRK-001",
    "carrier": "DHL",
    "origin": "Berlin",
    "destination": "Lisbon",
    "status": "pending",
}


def test_create_and_list_shipment(client, auth_headers):
    r = client.post("/api/shipments", json=SAMPLE, headers=auth_headers)
    assert r.status_code == 201
    created = r.json()
    assert created["tracking_number"] == "TRK-001"

    r = client.get("/api/shipments", headers=auth_headers)
    assert r.status_code == 200
    assert len(r.json()) == 1


def test_filter_by_status(client, auth_headers):
    client.post("/api/shipments", json=SAMPLE, headers=auth_headers)
    client.post(
        "/api/shipments",
        json={**SAMPLE, "tracking_number": "TRK-002", "status": "delivered"},
        headers=auth_headers,
    )

    r = client.get("/api/shipments?status=delivered", headers=auth_headers)
    assert r.status_code == 200
    body = r.json()
    assert len(body) == 1
    assert body[0]["tracking_number"] == "TRK-002"


def test_update_status(client, auth_headers):
    r = client.post("/api/shipments", json=SAMPLE, headers=auth_headers)
    sid = r.json()["id"]
    r = client.patch(f"/api/shipments/{sid}", json={"status": "in_transit"}, headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["status"] == "in_transit"


def test_delete_shipment(client, auth_headers):
    r = client.post("/api/shipments", json=SAMPLE, headers=auth_headers)
    sid = r.json()["id"]
    r = client.delete(f"/api/shipments/{sid}", headers=auth_headers)
    assert r.status_code == 204
    r = client.get(f"/api/shipments/{sid}", headers=auth_headers)
    assert r.status_code == 404


def test_stats(client, auth_headers):
    client.post("/api/shipments", json=SAMPLE, headers=auth_headers)
    client.post(
        "/api/shipments",
        json={**SAMPLE, "tracking_number": "TRK-002", "status": "delivered"},
        headers=auth_headers,
    )
    r = client.get("/api/shipments/stats", headers=auth_headers)
    assert r.status_code == 200
    body = r.json()
    assert body["total"] == 2
    assert body["delivered"] == 1
    assert body["pending"] == 1


def test_unauthenticated_blocked(client):
    r = client.get("/api/shipments")
    assert r.status_code == 401


def test_user_isolation(client):
    client.post("/api/auth/register", json={"email": "a@a.com", "password": "password123"})
    r = client.post("/api/auth/login", data={"username": "a@a.com", "password": "password123"})
    ha = {"Authorization": f"Bearer {r.json()['access_token']}"}
    client.post("/api/shipments", json=SAMPLE, headers=ha)

    client.post("/api/auth/register", json={"email": "b@b.com", "password": "password123"})
    r = client.post("/api/auth/login", data={"username": "b@b.com", "password": "password123"})
    hb = {"Authorization": f"Bearer {r.json()['access_token']}"}

    r = client.get("/api/shipments", headers=hb)
    assert r.json() == []


def test_validation_errors(client, auth_headers):
    r = client.post(
        "/api/shipments",
        json={"tracking_number": "x", "carrier": "", "origin": "", "destination": "", "status": "pending"},
        headers=auth_headers,
    )
    assert r.status_code == 422
