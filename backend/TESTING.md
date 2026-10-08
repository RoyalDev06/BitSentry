# BitSentry backend testing checklist

## 1. Install

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

## 2. Run automated tests

```bash
pytest -q
```

Expected in this verified package:

```text
12 passed
```

## 3. Start the API

```bash
uvicorn app.main:app --reload
```

Open `http://127.0.0.1:8000/docs`.

## 4. Login

Use the development admin:

```text
admin@bitsentry.local
ChangeMe123!
```

The login endpoint returns a bearer JWT.

## 5. Check Bitcoin Core

```text
GET /api/v1/bitcoin/status
```

A healthy result should show `connected: true`, the network, and the current block height.

## 6. Regtest ingestion

Start Bitcoin Core Regtest with RPC and `txindex=1` enabled. Then:

```text
POST /api/v1/bitcoin/ingest/sync
```

This stores blocks and transactions, extracts inputs/outputs, stores addresses, and runs AML analysis for non-coinbase transactions.

## 7. AML test flow

For a stored transaction:

```text
GET /api/v1/transactions/{id}/risk
```

or force a fresh assessment:

```text
POST /api/v1/transactions/{id}/analyze
```

The response contains:

- `score`
- `level`
- `indicators`
- `explanation`
- `assessed_at`

## 8. Alert flow

For risk scores at or above `ALERT_MIN_SCORE`:

```text
POST /api/v1/alerts/generate
GET  /api/v1/alerts
```

Then update an alert:

```text
PATCH /api/v1/alerts/{id}/status
```

## 9. Investigation flow

```text
POST /api/v1/cases
POST /api/v1/cases/{case_id}/alerts/{alert_id}
POST /api/v1/cases/{case_id}/notes
PATCH /api/v1/cases/{case_id}/status
GET /api/v1/cases/{case_id}
```

## 10. Audit

```text
GET /api/v1/audit
```

Important actions such as user creation, ingestion, alert changes, case creation, notes, and case status changes are recorded.

## 11. Team branch mapping

Copy/commit the implementation into the matching feature branch:

- `feature/bitcoin-ingestion` — Bitcoin, transaction, address ingestion files
- `feature/aml-detection` — detection, risk, rules files
- `feature/alerts-investigations` — alerts and cases files
- `feature/auth-admin` — auth, users, wallets, audit files

Shared files must be integrated through `develop` rather than independently overwritten.
