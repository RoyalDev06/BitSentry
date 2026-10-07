from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models import Address, Block, Transaction, TransactionInput, TransactionOutput
from app.bitcoin.rpc import BitcoinRPC, amount_to_sats


def _script_address(script: dict) -> str | None:
    address = script.get("address")
    if address:
        return address
    addresses = script.get("addresses") or []
    return addresses[0] if addresses else None


def _get_prev_output(rpc: BitcoinRPC, prev_txid: str, prev_vout: int):
    raw = rpc.get_raw_transaction(prev_txid)
    outputs = raw.get("vout", [])
    if prev_vout >= len(outputs):
        return None
    return outputs[prev_vout]


def ingest_block(db: Session, height: int, auto_risk: bool = True):
    from app.risk.service import assess_transaction
    from app.alerts.service import create_alert_for_risk
    from app.config import settings

    if height < 0:
        raise ValueError("Block height cannot be negative")
    rpc = BitcoinRPC()
    block_hash = rpc.get_block_hash(height)
    raw = rpc.get_block(block_hash)
    existing = db.scalar(select(Block).where(Block.hash == block_hash))
    if existing:
        return existing, 0

    block = Block(
        hash=block_hash,
        height=height,
        timestamp=datetime.fromtimestamp(raw["time"], timezone.utc),
        previous_hash=raw.get("previousblockhash"),
    )
    db.add(block)
    db.flush()
    processed = 0

    for tx_data in raw.get("tx", []):
        txid = tx_data["txid"]
        if db.scalar(select(Transaction).where(Transaction.txid == txid)):
            continue

        vin = tx_data.get("vin", [])
        vout = tx_data.get("vout", [])
        is_coinbase = any("coinbase" in item for item in vin)
        inputs = []
        total_in = 0

        if not is_coinbase:
            for item in vin:
                prev_txid = item.get("txid")
                prev_vout = item.get("vout")
                prev_output = None
                if prev_txid is not None and prev_vout is not None:
                    prev_output = _get_prev_output(rpc, prev_txid, prev_vout)
                amount = amount_to_sats(prev_output.get("value", 0)) if prev_output else 0
                address = _script_address((prev_output or {}).get("scriptPubKey", {}))
                inputs.append(TransactionInput(prev_txid=prev_txid, prev_vout=prev_vout, address=address, amount_sats=amount))
                total_in += amount

        outputs = []
        total_out = 0
        for index, output in enumerate(vout):
            amount = amount_to_sats(output.get("value", 0))
            address = _script_address(output.get("scriptPubKey", {}))
            outputs.append(TransactionOutput(vout=index, address=address, amount_sats=amount, script_type=output.get("scriptPubKey", {}).get("type")))
            total_out += amount

        tx = Transaction(
            txid=txid,
            block=block,
            block_height=height,
            timestamp=block.timestamp,
            total_input_sats=total_in,
            total_output_sats=total_out,
            fee_sats=max(0, total_in - total_out) if not is_coinbase else 0,
            is_coinbase=is_coinbase,
            raw_data=tx_data,
            inputs=inputs,
            outputs=outputs,
        )
        db.add(tx)
        db.flush()

        for item in [*inputs, *outputs]:
            if item.address and not db.scalar(select(Address).where(Address.address == item.address)):
                db.add(Address(address=item.address))
        db.flush()

        if auto_risk and not is_coinbase:
            assessment = assess_transaction(db, tx)
            if assessment.score >= settings.alert_min_score:
                create_alert_for_risk(db, assessment)
        processed += 1

    db.commit()
    return block, processed


def sync_to_tip(db: Session, start_height: int | None = None):
    rpc = BitcoinRPC()
    tip = rpc.get_block_count()
    if start_height is None:
        latest = db.scalar(select(Block).order_by(Block.height.desc()).limit(1))
        start_height = 0 if latest is None else latest.height + 1
    if start_height > tip:
        return {"from_height": start_height, "to_height": tip, "blocks_processed": 0, "transactions_processed": 0}
    processed = 0
    transactions = 0
    for height in range(start_height, tip + 1):
        _, count = ingest_block(db, height)
        processed += 1
        transactions += count
    return {"from_height": start_height, "to_height": tip, "blocks_processed": processed, "transactions_processed": transactions}
