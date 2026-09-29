export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'new' | 'in_review' | 'escalated' | 'cleared';
export type ActivityType = 'transaction' | 'alert_created' | 'case_opened';

export interface DashboardSummary {
  transactionsMonitored: number;
  activeAlerts: number;
  highCriticalAlerts: number;
  openCases: number;
}

export interface RiskDistributionItem {
  level: RiskLevel;
  count: number;
}

export interface RecentTransaction {
  id: string;
  txId: string;
  amountBtc: number;
  riskLevel: RiskLevel;
  timestamp: string;
  activityType: ActivityType;
}

export interface DashboardAlert {
  id: string;
  riskLevel: RiskLevel;
  indicator: string;
  status: AlertStatus;
  createdAt: string;
}

export interface DashboardActivity {
  recentTransactions: RecentTransaction[];
  recentAlerts: DashboardAlert[];
}