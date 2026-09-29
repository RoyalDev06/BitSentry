import type { AlertStatus, RiskLevel } from '../../types/dashboard';

export const riskLabel: Record<RiskLevel, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const statusLabel: Record<AlertStatus, string> = {
  new: 'New',
  in_review: 'In Review',
  escalated: 'Escalated',
  cleared: 'Cleared',
};

export const statusClasses: Record<AlertStatus, string> = {
  new: 'bg-brand-teal/15 text-brand-teal',
  in_review: 'bg-brand-gold/15 text-brand-gold',
  escalated: 'bg-risk-high-bg text-risk-high',
  cleared: 'bg-risk-low-bg text-risk-low',
};

export function formatBtc(amount: number): string {
  return `${amount.toFixed(4)} BTC`;
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncateTxId(txId: string): string {
  return txId.length > 14 ? `${txId.slice(0, 8)}…${txId.slice(-4)}` : txId;
}

export function formatCount(n: number): string {
  return n.toLocaleString();
}