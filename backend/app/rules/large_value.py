from app.config import settings


def detect(transaction) -> dict | None:
    amount = int(transaction.total_output_sats or 0)
    if amount <= settings.large_value_threshold_sats:
        return None
    return {
        "code": "LARGE_VALUE",
        "name": "Large-value transaction",
        "severity": "HIGH",
        "description": "Transaction output value exceeds the configured development threshold.",
        "evidence": {"amount_sats": amount, "threshold_sats": settings.large_value_threshold_sats},
        "score": 30,
    }
