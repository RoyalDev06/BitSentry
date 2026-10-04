from app.config import settings


def detect(transaction) -> dict | None:
    amounts = sorted([o.amount_sats for o in transaction.outputs if o.amount_sats > 0], reverse=True)
    if len(amounts) != settings.peel_min_outputs:
        return None
    total = sum(amounts)
    ratio = amounts[0] / total if total else 0
    if ratio < settings.peel_dominant_ratio:
        return None
    return {
        "code": "PEEL_CHAIN",
        "name": "Possible peel-chain pattern",
        "severity": "MEDIUM",
        "description": "Two outputs exist and one dominates the value while a smaller output remains.",
        "evidence": {"output_amounts_sats": amounts, "dominant_output_ratio": round(ratio, 4), "configured_ratio": settings.peel_dominant_ratio},
        "score": 25,
    }
