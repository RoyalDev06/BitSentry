from app.config import settings

RULE_DEFINITIONS = {
    "LARGE_VALUE": ("Large-value transaction", "Transaction output value exceeds the configured development threshold.", 30),
    "HIGH_FREQUENCY": ("High transaction frequency", "An input address is involved in an unusually high number of transactions within a short window.", 20),
    "RAPID_MOVEMENT": ("Rapid movement", "An input address was involved in a prior transaction shortly before this transaction.", 25),
    "MULTIPLE_HOP": ("Multiple-hop movement", "Transaction ancestry shows multiple consecutive hops within the configured trace depth.", 25),
    "UNUSUAL_PATTERN": ("Unusual transaction pattern", "The transaction has unusually high output fan-out.", 20),
    "ADDRESS_ANOMALY": ("Address anomaly", "An input address is associated with an unusually high number of distinct output counterparties.", 20),
    "PEEL_CHAIN": ("Possible peel-chain pattern", "Two outputs exist and one dominates the value while a smaller output remains.", 25),
}


def rule_score(code: str) -> int:
    return RULE_DEFINITIONS[code][2]
