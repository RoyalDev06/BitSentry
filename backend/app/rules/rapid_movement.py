from sqlalchemy import select
from app.config import settings
from app.models import Transaction, TransactionInput, TransactionOutput


def detect(db, transaction) -> dict | None:
    input_addresses = {i.address for i in transaction.inputs if i.address}
    if not input_addresses:
        return None

    # A rapid movement is modeled as value arriving at an address in a prior
    # transaction and that same address being spent shortly afterward.
    prior = db.scalar(
        select(Transaction.timestamp)
        .join(TransactionOutput, Transaction.id == TransactionOutput.transaction_id)
        .where(
            TransactionOutput.address.in_(input_addresses),
            Transaction.timestamp < transaction.timestamp,
        )
        .order_by(Transaction.timestamp.desc())
        .limit(1)
    )
    if not prior:
        return None

    seconds = (transaction.timestamp - prior).total_seconds()
    if seconds < 0 or seconds > settings.rapid_movement_minutes * 60:
        return None

    return {
        "code": "RAPID_MOVEMENT",
        "name": "Rapid movement",
        "severity": "HIGH",
        "description": "An address received funds shortly before those funds were spent again.",
        "evidence": {
            "input_addresses": sorted(input_addresses),
            "previous_transaction_timestamp": prior.isoformat(),
            "current_transaction_timestamp": transaction.timestamp.isoformat(),
            "elapsed_seconds": seconds,
            "window_minutes": settings.rapid_movement_minutes,
        },
        "score": 25,
    }
