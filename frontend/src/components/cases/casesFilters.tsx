import type { CaseStatus } from '../../types/cases';
import { statusLabel } from './caseUtils';

interface CasesFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: CaseStatus | 'all';
  onStatusChange: (value: CaseStatus | 'all') => void;
}

export default function CasesFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: CasesFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        type="text"
        placeholder="Search cases…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-md border border-border-subtle bg-background-card px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-teal focus:outline-none sm:w-64"
      />
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as CaseStatus | 'all')}
        className="rounded-md border border-border-subtle bg-background-card px-3 py-2 text-sm text-text-primary focus:border-brand-teal focus:outline-none"
      >
        <option value="all">All statuses</option>
        {(['open', 'in_review', 'escalated', 'closed'] as CaseStatus[]).map((s) => (
          <option key={s} value={s}>
            {statusLabel[s]}
          </option>
        ))}
      </select>
    </div>
  );
}