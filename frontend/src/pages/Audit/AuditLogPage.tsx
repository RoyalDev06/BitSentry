import { useEffect, useState, useMemo } from 'react';
import { History, Search, Filter, Shield } from 'lucide-react';
import { getAuditLogs } from '../../services/audit';
import type { AuditEntry } from '../../types/audit';
import StateView from '../../components/dashboard/StateView';

const actionColorMap: Record<string, string> = {
  USER_CREATED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  WALLET_CREATED: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  BLOCK_INGESTED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  ALERTS_GENERATED: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  CASE_CREATED: 'bg-red-500/10 text-red-400 border-red-500/20',
  USER_PASSWORD_CHANGED: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  CASE_STATUS_CHANGED: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  ALERT_STATUS_CHANGED: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
};

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const fetchLogs = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await getAuditLogs(200);
      setLogs(data);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const uniqueActions = useMemo(() => {
    const set = new Set(logs.map((l) => l.action));
    return ['ALL', ...Array.from(set)];
  }, [logs]);

  const filteredLogs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return logs.filter((l) => {
      const matchesSearch =
        !q ||
        l.action.toLowerCase().includes(q) ||
        l.target_type.toLowerCase().includes(q) ||
        String(l.actor_id).includes(q) ||
        (l.details && JSON.stringify(l.details).toLowerCase().includes(q));

      const matchesAction = actionFilter === 'ALL' || l.action === actionFilter;

      return matchesSearch && matchesAction;
    });
  }, [logs, search, actionFilter]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-text-primary">
          Compliance Audit Log
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Immutable historical trail of investigator actions, administrative events, and system detections.
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail by action, target, actor or metadata..."
            className="w-full rounded-lg border border-border-subtle bg-background-card py-2.5 pl-9 pr-4 text-sm text-text-primary outline-none focus:border-brand-teal"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-text-muted" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="rounded-lg border border-border-subtle bg-background-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-brand-teal"
          >
            {uniqueActions.map((action) => (
              <option key={action} value={action}>
                {action === 'ALL' ? 'All Action Types' : action.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading || isError ? (
        <div className="rounded-xl border border-border-subtle bg-background-card p-6">
          <StateView isLoading={isLoading} isError={isError} onRetry={fetchLogs} />
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="rounded-xl border border-border-subtle bg-background-card px-6 py-12 text-center">
          <History className="mx-auto mb-3 h-10 w-10 text-text-muted" />
          <p className="text-base font-medium text-text-primary">No audit records found</p>
          <p className="mt-1 text-sm text-text-secondary">
            {search || actionFilter !== 'ALL'
              ? 'Try adjusting your search filters.'
              : 'Audit events will appear here as investigators and system jobs perform actions.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border-subtle bg-background-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border-subtle bg-background/50 text-xs uppercase text-text-muted">
              <tr>
                <th className="py-3 px-4 font-medium">Timestamp</th>
                <th className="py-3 px-4 font-medium">Action Event</th>
                <th className="py-3 px-4 font-medium">Actor</th>
                <th className="py-3 px-4 font-medium">Target</th>
                <th className="py-3 px-4 font-medium">Event Details / Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle font-sans">
              {filteredLogs.map((entry) => {
                const badgeClass =
                  actionColorMap[entry.action] ||
                  'bg-gray-500/10 text-gray-400 border-gray-500/20';

                return (
                  <tr key={entry.id} className="transition-colors hover:bg-background-hover">
                    <td className="py-3.5 px-4 font-mono text-xs text-text-muted whitespace-nowrap">
                      {new Date(entry.created_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block rounded-md border px-2.5 py-1 font-mono text-xs font-semibold ${badgeClass}`}
                      >
                        {entry.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-text-primary whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Shield size={14} className="text-brand-teal" />
                        <span>User #{entry.actor_id}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-text-secondary whitespace-nowrap">
                      <span className="font-semibold text-text-primary uppercase text-[11px]">
                        {entry.target_type}
                      </span>{' '}
                      {entry.target_id !== null && entry.target_id !== undefined ? (
                        <span className="font-mono text-text-muted">#{entry.target_id}</span>
                      ) : null}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-text-muted max-w-xs truncate">
                      {entry.details && Object.keys(entry.details).length > 0 ? (
                        JSON.stringify(entry.details)
                      ) : (
                        <span className="text-text-muted/60">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
