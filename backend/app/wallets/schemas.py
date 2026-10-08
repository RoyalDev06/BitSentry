from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserCreate(BaseModel):
    email: str
    full_name: str = Field(min_length=1, max_length=255)
    password: str = Field(min_length=8)
    role: str = "analyst"


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: str
    full_name: str
    is_active: bool
    roles: list[str]


class TransactionInputOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    prev_txid: str | None
    prev_vout: int | None
    address: str | None
    amount_sats: int


class TransactionOutputOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    vout: int
    address: str | None
    amount_sats: int
    script_type: str | None


class TransactionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    txid: str
    block_height: int | None
    timestamp: datetime
    total_input_sats: int
    total_output_sats: int
    fee_sats: int
    is_coinbase: bool
    inputs: list[TransactionInputOut]
    outputs: list[TransactionOutputOut]


class RiskIndicatorOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    code: str
    name: str
    severity: str
    description: str
    evidence: dict
    score: int


class RiskOut(BaseModel):
    transaction_id: int
    score: int
    level: str
    indicators: list[RiskIndicatorOut]
    explanation: str
    assessed_at: datetime


class CaseCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str = ""
    priority: str = "MEDIUM"
    assigned_to: int | None = None


class CaseStatusUpdate(BaseModel):
    status: str


class NoteCreate(BaseModel):
    note: str = Field(min_length=1)


class WalletCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    address: str = Field(min_length=1, max_length=255)
    label: str | None = None


class AddressLabelUpdate(BaseModel):
    label: str | None = None
    is_known: bool | None = None
    is_watchlisted: bool | None = None


class AlertStatusUpdate(BaseModel):
    status: str
