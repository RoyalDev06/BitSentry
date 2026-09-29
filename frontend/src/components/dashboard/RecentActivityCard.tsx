import { Link } from "react-router-dom";
import { useDashboardActivity } from "../../hooks/useDashboard";
import RiskBadge from "../ui/RiskBadge";
import SectionCard from "./SectionCard";
import StateView from "./StateView";
import { formatBtc, formatDateTime, truncateTxId } from "./dashboardUtils";

export default function RecentActivityCard() {
  const { data, isLoading, isError, refetch } = useDashboardActivity();
  const txs = data?.recentTransactions ?? [];
  const isEmpty = !isLoading && !isError && txs.length === 0;

  return (
    <SectionCard
      title="Recent Activity"
      action={
        <Link
          to="/transactions"
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
          emptyMessage="No recent activity."
          onRetry={refetch}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-xs uppercase text-text-muted">
                <th className="py-2 pr-4 font-medium">Transaction</th>
                <th className="py-2 pr-4 font-medium">Amount</th>
                <th className="py-2 pr-4 font-medium">Risk</th>
                <th className="py-2 pr-4 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {txs.map((t) => (
                <tr
                  key={t.id}
                  className="transition-colors hover:bg-background-hover"
                >
                  <td className="py-3 pr-4">
                    {/* TODO: link to detail route when it exists */}
                    <Link
                      to="/transactions"
                      className="font-mono text-xs text-brand-teal hover:underline"
                    >
                      {truncateTxId(t.txId)}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-text-secondary">
                    {formatBtc(t.amountBtc)}
                  </td>
                  <td className="py-3 pr-4">
                    <RiskBadge level={t.riskLevel} />
                  </td>
                  <td className="py-3 pr-4 text-text-muted">
                    {formatDateTime(t.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}
