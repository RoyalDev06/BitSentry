import AlertSummaryCard from '../../components/dashboard/AlertSummaryCard';
import RecentActivityCard from '../../components/dashboard/RecentActivityCard';
import RiskDistributionCard from '../../components/dashboard/RiskDistributionCard';
import SummaryCards from '../../components/dashboard/SummaryCards';
import ThemeToggle from '../../components/ui/ThemeToggle';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
       <header className="flex items-start justify-between gap-4">
  <div>
    <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>
    <p className="mt-1 text-sm text-text-secondary">
      Overview of monitored activity, risk and alerts.
    </p>
  </div>
  <ThemeToggle />
</header>

        <SummaryCards />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RiskDistributionCard />
          <AlertSummaryCard />
        </div>

        <RecentActivityCard />
      </div>
    </main>
  );
}