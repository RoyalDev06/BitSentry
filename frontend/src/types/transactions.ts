export type TransactionStatus =
  | "confirmed"
  | "pending"
  | "flagged";

export type TransactionRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface Transaction {
  id: string;
  txId: string;
  amountBtc: number;
  riskLevel: TransactionRiskLevel;
  status: TransactionStatus;
  timestamp: string;
  fromAddress: string;
  toAddress: string;
  riskScore: number;
}