import type { AlertStatus, RiskLevel } from "./dashboard";

export interface Alert {
  id: string;
  riskLevel: RiskLevel;
  indicator: string;
  status: AlertStatus;
  createdAt: string;
}
