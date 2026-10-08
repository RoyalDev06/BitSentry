from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models import Transaction


def get_transaction(db: Session, transaction_id: int) -> Transaction | None:
    return db.scalar(select(Transaction).where(Transaction.id == transaction_id))
