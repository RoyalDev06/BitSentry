import type { RiskLevel } from './dashboard';

export type CaseStatus =
  | 'open'
  | 'under_investigation'
  | 'escalated'
  | 'resolved'
  | 'closed';

export type CasePriority = RiskLevel;

export interface RelatedAlert {
  id: string;
  indicator: string;
  riskLevel: RiskLevel;
  status: 'new' | 'in_review' | 'escalated' | 'cleared';
  createdAt: string;
}

export interface RelatedTransaction {
  id: string;
  txId: string;
  amountBtc: number;
  riskLevel: RiskLevel;
  timestamp: string;
}

export interface RelatedAddress {
  address: string;
  label: string | null;
  riskLevel: RiskLevel;
  txCount: number;
}

export interface CaseNote {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface Case {
  id: string;
  title: string;
  status: CaseStatus;
  priority: CasePriority;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CaseDetail extends Case {
  description: string;
  relatedAlerts: RelatedAlert[];
  relatedTransactions: RelatedTransaction[];
  relatedAddresses: RelatedAddress[];
  notes: CaseNote[];
}