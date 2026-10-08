from sqlalchemy import select
from app.models import Case, CaseActivity, CaseAlert, InvestigationNote

CASE_STATUSES = {"OPEN", "IN_PROGRESS", "ESCALATED", "CLOSED"}
PRIORITIES = {"LOW", "MEDIUM", "HIGH", "CRITICAL"}


def add_case_activity(db, case_id, actor_id, action, details=None):
    db.add(CaseActivity(case_id=case_id, actor_id=actor_id, action=action, details=details or {}))


def case_payload(db, case_id):
    row = db.get(Case, case_id)
    if not row:
        return None
    alerts = db.scalars(select(CaseAlert).where(CaseAlert.case_id == case_id)).all()
    alert_ids = [item.alert_id for item in alerts]
    notes = db.scalars(select(InvestigationNote).where(InvestigationNote.case_id == case_id).order_by(InvestigationNote.created_at)).all()
    activity = db.scalars(select(CaseActivity).where(CaseActivity.case_id == case_id).order_by(CaseActivity.created_at)).all()
    return {"case": row, "alert_ids": alert_ids, "notes": notes, "activity": activity}
