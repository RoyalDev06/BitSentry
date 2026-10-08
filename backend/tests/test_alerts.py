from datetime import datetime, timezone
from app.models import Transaction, TransactionOutput
from app.risk.service import assess_transaction
from app.alerts.service import create_alert_for_risk


def test_alert_created_once_for_high_enough_risk(db):
    tx = Transaction(txid="alert-tx", timestamp=datetime.now(timezone.utc), total_output_sats=20_000_000)
    tx.outputs.append(TransactionOutput(vout=0, address="bcrt1output", amount_sats=20_000_000))
    db.add(tx)
    db.commit()
    db.refresh(tx)
    risk = assess_transaction(db, tx)
    first = create_alert_for_risk(db, risk)
    db.commit()
    second = create_alert_for_risk(db, risk)
    assert first.id == second.id
