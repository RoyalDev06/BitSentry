import os

os.environ["DATABASE_URL"] = "sqlite:///./test_bitsentry.db"
os.environ["JWT_SECRET"] = "test-secret-for-bit-sentry-testing-123456"
os.environ["ADMIN_PASSWORD"] = "ChangeMe123!"
os.environ["ALERT_MIN_SCORE"] = "30"
os.environ["LARGE_VALUE_THRESHOLD_SATS"] = "10000000"

import pytest
from fastapi.testclient import TestClient
from app.database import Base, engine, SessionLocal
from app.main import app


@pytest.fixture()
def db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    from app.auth.service import seed_auth
    from app.rules.service import seed_rules
    session = SessionLocal()
    seed_auth(session)
    seed_rules(session)
    yield session
    session.close()


@pytest.fixture()
def client(db):
    with TestClient(app) as test_client:
        yield test_client
