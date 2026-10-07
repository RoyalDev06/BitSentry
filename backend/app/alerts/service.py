from sqlalchemy import select
from sqlalchemy.orm import Session
from app.config import settings
from app.models import Alert, RiskAssessment

ALERT_STATUSES = {"OPEN", "IN_REVIEW", "ESCALATED", "CLOSED", "FALSE_POSITIVE"}


def create_alert_for_risk(db: Session, assessment: RiskAssessment) -> Alert | None:
    if assessment.score < settings.alert_min_score:
        return None
    existing = db.scalar(select(Alert).where(Alert.risk_assessment_id == assessment.id))
    if existing:
        return existing
    alert = Alert(
        transaction_id=assessment.transaction_id,
        risk_assessment_id=assessment.id,
        risk_score=assessment.score,
        risk_level=assessment.level,
        indicators=[{"code": i.code, "name": i.name, "severity": i.severity, "score": i.score} for i in assessment.indicators],
        status="OPEN",
    )
    db.add(alert)
    db.flush()
    return alert


def generate_alerts(db: Session) -> list[int]:
    assessments = db.scalars(select(RiskAssessment).where(RiskAssessment.score >= settings.alert_min_score)).all()
    created = []
    for assessment in assessments:
        before = db.scalar(select(Alert).where(Alert.risk_assessment_id == assessment.id))
        alert = create_alert_for_risk(db, assessment)
        if alert and before is None:
            created.append(alert.id)
    db.commit()
    return created
