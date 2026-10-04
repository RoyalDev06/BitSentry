
def calculate_risk(indicators: list[dict]) -> tuple[int, str]:
    score = min(100, sum(int(i.get("score", 0)) for i in indicators))
    if score >= 80:
        level = "CRITICAL"
    elif score >= 60:
        level = "HIGH"
    elif score >= 30:
        level = "MEDIUM"
    else:
        level = "LOW"
    return score, level
