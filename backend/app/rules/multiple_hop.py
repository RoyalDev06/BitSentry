from sqlalchemy import select
from app.config import settings
from app.models import Transaction


def detect(db, transaction) -> dict | None:
    frontier = {i.prev_txid for i in transaction.inputs if i.prev_txid}
    visited = set()
    observed = 0
    for _ in range(settings.multiple_hop_depth):
        frontier = {txid for txid in frontier if txid and txid not in visited}
        if not frontier:
            break
        visited.update(frontier)
        observed += 1
        parents = db.scalars(select(Transaction).where(Transaction.txid.in_(frontier))).all()
        frontier = {i.prev_txid for parent in parents for i in parent.inputs if i.prev_txid}
    if observed < settings.multiple_hop_depth:
        return None
    return {
        "code": "MULTIPLE_HOP",
        "name": "Multiple-hop movement",
        "severity": "HIGH",
        "description": "Transaction ancestry shows multiple consecutive hops within the configured trace depth.",
        "evidence": {"observed_hops": observed, "configured_depth": settings.multiple_hop_depth},
        "score": 25,
    }
