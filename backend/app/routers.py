"""API router exports."""
from app.wallets.routers import router

__all__ = ["router"]
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import (
    Address, Alert, Block, Case, CaseActivity, CaseAlert, InvestigationNote,
    RiskAssessment, Transaction, User, Role, Wallet, AuditLog
)
from app.schemas import (
    AddressLabelUpdate, AlertStatusUpdate, CaseCreate, CaseStatusUpdate,
    LoginRequest, NoteCreate, RiskOut, TokenOut, TransactionOut, UserCreate,
    UserOut, WalletCreate
)
from app.security import get_current_user, require_permission, hash_password, verify_password, create_access_token
from app.bitcoin.rpc import BitcoinRPC
from app.bitcoin.ingestion import ingest_block, sync_to_tip
from app.risk.service import assess_transaction
from app.alerts.service import generate_alerts, create_alert_for_risk, ALERT_STATUSES
from app.cases.service import add_case_activity, case_payload, CASE_STATUSES, PRIORITIES
from app.audit.service import record_audit
from app.config import settings

router = APIRouter(prefix="/api/v1")


@router.post("/auth/login", response_model=TokenOut)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": create_access_token(user.id), "token_type": "bearer"}


@router.get("/auth/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return {"id": user.id, "email": user.email, "full_name": user.full_name, "roles": [r.name for r in user.roles], "is_active": user.is_active}


@router.post("/users", response_model=UserOut)
def create_user(payload: UserCreate, db: Session = Depends(get_db), actor: User = Depends(require_permission("users:write"))):
    email = payload.email.lower().strip()
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(status_code=409, detail="Email already exists")
    role = db.scalar(select(Role).where(Role.name == payload.role))
    if not role:
        raise HTTPException(status_code=400, detail="Unknown role")
    user = User(email=email, full_name=payload.full_name.strip(), password_hash=hash_password(payload.password))
    user.roles.append(role)
    db.add(user)
    db.commit()
    db.refresh(user)
    record_audit(db, actor.id, "USER_CREATED", "user", user.id, {"email": user.email})
    return {"id": user.id, "email": user.email, "full_name": user.full_name, "roles": [role.name], "is_active": user.is_active}


@router.get("/bitcoin/status")
def bitcoin_status(_: User = Depends(require_permission("bitcoin:read"))):
    try:
        info = BitcoinRPC().get_blockchain_info()
        return {"connected": True, "network": info.get("chain"), "blocks": info.get("blocks"), "headers": info.get("headers"), "verification_progress": info.get("verificationprogress")}
    except Exception as exc:
        return {"connected": False, "error": str(exc)}


@router.post("/bitcoin/ingest/block/{height}")
def ingest(height: int, db: Session = Depends(get_db), actor: User = Depends(require_permission("bitcoin:write"))):
    try:
        block, count = ingest_block(db, height)
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=502, detail=f"Bitcoin ingestion failed: {exc}")
    record_audit(db, actor.id, "BLOCK_INGESTED", "block", block.id, {"height": height, "transactions": count})
    return {"block_id": block.id, "height": block.height, "hash": block.hash, "transactions_processed": count}


@router.post("/bitcoin/ingest/sync")
def sync_blocks(start_height: int | None = None, db: Session = Depends(get_db), actor: User = Depends(require_permission("bitcoin:write"))):
    try:
        result = sync_to_tip(db, start_height)
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=502, detail=f"Bitcoin sync failed: {exc}")
    record_audit(db, actor.id, "BLOCKCHAIN_SYNCED", "blockchain", None, result)
    return result


@router.get("/blocks")
def list_blocks(limit: int = Query(50, ge=1, le=200), db: Session = Depends(get_db), _: User = Depends(require_permission("bitcoin:read"))):
    rows = db.scalars(select(Block).order_by(Block.height.desc()).limit(limit)).all()
    return [{"id": b.id, "hash": b.hash, "height": b.height, "timestamp": b.timestamp, "previous_hash": b.previous_hash} for b in rows]


@router.get("/transactions", response_model=list[TransactionOut])
def list_transactions(limit: int = Query(50, ge=1, le=200), db: Session = Depends(get_db), _: User = Depends(require_permission("transactions:read"))):
    return db.scalars(select(Transaction).order_by(Transaction.timestamp.desc()).limit(limit)).all()


@router.get("/transactions/{transaction_id}", response_model=TransactionOut)
def get_transaction(transaction_id: int, db: Session = Depends(get_db), _: User = Depends(require_permission("transactions:read"))):
    tx = db.get(Transaction, transaction_id)
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return tx


@router.get("/transactions/{transaction_id}/risk", response_model=RiskOut)
def transaction_risk(transaction_id: int, db: Session = Depends(get_db), _: User = Depends(require_permission("risk:read"))):
    tx = db.get(Transaction, transaction_id)
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    assessment = tx.risk or assess_transaction(db, tx)
    return {
        "transaction_id": tx.id,
        "score": assessment.score,
        "level": assessment.level,
        "indicators": assessment.indicators,
        "explanation": assessment.explanation,
        "assessed_at": assessment.assessed_at,
    }


@router.post("/transactions/{transaction_id}/analyze", response_model=RiskOut)
def analyze_transaction(transaction_id: int, db: Session = Depends(get_db), actor: User = Depends(require_permission("risk:read"))):
    tx = db.get(Transaction, transaction_id)
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    assessment = assess_transaction(db, tx)
    if assessment.score >= settings.alert_min_score:
        alert = create_alert_for_risk(db, assessment)
        db.commit()
        if alert:
            record_audit(db, actor.id, "RISK_ANALYZED", "transaction", tx.id, {"score": assessment.score, "level": assessment.level})
    return {"transaction_id": tx.id, "score": assessment.score, "level": assessment.level, "indicators": assessment.indicators, "explanation": assessment.explanation, "assessed_at": assessment.assessed_at}


@router.get("/alerts")
def list_alerts(status: str | None = None, limit: int = Query(100, ge=1, le=500), db: Session = Depends(get_db), _: User = Depends(require_permission("alerts:read"))):
    stmt = select(Alert).order_by(Alert.created_at.desc()).limit(limit)
    if status:
        stmt = stmt.where(Alert.status == status)
    return db.scalars(stmt).all()


@router.get("/alerts/{alert_id}")
def get_alert(alert_id: int, db: Session = Depends(get_db), _: User = Depends(require_permission("alerts:read"))):
    row = db.get(Alert, alert_id)
    if not row:
        raise HTTPException(status_code=404, detail="Alert not found")
    return row


@router.patch("/alerts/{alert_id}/status")
def update_alert_status(alert_id: int, payload: AlertStatusUpdate, db: Session = Depends(get_db), actor: User = Depends(require_permission("alerts:write"))):
    if payload.status not in ALERT_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid alert status")
    row = db.get(Alert, alert_id)
    if not row:
        raise HTTPException(status_code=404, detail="Alert not found")
    row.status = payload.status
    db.commit()
    record_audit(db, actor.id, "ALERT_STATUS_CHANGED", "alert", row.id, {"status": payload.status})
    return row


@router.post("/alerts/generate")
def generate_alerts_endpoint(db: Session = Depends(get_db), actor: User = Depends(require_permission("alerts:write"))):
    created = generate_alerts(db)
    record_audit(db, actor.id, "ALERTS_GENERATED", "alert", None, {"created_alert_ids": created})
    return {"created_alert_ids": created}


@router.post("/cases")
def create_case(payload: CaseCreate, db: Session = Depends(get_db), actor: User = Depends(require_permission("cases:write"))):
    if payload.priority not in PRIORITIES:
        raise HTTPException(status_code=400, detail="Invalid priority")
    if payload.assigned_to is not None and not db.get(User, payload.assigned_to):
        raise HTTPException(status_code=400, detail="Assigned user not found")
    row = Case(title=payload.title, description=payload.description, priority=payload.priority, assigned_to=payload.assigned_to, created_by=actor.id)
    db.add(row)
    db.flush()
    add_case_activity(db, row.id, actor.id, "CASE_CREATED")
    db.commit()
    db.refresh(row)
    record_audit(db, actor.id, "CASE_CREATED", "case", row.id)
    return row


@router.get("/cases")
def list_cases(db: Session = Depends(get_db), _: User = Depends(require_permission("cases:read"))):
    return db.scalars(select(Case).order_by(Case.created_at.desc())).all()


@router.get("/cases/{case_id}")
def get_case(case_id: int, db: Session = Depends(get_db), _: User = Depends(require_permission("cases:read"))):
    result = case_payload(db, case_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Case not found")
    return result


@router.post("/cases/{case_id}/alerts/{alert_id}")
def attach_alert(case_id: int, alert_id: int, db: Session = Depends(get_db), actor: User = Depends(require_permission("cases:write"))):
    if not db.get(Case, case_id) or not db.get(Alert, alert_id):
        raise HTTPException(status_code=404, detail="Case or alert not found")
    existing = db.scalar(select(CaseAlert).where(CaseAlert.case_id == case_id, CaseAlert.alert_id == alert_id))
    if not existing:
        db.add(CaseAlert(case_id=case_id, alert_id=alert_id))
        add_case_activity(db, case_id, actor.id, "ALERT_ATTACHED", {"alert_id": alert_id})
        db.commit()
        record_audit(db, actor.id, "ALERT_ATTACHED_TO_CASE", "case", case_id, {"alert_id": alert_id})
    return {"case_id": case_id, "alert_id": alert_id}


@router.post("/cases/{case_id}/notes")
def add_note(case_id: int, payload: NoteCreate, db: Session = Depends(get_db), actor: User = Depends(require_permission("cases:write"))):
    if not db.get(Case, case_id):
        raise HTTPException(status_code=404, detail="Case not found")
    note = InvestigationNote(case_id=case_id, author_id=actor.id, note=payload.note)
    db.add(note)
    add_case_activity(db, case_id, actor.id, "NOTE_ADDED")
    db.commit()
    db.refresh(note)
    record_audit(db, actor.id, "INVESTIGATION_NOTE_ADDED", "case", case_id)
    return note


@router.patch("/cases/{case_id}/status")
def update_case_status(case_id: int, payload: CaseStatusUpdate, db: Session = Depends(get_db), actor: User = Depends(require_permission("cases:write"))):
    if payload.status not in CASE_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid case status")
    row = db.get(Case, case_id)
    if not row:
        raise HTTPException(status_code=404, detail="Case not found")
    row.status = payload.status
    add_case_activity(db, case_id, actor.id, "STATUS_CHANGED", {"status": payload.status})
    db.commit()
    db.refresh(row)
    record_audit(db, actor.id, "CASE_STATUS_CHANGED", "case", case_id, {"status": payload.status})
    return row


@router.get("/addresses")
def list_addresses(db: Session = Depends(get_db), _: User = Depends(require_permission("addresses:read"))):
    return db.scalars(select(Address).order_by(Address.created_at.desc())).all()


@router.patch("/addresses/{address_id}")
def update_address(address_id: int, payload: AddressLabelUpdate, db: Session = Depends(get_db), actor: User = Depends(require_permission("addresses:write"))):
    row = db.get(Address, address_id)
    if not row:
        raise HTTPException(status_code=404, detail="Address not found")
    if payload.label is not None:
        row.label = payload.label
    if payload.is_known is not None:
        row.is_known = payload.is_known
    if payload.is_watchlisted is not None:
        row.is_watchlisted = payload.is_watchlisted
    db.commit()
    record_audit(db, actor.id, "ADDRESS_UPDATED", "address", row.id, {})
    return row


@router.post("/wallets")
def create_wallet(payload: WalletCreate, db: Session = Depends(get_db), actor: User = Depends(require_permission("wallets:write"))):
    if db.scalar(select(Wallet).where(Wallet.address == payload.address)):
        raise HTTPException(status_code=409, detail="Wallet address already registered")
    row = Wallet(name=payload.name, address=payload.address, label=payload.label)
    db.add(row)
    db.commit()
    db.refresh(row)
    record_audit(db, actor.id, "WALLET_CREATED", "wallet", row.id, {})
    return row


@router.get("/wallets")
def list_wallets(db: Session = Depends(get_db), _: User = Depends(require_permission("wallets:read"))):
    return db.scalars(select(Wallet).order_by(Wallet.created_at.desc())).all()


@router.get("/audit")
def list_audit_logs(limit: int = Query(200, ge=1, le=500), db: Session = Depends(get_db), _: User = Depends(require_permission("audit:read"))):
    return db.scalars(select(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit)).all()


@router.get("/dashboard/summary")
def dashboard_summary(db: Session = Depends(get_db), _: User = Depends(require_permission("transactions:read"))):
    total_transactions = db.scalar(select(func.count(Transaction.id))) or 0
    total_alerts = db.scalar(select(func.count(Alert.id))) or 0
    open_alerts = db.scalar(select(func.count(Alert.id)).where(Alert.status.in_(["OPEN", "IN_REVIEW", "ESCALATED"]))) or 0
    high_risk = db.scalar(select(func.count(RiskAssessment.id)).where(RiskAssessment.level.in_(["HIGH", "CRITICAL"]))) or 0
    open_cases = db.scalar(select(func.count(Case.id)).where(Case.status.in_(["OPEN", "IN_PROGRESS", "ESCALATED"]))) or 0
    return {
        "transactions": total_transactions,
        "transactions_monitored": total_transactions,
        "alerts": total_alerts,
        "open_alerts": open_alerts,
        "active_alerts": open_alerts,
        "high_or_critical_risk": high_risk,
        "high_critical_alerts": high_risk,
        "open_cases": open_cases,
    }


@router.get("/dashboard/risk-distribution")
def dashboard_risk_distribution(db: Session = Depends(get_db), _: User = Depends(require_permission("transactions:read"))):
    levels = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    counts = {lvl: 0 for lvl in levels}
    rows = db.execute(
        select(RiskAssessment.level, func.count(RiskAssessment.id)).group_by(RiskAssessment.level)
    ).all()
    for lvl, cnt in rows:
        if lvl and lvl.upper() in counts:
            counts[lvl.upper()] = cnt
        elif lvl:
            counts[lvl.upper()] = cnt
    return [{"level": lvl.lower(), "count": cnt} for lvl, cnt in counts.items()]


@router.get("/dashboard/activity")
def dashboard_activity(db: Session = Depends(get_db), _: User = Depends(require_permission("transactions:read"))):
    recent_txs = db.scalars(select(Transaction).order_by(Transaction.timestamp.desc()).limit(10)).all()
    recent_alerts = db.scalars(select(Alert).order_by(Alert.created_at.desc()).limit(10)).all()

    formatted_txs = []
    for tx in recent_txs:
        formatted_txs.append({
            "id": str(tx.id),
            "txId": tx.txid,
            "amountBtc": round((tx.total_output_sats or 0) / 100_000_000, 8),
            "riskLevel": "low",
            "timestamp": tx.timestamp.isoformat() if tx.timestamp else "",
            "activityType": "transaction",
        })

    formatted_alerts = []
    for alert in recent_alerts:
        indicator_label = "Suspicious Activity"
        if alert.indicators and isinstance(alert.indicators, list) and len(alert.indicators) > 0:
            first_ind = alert.indicators[0]
            if isinstance(first_ind, dict):
                indicator_label = first_ind.get("name") or first_ind.get("code") or indicator_label
            elif isinstance(first_ind, str):
                indicator_label = first_ind
        formatted_alerts.append({
            "id": str(alert.id),
            "riskLevel": (alert.risk_level or "low").lower(),
            "indicator": indicator_label,
            "status": "new" if alert.status == "OPEN" else alert.status.lower(),
            "createdAt": alert.created_at.isoformat() if alert.created_at else "",
        })

    return {
        "recentTransactions": formatted_txs,
        "recentAlerts": formatted_alerts,
    }
