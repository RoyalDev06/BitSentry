"""
Seed script to populate realistic Bitcoin transactions, addresses, alerts, and cases
for development and testing without needing a live Bitcoin node.
"""

from datetime import datetime, timezone, timedelta
from sqlalchemy import select
from app.database import SessionLocal, Base, engine
from app.models import (
    Transaction,
    TransactionInput,
    TransactionOutput,
    Address,
    Case,
    CaseAlert,
    InvestigationNote,
    User,
)
from app.auth.service import seed_auth
from app.rules.service import seed_rules
from app.risk.service import assess_transaction
from app.alerts.service import create_alert_for_risk, generate_alerts


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        print("[+] Seeding auth and AML rules...")
        seed_auth(db)
        seed_rules(db)

        admin = db.scalar(select(User).where(User.email == "admin@bitsentry.local"))
        if not admin:
            print("[-] Admin user missing.")
            return

        # Check if transactions already exist
        existing_txs = db.scalar(select(Transaction))
        if existing_txs:
            print("[*] Transactions already exist in database.")
        else:
            print("[+] Creating sample Bitcoin transactions and addresses...")
            now = datetime.now(timezone.utc)

            # Sample Bitcoin addresses
            addr1 = "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq"
            addr2 = "bc1q9d80d2w98f2444vj4486k0swq29s390f7q9l4s"
            addr3 = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
            addr_suspicious = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
            addr_exchange = "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy"

            for addr_str, label, watchlisted in [
                (addr1, "Treasury Wallet", False),
                (addr2, "Cold Storage", False),
                (addr3, "Genesis Address", False),
                (addr_suspicious, "Flagged Mixer Deposit", True),
                (addr_exchange, "Binance Hot Wallet", False),
            ]:
                if not db.scalar(select(Address).where(Address.address == addr_str)):
                    db.add(Address(address=addr_str, label=label, is_watchlisted=watchlisted, is_known=True))

            # Sample Transactions
            # 1. High value whale transaction (will trigger LARGE_VALUE rule: > 10,000,000 sats)
            tx1 = Transaction(
                txid="a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d",
                block_height=840100,
                timestamp=now - timedelta(hours=2),
                total_input_sats=150_000_000,
                total_output_sats=149_950_000,
                fee_sats=50_000,
                is_coinbase=False,
            )
            tx1.inputs.append(TransactionInput(prev_txid="0000000000000000000000000000000000000000000000000000000000000001", prev_vout=0, address=addr1, amount_sats=150_000_000))
            tx1.outputs.append(TransactionOutput(vout=0, address=addr_suspicious, amount_sats=140_000_000, script_type="witness_v0_keyhash"))
            tx1.outputs.append(TransactionOutput(vout=1, address=addr2, amount_sats=9_950_000, script_type="witness_v0_keyhash"))
            db.add(tx1)

            # 2. Normal retail transaction
            tx2 = Transaction(
                txid="b2186ec66e527e4db200a66c7195f3226c0456f27d6da413ad91f0e6acf6e59e",
                block_height=840101,
                timestamp=now - timedelta(hours=1, minutes=30),
                total_input_sats=5_000_000,
                total_output_sats=4_980_000,
                fee_sats=20_000,
                is_coinbase=False,
            )
            tx2.inputs.append(TransactionInput(prev_txid=tx1.txid, prev_vout=1, address=addr2, amount_sats=5_000_000))
            tx2.outputs.append(TransactionOutput(vout=0, address=addr_exchange, amount_sats=4_980_000, script_type="scripthash"))
            db.add(tx2)

            # 3. Suspicious Peel Chain / Rapid Movement transaction
            tx3 = Transaction(
                txid="c3297fd77f638f5ec311b77d820604337d1567038e7eb524be0201f7bdf7f60f",
                block_height=840102,
                timestamp=now - timedelta(minutes=45),
                total_input_sats=85_000_000,
                total_output_sats=84_960_000,
                fee_sats=40_000,
                is_coinbase=False,
            )
            tx3.inputs.append(TransactionInput(prev_txid=tx1.txid, prev_vout=0, address=addr_suspicious, amount_sats=85_000_000))
            tx3.outputs.append(TransactionOutput(vout=0, address=addr1, amount_sats=75_000_000, script_type="witness_v0_keyhash"))
            tx3.outputs.append(TransactionOutput(vout=1, address=addr2, amount_sats=9_960_000, script_type="witness_v0_keyhash"))
            db.add(tx3)

            # 4. Coinbase block reward transaction
            tx4 = Transaction(
                txid="d43080e88074906fd422c88e931715448e2678149f8fc635cf131208cef80710",
                block_height=840103,
                timestamp=now - timedelta(minutes=15),
                total_input_sats=0,
                total_output_sats=312_500_000,
                fee_sats=0,
                is_coinbase=True,
            )
            tx4.outputs.append(TransactionOutput(vout=0, address=addr1, amount_sats=312_500_000, script_type="witness_v0_keyhash"))
            db.add(tx4)

            # 5. Pending unconfirmed transaction
            tx5 = Transaction(
                txid="e54191f99185a170e533d99fa42826559f3789250a90d746d0242319df091821",
                block_height=None,
                timestamp=now - timedelta(minutes=5),
                total_input_sats=25_000_000,
                total_output_sats=24_975_000,
                fee_sats=25_000,
                is_coinbase=False,
            )
            tx5.inputs.append(TransactionInput(prev_txid=tx3.txid, prev_vout=0, address=addr1, amount_sats=25_000_000))
            tx5.outputs.append(TransactionOutput(vout=0, address=addr_suspicious, amount_sats=24_975_000, script_type="witness_v0_keyhash"))
            db.add(tx5)

            db.commit()
            print("[+] 5 Bitcoin transactions added.")

        # Run AML scoring and generate alerts on all transactions
        print("[+] Running AML detection engine on all transactions...")
        all_txs = db.scalars(select(Transaction)).all()
        for tx in all_txs:
            assessment = assess_transaction(db, tx)
            if assessment.score >= 50:
                create_alert_for_risk(db, assessment)
        db.commit()

        # Generate alerts batch
        created_alerts = generate_alerts(db)
        print(f"[+] Alerts generated: {len(created_alerts)}")

        # Create sample investigation cases if none exist
        if not db.scalar(select(Case)):
            print("[+] Creating sample investigation cases...")
            case1 = Case(
                title="Whale transfer to watchlisted mixer deposit",
                description="Investigating 1.4 BTC transfer originating from treasury to watchlisted deposit address.",
                priority="HIGH",
                status="OPEN",
                assigned_to=admin.id,
                created_by=admin.id,
            )
            db.add(case1)
            db.flush()

            # Attach first alert to case
            alerts = generate_alerts(db)
            if alerts:
                db.add(CaseAlert(case_id=case1.id, alert_id=alerts[0]))

            db.add(InvestigationNote(case_id=case1.id, author_id=admin.id, note="Flagged during routine AML threshold review. Counterparty address appears on sanction watchlist."))
            db.commit()
            print(f"[+] Created Case #{case1.id}")

        print("\n[SUCCESS] Database successfully seeded with test data!")
        print("Now reload your frontend at http://localhost:5173 to see the data.")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
