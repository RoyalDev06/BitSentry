import AlertSummaryCard from "../../components/dashboard/AlertSummaryCard";
import RecentActivityCard from "../../components/dashboard/RecentActivityCard";
import RiskDistributionCard from "../../components/dashboard/RiskDistributionCard";
import SummaryCards from "../../components/dashboard/SummaryCards";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-text-primary">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-text-secondary">
          Overview of monitored activity, risk and alerts.
        </p>
      </header>

      <SummaryCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RiskDistributionCard />
        <AlertSummaryCard />
      </div>

      <RecentActivityCard />
    </div>
  );
}
