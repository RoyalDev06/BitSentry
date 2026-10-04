from sqlalchemy import select
from sqlalchemy.orm import Session
from app.config import settings
from app.models import Rule
from app.rules.definitions import RULE_DEFINITIONS


def seed_rules(db: Session) -> None:
    existing = {r.code for r in db.scalars(select(Rule)).all()}
    thresholds = {
        "LARGE_VALUE": settings.large_value_threshold_sats,
        "HIGH_FREQUENCY": settings.high_frequency_count,
        "ADDRESS_ANOMALY": settings.address_anomaly_counterparties,
        "UNUSUAL_PATTERN": settings.unusual_output_count,
        "PEEL_CHAIN": int(settings.peel_dominant_ratio * 100),
        "MULTIPLE_HOP": settings.multiple_hop_depth,
        "RAPID_MOVEMENT": settings.rapid_movement_minutes,
    }
    for code, (name, description, score) in RULE_DEFINITIONS.items():
        if code not in existing:
            db.add(Rule(code=code, name=name, description=description, score=score, threshold=thresholds.get(code), enabled=True))
    db.commit()
