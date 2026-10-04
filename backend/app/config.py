import os
from dataclasses import dataclass


def _int(name: str, default: int) -> int:
    return int(os.getenv(name, str(default)))


def _float(name: str, default: float) -> float:
    return float(os.getenv(name, str(default)))


@dataclass(frozen=True)
class Settings:
    app_name: str = os.getenv("APP_NAME", "BitSentry AML API")
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./bitsentry.db")
    jwt_secret: str = os.getenv("JWT_SECRET", "CHANGE_ME_IN_ENV")
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = _int("ACCESS_TOKEN_MINUTES", 60)
    bitcoin_rpc_url: str = os.getenv("BITCOIN_RPC_URL", "http://127.0.0.1:18443")
    bitcoin_rpc_user: str = os.getenv("BITCOIN_RPC_USER", "")
    bitcoin_rpc_password: str = os.getenv("BITCOIN_RPC_PASSWORD", "")
    bitcoin_network: str = os.getenv("BITCOIN_NETWORK", "regtest")
    large_value_threshold_sats: int = _int("LARGE_VALUE_THRESHOLD_SATS", 10_000_000)
    high_frequency_count: int = _int("HIGH_FREQUENCY_COUNT", 5)
    high_frequency_window_minutes: int = _int("HIGH_FREQUENCY_WINDOW_MINUTES", 10)
    rapid_movement_minutes: int = _int("RAPID_MOVEMENT_MINUTES", 10)
    address_anomaly_counterparties: int = _int("ADDRESS_ANOMALY_COUNTERPARTIES", 10)
    unusual_output_count: int = _int("UNUSUAL_OUTPUT_COUNT", 10)
    peel_min_outputs: int = _int("PEEL_MIN_OUTPUTS", 2)
    peel_dominant_ratio: float = _float("PEEL_DOMINANT_RATIO", 0.60)
    multiple_hop_depth: int = _int("MULTIPLE_HOP_DEPTH", 2)
    alert_min_score: int = _int("ALERT_MIN_SCORE", 60)
    admin_email: str = os.getenv("ADMIN_EMAIL", "admin@bitsentry.local")
    admin_password: str = os.getenv("ADMIN_PASSWORD", "ChangeMe123!")


settings = Settings()
