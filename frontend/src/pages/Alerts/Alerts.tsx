import { useState } from "react";
import { useAlerts, useUpdateAlertStatus } from "../../hooks/useAlerts";
import StateView from "../../components/dashboard/StateView";
import RiskBadge from "../../components/ui/RiskBadge";
import type { AlertStatus } from "../../types/dashboard";

const statusLabels: Record<AlertStatus, string> = {
  new: "New",
  in_review: "In Review",
  escalated: "Escalated",
  cleared: "Cleared",
};

const statusClasses: Record<AlertStatus, string> = {
  new: "bg-blue-500/10 text-blue-400",
  in_review: "bg-yellow-500/10 text-yellow-400",
  escalated: "bg-orange-500/10 text-orange-400",
  cleared: "bg-green-500/10 text-green-400",
};

function Alerts() {
  const { data: alerts = [], isLoading, isError, refetch } = useAlerts();
  const updateStatusMutation = useUpdateAlertStatus();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AlertStatus>(
    "all"
  );

const [riskFilter, setRiskFilter] = useState<
  "all" | "low" | "medium" | "high" | "critical"
>("all");

const [selectedAlertId, setSelectedAlertId] = useState<string | null>(
  null
);

  const totalAlerts = alerts.length;

  const newAlerts = alerts.filter(
    (alert) => alert.status === "new"
  ).length;

  const inReviewAlerts = alerts.filter(
    (alert) => alert.status === "in_review"
  ).length;

  const escalatedAlerts = alerts.filter(
    (alert) => alert.status === "escalated"
  ).length;

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.indicator.toLowerCase().includes(searchTerm.toLowerCase());

   const matchesStatus =
  statusFilter === "all" || alert.status === statusFilter;

const matchesRisk =
  riskFilter === "all" || alert.riskLevel === riskFilter;

return matchesSearch && matchesStatus && matchesRisk;
  });

const selectedAlert = alerts.find(
  (alert) => alert.id === selectedAlertId
);

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">
        Alerts
      </h1>

      <p className="mt-2 text-text-secondary">
        Monitor and investigate suspicious activity alerts.
      </p>

      {/* Alert summary */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border-subtle bg-background-card p-4">
          <p className="text-sm text-text-secondary">Total Alerts</p>
          <p className="mt-2 text-2xl font-semibold text-text-primary">
            {totalAlerts}
          </p>
        </div>

        <div className="rounded-lg border border-border-subtle bg-background-card p-4">
          <p className="text-sm text-text-secondary">New</p>
          <p className="mt-2 text-2xl font-semibold text-text-primary">
            {newAlerts}
          </p>
        </div>

        <div className="rounded-lg border border-border-subtle bg-background-card p-4">
          <p className="text-sm text-text-secondary">In Review</p>
          <p className="mt-2 text-2xl font-semibold text-text-primary">
            {inReviewAlerts}
          </p>
        </div>

        <div className="rounded-lg border border-border-subtle bg-background-card p-4">
          <p className="text-sm text-text-secondary">Escalated</p>
          <p className="mt-2 text-2xl font-semibold text-text-primary">
            {escalatedAlerts}
          </p>
        </div>
      </div>

      {/* Search and filter */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search alerts..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-lg border border-border-subtle bg-background-card px-4 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-brand-orange sm:flex-1"
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as "all" | AlertStatus
            )
          }
          className="rounded-lg border border-border-subtle bg-background-card px-4 py-2.5 text-sm text-text-primary outline-none focus:border-brand-orange"
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="in_review">In Review</option>
          <option value="escalated">Escalated</option>
          <option value="cleared">Cleared</option>
        </select>

<select
  value={riskFilter}
  onChange={(event) =>
    setRiskFilter(
      event.target.value as
        | "all"
        | "low"
        | "medium"
        | "high"
        | "critical"
    )
  }
  className="rounded-lg border border-border-subtle bg-background-card px-4 py-2.5 text-sm text-text-primary outline-none focus:border-brand-orange"
>
  <option value="all">All risk levels</option>
  <option value="low">Low</option>
  <option value="medium">Medium</option>
  <option value="high">High</option>
  <option value="critical">Critical</option>
</select>
      </div>

      {/* Alert list */}
      {/* Alert table */}
      {isLoading || isError ? (
        <div className="mt-6 rounded-lg border border-border-subtle bg-background-card p-6">
          <StateView isLoading={isLoading} isError={isError} onRetry={refetch} />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-border-subtle bg-background-card">
  <div className="overflow-x-auto">
    <table className="w-full text-left text-sm">
      <thead className="border-b border-border-subtle bg-background-hover">
        <tr>
          <th className="px-4 py-3 font-medium text-text-secondary">
            Alert ID
          </th>

          <th className="px-4 py-3 font-medium text-text-secondary">
            Risk
          </th>

          <th className="px-4 py-3 font-medium text-text-secondary">
            Indicator
          </th>

          <th className="px-4 py-3 font-medium text-text-secondary">
            Status
          </th>

          <th className="px-4 py-3 font-medium text-text-secondary">
            Created
          </th>

          <th className="px-4 py-3 font-medium text-text-secondary">
            Action
          </th>
        </tr>
      </thead>

      <tbody>
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <tr
              key={alert.id}
              className="border-b border-border-subtle last:border-b-0 hover:bg-background-hover"
            >
              <td className="px-4 py-4 font-medium text-text-primary">
                {alert.id}
              </td>

              <td className="px-4 py-4">
                <RiskBadge level={alert.riskLevel} />
              </td>

              <td className="px-4 py-4 text-text-secondary">
                {alert.indicator}
              </td>

              <td className="px-4 py-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[alert.status]}`}
                >
                  {statusLabels[alert.status]}
                </span>
              </td>

              <td className="px-4 py-4 text-text-secondary">
                {new Date(alert.createdAt).toLocaleString()}
              </td>

              <td className="px-4 py-4">
                <button
  type="button"
  onClick={() => setSelectedAlertId(alert.id)}
  className="font-medium text-brand-orange hover:underline"
>
  View
</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={6}
              className="px-4 py-10 text-center text-text-secondary"
            >
              No alerts found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
)}

{/* Selected alert details modal */}
{selectedAlert && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
    <div
      className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border-subtle bg-background-card p-6 shadow-xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-details-title"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-muted">Alert Details</p>

          <h2
            id="alert-details-title"
            className="mt-1 text-xl font-semibold text-text-primary"
          >
            {selectedAlert.id}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setSelectedAlertId(null)}
          className="text-sm text-text-secondary hover:text-text-primary"
        >
          Close
        </button>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-sm text-text-muted">Risk Level</p>

          <div className="mt-1">
            <RiskBadge level={selectedAlert.riskLevel} />
          </div>
        </div>

        <div>
          <p className="text-sm text-text-muted">Status</p>

          <span
            className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[selectedAlert.status]}`}
          >
            {statusLabels[selectedAlert.status]}
          </span>
        </div>

        <div>
          <p className="text-sm text-text-muted">Indicator</p>

          <p className="mt-1 text-text-primary">
            {selectedAlert.indicator}
          </p>
        </div>

        <div>
          <p className="text-sm text-text-muted">Created</p>

          <p className="mt-1 text-text-secondary">
            {new Date(selectedAlert.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="col-span-full mt-4 border-t border-border-subtle pt-4">
          <p className="text-sm font-medium text-text-muted">Change Status</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(['new', 'in_review', 'escalated', 'cleared'] as AlertStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                disabled={selectedAlert.status === s || updateStatusMutation.isPending}
                onClick={() => {
                  updateStatusMutation.mutate({ id: selectedAlert.id, status: s });
                  setSelectedAlertId(null);
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${
                  selectedAlert.status === s
                    ? 'border-transparent bg-background-elevated text-text-muted opacity-50 cursor-default'
                    : 'border-border-subtle bg-background-hover text-text-primary hover:border-border-strong'
                }`}
              >
                {statusLabels[s]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)}    </div>
  );
}

export default Alerts;
