import { Link } from "react-router-dom";
import { useDashboardActivity } from "../../hooks/useDashboard";
import RiskBadge from "../ui/RiskBadge";
import SectionCard from "./SectionCard";
import StateView from "./StateView";
import { formatDateTime, statusClasses, statusLabel } from "./dashboardUtils";

export default function AlertSummaryCard() {
  const { data, isLoading, isError, refetch } = useDashboardActivity();
  const alerts = data?.recentAlerts ?? [];
  const isEmpty = !isLoading && !isError && alerts.length === 0;

  return (
    <SectionCard
      title="Recent Alerts"
      action={
        <Link
          to="/alerts"
          className="text-xs font-medium text-brand-teal hover:underline"
        >
          View all
        </Link>
      }
    >
      {isLoading || isError || isEmpty ? (
        <StateView
          isLoading={isLoading}
          isError={isError}
          isEmpty={isEmpty}
          emptyMessage="No alerts yet."
          onRetry={refetch}
        />
      ) : (
        <ul className="divide-y divide-border-subtle">
          {alerts.map((a) => (
            <li key={a.id}>
              {/* TODO: link to detail route when it exists */}
              <Link
                to="/alerts"
                className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-background-hover"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {a.indicator}
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {a.id} · {formatDateTime(a.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <RiskBadge level={a.riskLevel} />
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClasses[a.status]}`}
                  >
                    {statusLabel[a.status]}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
