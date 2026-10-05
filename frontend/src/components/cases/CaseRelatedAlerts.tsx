import { Link } from 'react-router-dom';
import type { RelatedAlert } from '../../types/cases';
import RiskBadge from '../ui/RiskBadge';
import { formatCaseDate, statusClasses, statusLabel } from './caseUtils';

interface CaseRelatedAlertsProps {
  alerts: RelatedAlert[];
}

export default function CaseRelatedAlerts({ alerts }: CaseRelatedAlertsProps) {
  if (alerts.length === 0) {
    return (
      <p className="py-4 text-sm text-text-muted">No related alerts on this case.</p>
    );
  }

  return (
    <ul className="divide-y divide-border-subtle">
      {alerts.map((a) => (
        <li key={a.id}>
          <Link
            to="/alerts"
            className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-background-hover"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-text-primary">
                {a.indicator}
              </p>
              <p className="mt-0.5 text-xs text-text-muted">
                {a.id} · {formatCaseDate(a.createdAt)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <RiskBadge level={a.riskLevel} />
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClasses[a.status as keyof typeof statusClasses] ?? ''}`}
              >
                {statusLabel[a.status as keyof typeof statusLabel] ?? a.status}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}