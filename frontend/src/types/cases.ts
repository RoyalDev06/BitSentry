import type { RiskLevel } from './dashboard';

export type CaseStatus = 'open' | 'in_review' | 'escalated' | 'closed';
export type CasePriority = RiskLevel; // low | medium | high | critical

export interface Case {
  id: string;                 // e.g. "CASE-004"
  title: string;              // e.g. "Rapid layering via 3 addresses"
  status: CaseStatus;
  priority: CasePriority;
  alertCount: number;         // how many alerts are grouped into this case
  assignedTo: string | null;  // analyst name, or null if unassigned
  createdAt: string;          // ISO 8601
  updatedAt: string;          // ISO 8601
}