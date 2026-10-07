from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.detection.engine import detect_transaction
from app.models import RiskAssessment, RiskIndicator, Transaction
from app.risk.engine import calculate_risk


def analyze_transaction(db: Session, transaction: Transaction) -> RiskAssessment:
    indicators = detect_transaction(db, transaction)
    score, level = calculate_risk(indicators)
    names = [item["name"] for item in indicators]
    explanation = "The transaction triggered: " + ", ".join(names) + "." if names else "No configured suspicious indicators were detected."

    assessment = db.scalar(select(RiskAssessment).where(RiskAssessment.transaction_id == transaction.id))
    if assessment:
        assessment.score = score
        assessment.level = level
        assessment.explanation = explanation
        assessment.assessed_at = datetime.now(timezone.utc)
        assessment.indicators.clear()
    else:
        assessment = RiskAssessment(transaction_id=transaction.id, score=score, level=level, explanation=explanation)
        db.add(assessment)
        db.flush()

    for item in indicators:
        assessment.indicators.append(RiskIndicator(
            code=item["code"], name=item["name"], severity=item["severity"],
            description=item["description"], evidence=item["evidence"], score=item["score"]
        ))
    db.commit()
    db.refresh(assessment)
    return assessment
