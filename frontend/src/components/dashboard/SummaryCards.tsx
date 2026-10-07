import { AlertTriangle, FileSearch, ShieldAlert, Activity } from "lucide-react";
import { useDashboardSummary } from "../../hooks/useDashboard";
import { formatCount } from "./dashboardUtils";
import StateView from "./StateView";

export default function SummaryCards() {
  const { data, isLoading, isError, refetch } = useDashboardSummary();

  if (isLoading || isError || !data) {
    return (
      <div className="rounded-xl border border-border-subtle bg-background-card p-5">
        <StateView isLoading={isLoading} isError={isError} onRetry={refetch} />
      </div>
    );
  }

  const cards = [
    {
      label: "Transactions Monitored",
      value: formatCount(data.transactionsMonitored),
      Icon: Activity,
      tone: "text-brand-teal",
    },
    {
      label: "Active Alerts",
      value: formatCount(data.activeAlerts),
      Icon: AlertTriangle,
      tone: "text-brand-gold",
    },
    {
      label: "High / Critical Alerts",
      value: formatCount(data.highCriticalAlerts),
      Icon: ShieldAlert,
      tone: "text-risk-high",
    },
    {
      label: "Open Cases",
      value: formatCount(data.openCases),
      Icon: FileSearch,
      tone: "text-brand-orange",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ label, value, Icon, tone }) => (
        <div
          key={label}
          className="rounded-xl border border-border-subtle bg-background-card p-5"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-text-muted">{label}</p>
            <Icon className={`h-4 w-4 ${tone}`} />
          </div>
          <p className="mt-3 text-2xl font-semibold text-text-primary">
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}
