import type { CasePriority, CaseStatus } from '../../types/cases';
import { statusLabel } from './caseUtils';

interface CasesFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  status: CaseStatus | 'all';
  onStatusChange: (v: CaseStatus | 'all') => void;
  priority: CasePriority | 'all';
  onPriorityChange: (v: CasePriority | 'all') => void;
  assignedTo: string | 'all';
  onAssignedToChange: (v: string | 'all') => void;
  analysts: string[];
}

export default function CasesFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  assignedTo,
  onAssignedToChange,
  analysts,
}: CasesFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <input
        type="text"
        placeholder="Search cases…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-md border border-border-subtle bg-background-card px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-teal focus:outline-none"
      />

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as CaseStatus | 'all')}
        className="rounded-md border border-border-subtle bg-background-card px-3 py-2 text-sm text-text-primary focus:border-brand-teal focus:outline-none"
      >
        <option value="all">All statuses</option>
        {(['open', 'under_investigation', 'escalated', 'resolved', 'closed'] as CaseStatus[]).map(
          (s) => (
            <option key={s} value={s}>
              {statusLabel[s]}
            </option>
          ),
        )}
      </select>

      <select
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value as CasePriority | 'all')}
        className="rounded-md border border-border-subtle bg-background-card px-3 py-2 text-sm text-text-primary focus:border-brand-teal focus:outline-none"
      >
        <option value="all">All risk levels</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>

      <select
        value={assignedTo}
        onChange={(e) => onAssignedToChange(e.target.value)}
        className="rounded-md border border-border-subtle bg-background-card px-3 py-2 text-sm text-text-primary focus:border-brand-teal focus:outline-none"
      >
        <option value="all">All analysts</option>
        <option value="unassigned">Unassigned</option>
        {analysts.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </div>
  );
}