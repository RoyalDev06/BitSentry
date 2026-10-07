from app.models import AuditLog


def record_audit(db, actor_id, action, resource_type, resource_id=None, details=None, commit=True):
    row = AuditLog(
        actor_id=actor_id,
        action=action,
        resource_type=resource_type,
        resource_id=str(resource_id) if resource_id is not None else None,
        details=details or {},
    )
    db.add(row)
    if commit:
        db.commit()
    return row
