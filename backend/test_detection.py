from app.detection.service import analyze_transaction


transaction = {
    "txid": "abc123",
    "amount_sats": 15_000_000,
}


result = analyze_transaction(transaction)

print(result)





