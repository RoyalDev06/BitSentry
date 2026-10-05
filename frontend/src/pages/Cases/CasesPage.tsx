import { useMemo, useState } from 'react';
import type { CasePriority, CaseStatus } from '../../types/cases';
import { useCases } from '../../hooks/useCases';
import { useCaseStore, applyOverrides } from '../../stores/caseStore';
import CasesFilters from '../../components/cases/casesFilters';
import CasesTable from '../../components/cases/casesTable';
import StateView from '../../components/dashboard/StateView';

export default function Cases() {
  const { data, isLoading, isError, refetch } = useCases();
  const overrides = useCaseStore((s) => s.overrides);
  const extraNotes = useCaseStore((s) => s.extraNotes);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<CaseStatus | 'all'>('all');
  const [priority, setPriority] = useState<CasePriority | 'all'>('all');
  const [assignedTo, setAssignedTo] = useState<string | 'all'>('all');

 const merged = useMemo(
  () => (data ?? []).map((c) => applyOverrides(c, overrides, extraNotes)),
  [data, overrides, extraNotes],
);

  const analysts = useMemo(() => {
    const set = new Set<string>();
    merged.forEach((c) => {
      if (c.assignedTo) set.add(c.assignedTo);
    });
    return Array.from(set).sort();
  }, [merged]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return merged.filter((c) => {
      if (status !== 'all' && c.status !== status) return false;
      if (priority !== 'all' && c.priority !== priority) return false;
      if (assignedTo === 'unassigned' && c.assignedTo !== null) return false;
      if (assignedTo !== 'all' && assignedTo !== 'unassigned' && c.assignedTo !== assignedTo)
        return false;
      if (q === '') return true;
      return (
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        (c.assignedTo ?? '').toLowerCase().includes(q)
      );
    });
  }, [merged, search, status, priority, assignedTo]);

  const isEmpty = !isLoading && !isError && filtered.length === 0;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-text-primary">Cases</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Investigations grouping related alerts.
        </p>
      </header>

      <CasesFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        priority={priority}
        onPriorityChange={setPriority}
        assignedTo={assignedTo}
        onAssignedToChange={setAssignedTo}
        analysts={analysts}
      />

      <section className="rounded-xl border border-border-subtle bg-background-card">
        {isLoading || isError || isEmpty ? (
          <div className="p-5">
            <StateView
              isLoading={isLoading}
              isError={isError}
              isEmpty={isEmpty}
              emptyMessage="No cases match your filters."
              onRetry={refetch}
            />
          </div>
        ) : (
          <div className="p-5">
            <CasesTable cases={filtered} />
          </div>
        )}
      </section>
    </div>
  );
}