import type { RiskLevel } from '../../types/dashboard';
import { riskLabel } from '../dashboard/dashboardUtils';

const riskClasses: Record<RiskLevel, string> = {
  low: 'bg-risk-low-bg text-risk-low',
  medium: 'bg-risk-medium-bg text-risk-medium',
  high: 'bg-risk-high-bg text-risk-high',
  critical: 'bg-risk-critical-bg text-risk-critical',
};

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export default function RiskBadge({ level, className = '' }: RiskBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${riskClasses[level]} ${className}`}
    >
      {riskLabel[level]}
    </span>
  );
}