# BitSentry backend

A FastAPI service for Bitcoin transaction ingestion, configurable risk indicators,
alerts, case management, wallet labels, and audit records. It stores data through
SQLAlchemy and supports SQLite by default or PostgreSQL through `DATABASE_URL`.

## Run locally

From this directory, create a virtual environment and install dependencies:

```sh
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env` before use. Set a private `JWT_SECRET` and `ADMIN_PASSWORD`. The
sample Bitcoin RPC values target Bitcoin Core regtest; configure Bitcoin Core
RPC credentials and ensure its RPC endpoint is reachable. Start the API with:

```sh
uvicorn app.main:app --reload
```

The service creates its tables and seeds the admin account and detection rules
on startup. API docs are available at `/docs`; the health endpoint is `/health`.
All application endpoints are under `/api/v1`. Authenticate at
`POST /api/v1/auth/login` and send the returned bearer token on protected calls.

## Main capabilities

- Bitcoin Core status checks, block ingestion, and sync to tip
- Transaction inspection and risk analysis using configurable rules
- Alert review and investigation cases with notes and activity history
- User roles, permissions, wallet/address labels, and audit logs
- Dashboard summary counts

Risk detection uses the transaction and address history stored locally. It does
not establish that an address or transaction is illicit; scores are indicators
for analyst review.
