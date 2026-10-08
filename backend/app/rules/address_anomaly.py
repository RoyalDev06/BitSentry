from sqlalchemy import select
from app.config import settings
from app.models import TransactionInput, TransactionOutput


def detect(db, transaction) -> dict | None:
    addresses = {i.address for i in transaction.inputs if i.address}
    if not addresses:
        return None
    rows = db.execute(
        select(TransactionInput.address, TransactionOutput.address)
        .join(TransactionOutput, TransactionInput.transaction_id == TransactionOutput.transaction_id)
        .where(TransactionInput.address.in_(addresses))
    ).all()
    counterparties = {out for _, out in rows if out}
    if len(counterparties) < settings.address_anomaly_counterparties:
        return None
    return {
        "code": "ADDRESS_ANOMALY",
        "name": "Address anomaly",
        "severity": "MEDIUM",
        "description": "An input address is associated with an unusually high number of distinct output counterparties.",
        "evidence": {"input_addresses": sorted(addresses), "distinct_counterparties": len(counterparties), "threshold": settings.address_anomaly_counterparties},
        "score": 20,
    }
