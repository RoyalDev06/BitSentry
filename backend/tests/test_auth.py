def login(client, email="admin@bitsentry.local", password="ChangeMe123!"):
    response = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200, response.text
    return response.json()["access_token"]


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_admin_login_and_me(client):
    token = login(client)
    response = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["email"] == "admin@bitsentry.local"
    assert "admin" in response.json()["roles"]


def test_rbac_blocks_analyst_from_user_management(client):
    admin_token = login(client)
    response = client.post(
        "/api/v1/users",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"email": "analyst@example.com", "full_name": "Analyst", "password": "Password123", "role": "analyst"},
    )
    assert response.status_code == 200, response.text

    analyst_token = login(client, "analyst@example.com", "Password123")
    denied = client.post(
        "/api/v1/users",
        headers={"Authorization": f"Bearer {analyst_token}"},
        json={"email": "second@example.com", "full_name": "Second", "password": "Password123", "role": "analyst"},
    )
    assert denied.status_code == 403


def test_change_password_flow(client):
    token = login(client)
    # Incorrect current password
    fail_res = client.post(
        "/api/v1/auth/change-password",
        headers={"Authorization": f"Bearer {token}"},
        json={"current_password": "WrongPassword!", "new_password": "NewSecret123!"},
    )
    assert fail_res.status_code == 400

    # Successful password change
    success_res = client.post(
        "/api/v1/auth/change-password",
        headers={"Authorization": f"Bearer {token}"},
        json={"current_password": "ChangeMe123!", "new_password": "NewSecret123!"},
    )
    assert success_res.status_code == 200

    # Log in with new password
    new_token = login(client, password="NewSecret123!")
    assert new_token is not None

    # Reset password back for subsequent tests
    client.post(
        "/api/v1/auth/change-password",
        headers={"Authorization": f"Bearer {new_token}"},
        json={"current_password": "NewSecret123!", "new_password": "ChangeMe123!"},
    )


def test_list_users(client):
    admin_token = login(client)
    res = client.get("/api/v1/users", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    assert isinstance(res.json(), list)
    assert len(res.json()) >= 1

