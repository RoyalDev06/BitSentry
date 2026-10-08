# BitSentry Backend — Testing MVP

## Four-person architecture

1. **Bitcoin & Transaction Ingestion** — `app/bitcoin/`, `app/transactions/`, `app/addresses/`
2. **AML Detection & Risk Engine** — `app/detection/`, `app/risk/`, `app/rules/`
3. **Alerts & Investigations** — `app/alerts/`, `app/cases/`
4. **Authentication, Administration & Audit** — `app/auth/`, `app/users/`, `app/wallets/`, `app/audit/`

Shared integration lives in `app/models.py`, `app/database.py`, `app/schemas.py`, `app/routers.py`, and `app/main.py`.

## End-to-end flow

`Bitcoin Core Regtest -> ingestion -> database -> AML detection -> risk assessment -> alert -> investigation case -> audit`

## Run

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Swagger UI: `http://127.0.0.1:8000/docs`

## Test

```bash
pytest -q
```

The automated tests use SQLite, so the core flow can be tested without PostgreSQL or a running Bitcoin node.

## PostgreSQL

Set `DATABASE_URL`, for example:

```text
postgresql+psycopg://bitsentry:password@localhost:5432/bitsentry
```

## Bitcoin Core Regtest

For previous-output lookup and accurate fee/input parsing, enable transaction indexing:

```ini
regtest=1
server=1
txindex=1
rpcuser=bitsentry
rpcpassword=change-this-password
rpcbind=127.0.0.1
rpcallowip=127.0.0.1
```

Configure `BITCOIN_RPC_URL`, `BITCOIN_RPC_USER`, and `BITCOIN_RPC_PASSWORD` in `.env`.

## Development login

- Email: `admin@bitsentry.local`
- Password: `ChangeMe123!`

Change the password and `JWT_SECRET` before any shared/non-local deployment. Never commit `.env`, RPC credentials, private keys, seed phrases, or tokens.

## AML scope

This MVP is deterministic and explainable. It detects suspicious indicators; it does **not** prove that money laundering occurred. Thresholds and scores are development values.

Indicators implemented:

- Large-value transaction
- High transaction frequency
- Rapid movement
- Multiple-hop movement
- Unusual output/fan-out pattern
- Address anomaly
- Simple peel-chain pattern

Risk levels: LOW (0–29), MEDIUM (30–59), HIGH (60–79), CRITICAL (80–100). Scores are capped at 100.

## API highlights

- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/bitcoin/status`
- `POST /api/v1/bitcoin/ingest/block/{height}`
- `POST /api/v1/bitcoin/ingest/sync`
- `GET /api/v1/transactions`
- `GET /api/v1/transactions/{id}`
- `GET /api/v1/transactions/{id}/risk`
- `POST /api/v1/transactions/{id}/analyze`
- `GET /api/v1/alerts`
- `POST /api/v1/alerts/generate`
- `PATCH /api/v1/alerts/{id}/status`
- `POST /api/v1/cases`
- `GET /api/v1/cases/{id}`
- `POST /api/v1/cases/{id}/alerts/{alert_id}`
- `POST /api/v1/cases/{id}/notes`
- `PATCH /api/v1/cases/{id}/status`
- `GET /api/v1/addresses`
- `PATCH /api/v1/addresses/{id}`
- `GET /api/v1/wallets`
- `POST /api/v1/wallets`
- `GET /api/v1/audit`
- `GET /api/v1/dashboard/summary`

For the testing phase, tables are created with SQLAlchemy `create_all()`. Before production, move schema management to Alembic/versioned migrations.
