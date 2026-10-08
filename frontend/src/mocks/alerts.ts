import type { Alert } from "../types/alerts";

export const mockAlerts: Alert[] = [
  {
    id: "ALERT-004",
    riskLevel: "critical",
    indicator: "Multiple-hop activity",
    status: "new",
    createdAt: "2026-09-29T09:42:00Z",
  },
  {
    id: "ALERT-003",
    riskLevel: "high",
    indicator: "Rapid movement of funds",
    status: "in_review",
    createdAt: "2026-09-29T09:15:00Z",
  },
  {
    id: "ALERT-002",
    riskLevel: "medium",
    indicator: "High transaction frequency",
    status: "new",
    createdAt: "2026-09-29T08:20:00Z",
  },
  {
    id: "ALERT-001",
    riskLevel: "high",
    indicator: "Simple peel-chain indicator",
    status: "escalated",
    createdAt: "2026-09-28T17:05:00Z",
  },
];
