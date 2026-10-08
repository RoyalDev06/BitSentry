def test_cases_endpoint_requires_auth(client):
    response = client.get("/api/v1/cases")
    assert response.status_code == 401
