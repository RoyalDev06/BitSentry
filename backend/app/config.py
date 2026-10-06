from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "BitSentry AML API"
    database_url: str = "sqlite:///./bitsentry.db"
    jwt_secret: str = "CHANGE_ME_IN_ENV"
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = 60
    bitcoin_rpc_url: str = "http://127.0.0.1:18443"
    bitcoin_rpc_user: str = ""
    bitcoin_rpc_password: str = ""
    bitcoin_network: str = "regtest"
    large_value_threshold_sats: int = 10_000_000
    high_frequency_count: int = 5
    high_frequency_window_minutes: int = 10
    rapid_movement_minutes: int = 10
    address_anomaly_counterparties: int = 10
    unusual_output_count: int = 10
    peel_min_outputs: int = 2
    peel_dominant_ratio: float = 0.60
    multiple_hop_depth: int = 2
    alert_min_score: int = 60
    admin_email: str = "admin@bitsentry.local"
    admin_password: str = "ChangeMe123!"


settings = Settings()
