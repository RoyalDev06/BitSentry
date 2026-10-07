import { Link } from 'react-router-dom';
import type { RelatedTransaction } from '../../types/cases';
import RiskBadge from '../ui/RiskBadge';
import { formatBtc, formatDateTime, truncateTxId } from '../dashboard/dashboardUtils';

interface CaseRelatedTransactionsProps {
  transactions: RelatedTransaction[];
}

export default function CaseRelatedTransactions({ transactions }: CaseRelatedTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <p className="py-4 text-sm text-text-muted">No related transactions on this case.</p>
    );
  }

  return (
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
          {transactions.map((t) => (
            <tr key={t.id} className="transition-colors hover:bg-background-hover">
              <td className="py-3 pr-4">
                <Link
                  to="/transactions"
                  className="font-mono text-xs text-brand-teal hover:underline"
                >
                  {truncateTxId(t.txId)}
                </Link>
              </td>
              <td className="py-3 pr-4 text-text-secondary">{formatBtc(t.amountBtc)}</td>
              <td className="py-3 pr-4">
                <RiskBadge level={t.riskLevel} />
              </td>
              <td className="py-3 pr-4 text-text-muted">{formatDateTime(t.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}