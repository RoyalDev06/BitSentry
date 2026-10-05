import type { CasePriority, CaseStatus } from '../../types/cases';

export const statusLabel: Record<CaseStatus, string> = {
  open: 'Open',
  in_review: 'In Review',
  escalated: 'Escalated',
  closed: 'Closed',
};

export const statusClasses: Record<CaseStatus, string> = {
  open: 'bg-brand-teal/15 text-brand-teal',
  in_review: 'bg-brand-gold/15 text-brand-gold',
  escalated: 'bg-risk-high-bg text-risk-high',
  closed: 'bg-risk-low-bg text-risk-low',
};

export const priorityLabel: Record<CasePriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export function formatCaseDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}