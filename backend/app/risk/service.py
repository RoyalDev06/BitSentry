from sqlalchemy.orm import Session
from app.detection.service import analyze_transaction
from app.models import Transaction


def assess_transaction(db: Session, transaction: Transaction):
    return analyze_transaction(db, transaction)
