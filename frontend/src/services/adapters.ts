import type { Alert } from '../types/alerts';
import type {
  AlertStatus,
  DashboardActivity,
  DashboardSummary,
  RiskDistributionItem,
  RiskLevel,
} from '../types/dashboard';
import type {
  Transaction,
  TransactionRiskLevel,
  TransactionStatus,
} from '../types/transactions';
import type { BitcoinAddress } from '../types/addresses';
import type {
  CaseDetail,
  CasePriority,
  CaseStatus,
} from '../types/cases';

// ==========================================
// 1. Alerts Adapters
// ==========================================

export interface BackendAlert {
  id: number;
  transaction_id: number;
  risk_assessment_id: number;
  risk_score: number;
  risk_level: string;
  indicators: Array<{ name?: string; code?: string } | string>;
  status: string;
  created_at: string;
}

const BACKEND_TO_FRONTEND_ALERT_STATUS: Record<string, AlertStatus> = {
  OPEN: 'new',
  IN_REVIEW: 'in_review',
  ESCALATED: 'escalated',
  CLOSED: 'cleared',
  FALSE_POSITIVE: 'cleared',
};

const FRONTEND_TO_BACKEND_ALERT_STATUS: Record<AlertStatus, string> = {
  new: 'OPEN',
  in_review: 'IN_REVIEW',
  escalated: 'ESCALATED',
  cleared: 'CLOSED',
};

export function toFrontendAlert(raw: BackendAlert): Alert {
  let indicator = 'Suspicious Activity';
  if (Array.isArray(raw.indicators) && raw.indicators.length > 0) {
    const first = raw.indicators[0];
    if (typeof first === 'object' && first !== null) {
      indicator = first.name || first.code || indicator;
    } else if (typeof first === 'string') {
      indicator = first;
    }
  }

  const riskLevel = (raw.risk_level || 'low').toLowerCase() as RiskLevel;
  const status =
    BACKEND_TO_FRONTEND_ALERT_STATUS[raw.status.toUpperCase()] || 'new';

  return {
    id: String(raw.id),
    riskLevel,
    indicator,
    status,
    createdAt: raw.created_at,
  };
}

export function toBackendAlertStatus(status: AlertStatus): string {
  return FRONTEND_TO_BACKEND_ALERT_STATUS[status] || 'OPEN';
}

// ==========================================
// 2. Transactions Adapters
// ==========================================

export interface BackendTransactionInput {
  prev_txid: string | null;
  prev_vout: number | null;
  address: string | null;
  amount_sats: number;
}

export interface BackendTransactionOutput {
  vout: number;
  address: string | null;
  amount_sats: number;
  script_type: string | null;
}

export interface BackendTransaction {
  id: number;
  txid: string;
  block_height: number | null;
  timestamp: string;
  total_input_sats: number;
  total_output_sats: number;
  fee_sats: number;
  is_coinbase: boolean;
  inputs?: BackendTransactionInput[];
  outputs?: BackendTransactionOutput[];
}

export function toFrontendTransaction(
  raw: BackendTransaction,
  riskAssessment?: { score?: number; level?: string }
): Transaction {
  const fromAddress = raw.is_coinbase
    ? 'Coinbase (Mined)'
    : raw.inputs?.find((i) => i.address)?.address || 'Unknown';

  const toAddress =
    raw.outputs?.find((o) => o.address)?.address || 'Unknown';

  const amountBtc = Number(((raw.total_output_sats || 0) / 1e8).toFixed(8));

  const riskLevel = (
    riskAssessment?.level || 'low'
  ).toLowerCase() as TransactionRiskLevel;

  const riskScore = riskAssessment?.score ?? 0;

  let status: TransactionStatus = 'confirmed';
  if (raw.block_height === null) {
    status = 'pending';
  } else if (riskScore >= 70) {
    status = 'flagged';
  }

  return {
    id: String(raw.id),
    txId: raw.txid,
    amountBtc,
    riskLevel,
    status,
    timestamp: raw.timestamp,
    fromAddress,
    toAddress,
    riskScore,
  };
}

// ==========================================
// 3. Addresses Adapters
// ==========================================

export interface BackendAddress {
  id: number;
  address: string;
  label?: string | null;
  is_known?: boolean;
  is_watchlisted?: boolean;
  created_at: string;
}

export function toFrontendAddress(raw: BackendAddress): BitcoinAddress {
  return {
    id: String(raw.id),
    address: raw.address,
    network: 'bitcoin',
    balance: 0,
    transactionCount: 0,
    risk: raw.is_watchlisted ? 'high' : 'low',
    firstSeen: raw.created_at,
    lastActivity: raw.created_at,
  };
}

// ==========================================
// 4. Dashboard Adapters
// ==========================================

export interface BackendDashboardSummary {
  transactions?: number;
  transactions_monitored?: number;
  alerts?: number;
  open_alerts?: number;
  active_alerts?: number;
  high_or_critical_risk?: number;
  high_critical_alerts?: number;
  open_cases?: number;
}

export function toFrontendDashboardSummary(
  raw: BackendDashboardSummary
): DashboardSummary {
  return {
    transactionsMonitored:
      raw.transactions_monitored ?? raw.transactions ?? 0,
    activeAlerts:
      raw.active_alerts ?? raw.open_alerts ?? raw.alerts ?? 0,
    highCriticalAlerts:
      raw.high_critical_alerts ?? raw.high_or_critical_risk ?? 0,
    openCases: raw.open_cases ?? 0,
  };
}

export function toFrontendRiskDistribution(
  raw: Array<{ level: string; count: number }>
): RiskDistributionItem[] {
  return (raw || []).map((item) => ({
    level: item.level.toLowerCase() as RiskLevel,
    count: item.count,
  }));
}

export function toFrontendDashboardActivity(
  raw: any
): DashboardActivity {
  return {
    recentTransactions: raw.recentTransactions || [],
    recentAlerts: raw.recentAlerts || [],
  };
}

// ==========================================
// 5. Cases Adapters
// ==========================================

export interface BackendCase {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_to: number | null;
  created_at: string;
  updated_at: string;
}

const BACKEND_TO_FRONTEND_CASE_STATUS: Record<string, CaseStatus> = {
  OPEN: 'open',
  IN_PROGRESS: 'under_investigation',
  ESCALATED: 'escalated',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

const FRONTEND_TO_BACKEND_CASE_STATUS: Record<CaseStatus, string> = {
  open: 'OPEN',
  under_investigation: 'IN_PROGRESS',
  escalated: 'ESCALATED',
  resolved: 'CLOSED',
  closed: 'CLOSED',
};

export function toFrontendCase(raw: BackendCase): CaseDetail {
  const status =
    BACKEND_TO_FRONTEND_CASE_STATUS[raw.status.toUpperCase()] || 'open';
  const priority = (raw.priority || 'MEDIUM').toLowerCase() as CasePriority;

  return {
    id: `CASE-${raw.id}`,
    title: raw.title,
    description: raw.description || '',
    status,
    priority,
    assignedTo: raw.assigned_to ? `User #${raw.assigned_to}` : null,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    relatedAlerts: [],
    relatedTransactions: [],
    relatedAddresses: [],
    notes: [],
  };
}

export function toBackendCaseStatus(status: CaseStatus): string {
  return FRONTEND_TO_BACKEND_CASE_STATUS[status] || 'OPEN';
}
