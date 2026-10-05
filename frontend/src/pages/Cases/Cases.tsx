import { useMemo, useState } from 'react';
import type { CaseStatus } from '../../types/cases';
import { useCases } from '../../hooks/useCases';
import CasesFilters from '../../components/cases/casesFilters';
import CasesTable from '../../components/cases/casesTable';
import StateView from '../../components/dashboard/StateView';

export default function Cases() {
  const { data, isLoading, isError, refetch } = useCases();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<CaseStatus | 'all'>('all');

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.filter((c) => {
      const matchesStatus = status === 'all' || c.status === status;
      const matchesSearch =
        q === '' ||
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        (c.assignedTo ?? '').toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [data, search, status]);

  const isEmpty = !isLoading && !isError && filtered.length === 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Cases</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Investigations grouping related alerts.
          </p>
        </div>
      </header>

      <CasesFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
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