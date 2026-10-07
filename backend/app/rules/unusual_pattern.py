from app.config import settings


def detect(transaction) -> dict | None:
    count = len(transaction.outputs)
    if count < settings.unusual_output_count:
        return None
    return {
        "code": "UNUSUAL_PATTERN",
        "name": "Unusual transaction pattern",
        "severity": "MEDIUM",
        "description": "The transaction has unusually high output fan-out.",
        "evidence": {"output_count": count, "threshold": settings.unusual_output_count},
        "score": 20,
    }
