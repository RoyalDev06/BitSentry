from datetime import datetime, timezone
from app.models import Transaction, TransactionInput, TransactionOutput
from app.risk.service import assess_transaction


def make_tx(db, txid, amount, address="bcrt1input"):
    tx = Transaction(txid=txid, timestamp=datetime.now(timezone.utc), total_input_sats=amount, total_output_sats=amount)
    tx.inputs.append(TransactionInput(prev_txid="parent-" + txid, prev_vout=0, address=address, amount_sats=amount))
    tx.outputs.append(TransactionOutput(vout=0, address="bcrt1output", amount_sats=amount))
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx


def test_large_value_rule(db):
    tx = make_tx(db, "large", 20_000_000)
    risk = assess_transaction(db, tx)
    assert risk.score == 30
    assert risk.level == "MEDIUM"
    assert any(item.code == "LARGE_VALUE" for item in risk.indicators)


def test_normal_transaction_is_low(db):
    tx = make_tx(db, "normal", 100_000)
    risk = assess_transaction(db, tx)
    assert risk.score == 0
    assert risk.level == "LOW"


def test_multiple_indicators_are_combined(db):
    tx = Transaction(txid="fanout", timestamp=datetime.now(timezone.utc), total_input_sats=20_000_000, total_output_sats=20_000_000)
    tx.inputs.append(TransactionInput(prev_txid="parent-fanout", prev_vout=0, address="bcrt1input", amount_sats=20_000_000))
    for i in range(10):
        tx.outputs.append(TransactionOutput(vout=i, address=f"bcrt1out{i}", amount_sats=2_000_000))
    db.add(tx)
    db.commit()
    db.refresh(tx)
    risk = assess_transaction(db, tx)
    codes = {item.code for item in risk.indicators}
    assert "LARGE_VALUE" in codes
    assert "UNUSUAL_PATTERN" in codes
    assert risk.score >= 50


def test_rapid_movement_uses_prior_output_address(db):
    from datetime import timedelta
    from app.models import Transaction, TransactionInput, TransactionOutput
    now = datetime.now(timezone.utc)
    previous = Transaction(txid="previous", timestamp=now - timedelta(minutes=2), total_output_sats=5_000_000)
    previous.outputs.append(TransactionOutput(vout=0, address="bcrt1rapid", amount_sats=5_000_000))
    current = Transaction(txid="current", timestamp=now, total_input_sats=5_000_000, total_output_sats=4_900_000)
    current.inputs.append(TransactionInput(prev_txid="previous", prev_vout=0, address="bcrt1rapid", amount_sats=5_000_000))
    current.outputs.append(TransactionOutput(vout=0, address="bcrt1dest", amount_sats=4_900_000))
    db.add_all([previous, current])
    db.commit()
    db.refresh(current)
    risk = assess_transaction(db, current)
    assert any(item.code == "RAPID_MOVEMENT" for item in risk.indicators)
