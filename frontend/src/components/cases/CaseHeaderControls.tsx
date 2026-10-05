import { useCase } from '../../hooks/useCases';
import { useCaseStore } from '../../stores/caseStore';
import type { CaseStatus } from '../../types/cases';
import { statusLabel } from './caseUtils';

interface CaseHeaderControlsProps {
  caseId: string;
}

const ANALYSTS = ['A. Kimani', 'J. Otieno', 'M. Wanjiru', 'Unassigned'];

export default function CaseHeaderControls({ caseId }: CaseHeaderControlsProps) {
  const { data } = useCase(caseId);
  const override = useCaseStore((s) => s.overrides[caseId] ?? {});
  const setStatus = useCaseStore((s) => s.setStatus);
  const assignTo = useCaseStore((s) => s.assignTo);

  const status: CaseStatus = override.status ?? data?.status ?? 'open';
  const assignedTo = override.assignedTo ?? data?.assignedTo ?? null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div>
        <label className="mb-1 block text-xs font-medium text-text-muted">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(caseId, e.target.value as CaseStatus)}
          className="rounded-md border border-border-subtle bg-background-card px-3 py-2 text-sm text-text-primary focus:border-brand-teal focus:outline-none"
        >
          {(['open', 'under_investigation', 'escalated', 'resolved', 'closed'] as CaseStatus[]).map(
            (s) => (
              <option key={s} value={s}>
                {statusLabel[s]}
              </option>
            ),
          )}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-text-muted">Assigned to</label>
        <select
          value={assignedTo ?? 'Unassigned'}
          onChange={(e) =>
            assignTo(caseId, e.target.value === 'Unassigned' ? null : e.target.value)
          }
          className="rounded-md border border-border-subtle bg-background-card px-3 py-2 text-sm text-text-primary focus:border-brand-teal focus:outline-none"
        >
          {ANALYSTS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}