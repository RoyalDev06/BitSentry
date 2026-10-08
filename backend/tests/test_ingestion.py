from datetime import datetime, timezone
from unittest.mock import patch
from app.bitcoin.ingestion import ingest_block
from app.models import Transaction, Block


def test_ingest_block_with_mocked_rpc(db):
    block = {
        "hash": "00block",
        "height": 1,
        "time": int(datetime.now(timezone.utc).timestamp()),
        "previousblockhash": "00prev",
        "tx": [
            {"txid": "coinbase-tx", "vin": [{"coinbase": "abcd"}], "vout": [{"value": 50, "scriptPubKey": {"type": "witness_v1_taproot", "address": "bcrt1miner"}}]},
        ],
    }
    class FakeRPC:
        def get_block_hash(self, height): return "00block"
        def get_block(self, block_hash): return block
        def get_raw_transaction(self, txid): raise AssertionError("coinbase must not fetch previous transaction")

    with patch("app.bitcoin.ingestion.BitcoinRPC", FakeRPC):
        row, count = ingest_block(db, 1, auto_risk=True)

    assert isinstance(row, Block)
    assert count == 1
    tx = db.query(Transaction).filter_by(txid="coinbase-tx").one()
    assert tx.is_coinbase is True
    assert tx.total_output_sats == 5_000_000_000
