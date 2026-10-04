from app.rules.large_value import detect as detect_large_value
from app.rules.high_frequency import detect as detect_high_frequency
from app.rules.rapid_movement import detect as detect_rapid_movement
from app.rules.multiple_hop import detect as detect_multiple_hop
from app.rules.unusual_pattern import detect as detect_unusual_pattern
from app.rules.address_anomaly import detect as detect_address_anomaly
from app.rules.peel_chain import detect as detect_peel_chain


def detect_transaction(db, transaction) -> list[dict]:
    indicators: list[dict] = []
    stateless = [
        detect_large_value(transaction),
        detect_unusual_pattern(transaction),
        detect_peel_chain(transaction),
    ]
    contextual = [
        detect_high_frequency(db, transaction),
        detect_rapid_movement(db, transaction),
        detect_multiple_hop(db, transaction),
        detect_address_anomaly(db, transaction),
    ]
    for indicator in stateless + contextual:
        if indicator:
            indicators.append(indicator)
    return indicators
