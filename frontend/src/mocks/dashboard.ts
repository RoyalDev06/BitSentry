import type {
  DashboardSummary,
  RiskDistributionItem,
  DashboardActivity,
} from '../types/dashboard';

export const mockSummary: DashboardSummary = {
  transactionsMonitored: 12480,
  activeAlerts: 37,
  highCriticalAlerts: 9,
  openCases: 5,
};

export const mockRiskDistribution: RiskDistributionItem[] = [
  { level: 'low', count: 18 },
  { level: 'medium', count: 10 },
  { level: 'high', count: 7 },
  { level: 'critical', count: 2 },
];

export const mockActivity: DashboardActivity = {
  recentTransactions: [
    { id: '1', txId: 'a1f3c9e27b4d8a10c5e6', amountBtc: 2.4501, riskLevel: 'critical', timestamp: '2026-09-29T09:42:00Z', activityType: 'alert_created' },
    { id: '2', txId: '7be04d19a3c2f8e1b6d0', amountBtc: 0.8123, riskLevel: 'high',     timestamp: '2026-09-29T09:15:00Z', activityType: 'alert_created' },
    { id: '3', txId: 'c93a5e0f1d7b24a86e3c', amountBtc: 0.1204, riskLevel: 'medium',   timestamp: '2026-09-29T08:57:00Z', activityType: 'transaction' },
    { id: '4', txId: '2d8e6b41f0a97c35d1e8', amountBtc: 0.0345, riskLevel: 'low',      timestamp: '2026-09-29T08:30:00Z', activityType: 'transaction' },
    { id: '5', txId: 'f05b7a3c9e1d62480b7a', amountBtc: 1.9876, riskLevel: 'high',     timestamp: '2026-09-29T08:02:00Z', activityType: 'case_opened' },
  ],
  recentAlerts: [
    { id: 'ALERT-004', riskLevel: 'critical', indicator: 'Multiple-hop activity',        status: 'new',       createdAt: '2026-09-29T09:42:00Z' },
    { id: 'ALERT-003', riskLevel: 'high',     indicator: 'Rapid movement of funds',      status: 'in_review', createdAt: '2026-09-29T09:15:00Z' },
    { id: 'ALERT-002', riskLevel: 'medium',   indicator: 'High transaction frequency',   status: 'new',       createdAt: '2026-09-29T08:20:00Z' },
    { id: 'ALERT-001', riskLevel: 'high',     indicator: 'Simple peel-chain indicator',  status: 'escalated', createdAt: '2026-09-28T17:05:00Z' },
  ],
};