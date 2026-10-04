from datetime import timedelta
from sqlalchemy import select, func
from app.config import settings
from app.models import Transaction, TransactionInput


def detect(db, transaction) -> dict | None:
    addresses = {i.address for i in transaction.inputs if i.address}
    if not addresses:
        return None
    cutoff = transaction.timestamp - timedelta(minutes=settings.high_frequency_window_minutes)
    count = db.scalar(
        select(func.count(Transaction.id))
        .join(TransactionInput, Transaction.id == TransactionInput.transaction_id)
        .where(TransactionInput.address.in_(addresses), Transaction.timestamp >= cutoff, Transaction.timestamp <= transaction.timestamp)
    ) or 0
    if count < settings.high_frequency_count:
        return None
    return {
        "code": "HIGH_FREQUENCY",
        "name": "High transaction frequency",
        "severity": "MEDIUM",
        "description": "An input address is involved in an unusually high number of transactions within a short window.",
        "evidence": {"addresses": sorted(addresses), "transaction_count": count, "window_minutes": settings.high_frequency_window_minutes, "threshold": settings.high_frequency_count},
        "score": 20,
    }
