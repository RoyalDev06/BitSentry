from datetime import datetime, timezone
from app.models import Transaction, TransactionOutput


def login(client):
    response = client.post("/api/v1/auth/login", json={"email": "admin@bitsentry.local", "password": "ChangeMe123!"})
    assert response.status_code == 200, response.text
    return response.json()["access_token"]


def test_end_to_end_risk_alert_case_flow(client, db):
    tx = Transaction(txid="api-flow-tx", timestamp=datetime.now(timezone.utc), total_output_sats=20_000_000)
    tx.outputs.append(TransactionOutput(vout=0, address="bcrt1output", amount_sats=20_000_000))
    db.add(tx)
    db.commit()
    db.refresh(tx)

    token = login(client)
    headers = {"Authorization": f"Bearer {token}"}

    risk = client.get(f"/api/v1/transactions/{tx.id}/risk", headers=headers)
    assert risk.status_code == 200, risk.text
    assert risk.json()["level"] == "MEDIUM"

    generated = client.post("/api/v1/alerts/generate", headers=headers)
    assert generated.status_code == 200, generated.text
    alert_ids = generated.json()["created_alert_ids"]
    assert len(alert_ids) == 1

    case = client.post("/api/v1/cases", headers=headers, json={"title": "Review suspicious transaction", "priority": "MEDIUM"})
    assert case.status_code == 200, case.text
    case_id = case.json()["id"]

    attach = client.post(f"/api/v1/cases/{case_id}/alerts/{alert_ids[0]}", headers=headers)
    assert attach.status_code == 200

    note = client.post(f"/api/v1/cases/{case_id}/notes", headers=headers, json={"note": "Initial analyst review completed."})
    assert note.status_code == 200

    status = client.patch(f"/api/v1/cases/{case_id}/status", headers=headers, json={"status": "IN_PROGRESS"})
    assert status.status_code == 200
    assert status.json()["status"] == "IN_PROGRESS"

    detail = client.get(f"/api/v1/cases/{case_id}", headers=headers)
    assert detail.status_code == 200
    assert alert_ids[0] in detail.json()["alert_ids"]
    assert len(detail.json()["notes"]) == 1

    audit = client.get("/api/v1/audit", headers=headers)
    assert audit.status_code == 200
    assert len(audit.json()) > 0
