import type { Transaction } from "../../types/transactions";
import RiskBadge from "../ui/RiskBadge";

interface TransactionTableProps {
  transactions: Transaction[];
  onTransactionClick: (transaction: Transaction) => void;
}

const statusClasses: Record<Transaction["status"], string> = {
  confirmed:
    "bg-risk-low/10 text-risk-low",
  pending:
    "bg-brand-gold/10 text-brand-gold",
  flagged:
    "bg-risk-high/10 text-risk-high",
};

const statusLabels: Record<Transaction["status"], string> = {
  confirmed: "Confirmed",
  pending: "Pending",
  flagged: "Flagged",
};

function formatAmount(amount: number) {
  return `${amount.toFixed(4)} BTC`;
}

function formatDateTime(timestamp: string) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

function truncateTxId(txId: string) {
  if (txId.length <= 20) return txId;

  return `${txId.slice(0, 10)}...${txId.slice(-8)}`;
}

export default function TransactionTable({
  transactions,
  onTransactionClick,
}: TransactionTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border-subtle bg-background-card">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead>
          <tr className="border-b border-border-subtle text-xs uppercase tracking-wide text-text-muted">
            <th className="px-5 py-3 font-medium">Transaction ID</th>
            <th className="px-5 py-3 font-medium">Amount</th>
            <th className="px-5 py-3 font-medium">Risk Level</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Timestamp</th>
            <th className="px-5 py-3 text-right font-medium">Risk Score</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border-subtle">
          {transactions.map((transaction) => (
          <tr
  key={transaction.id}
  onClick={() => onTransactionClick(transaction)}
  className="cursor-pointer transition-colors hover:bg-background-hover"
>
              <td className="px-5 py-4">
                <span
                  className="font-mono text-xs text-brand-teal"
                  title={transaction.txId}
                >
                  {truncateTxId(transaction.txId)}
                </span>
              </td>

              <td className="whitespace-nowrap px-5 py-4 font-medium text-text-primary">
                {formatAmount(transaction.amountBtc)}
              </td>

              <td className="px-5 py-4">
                <RiskBadge level={transaction.riskLevel} />
              </td>

              <td className="px-5 py-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[transaction.status]}`}
                >
                  {statusLabels[transaction.status]}
                </span>
              </td>

              <td className="whitespace-nowrap px-5 py-4 text-text-secondary">
                {formatDateTime(transaction.timestamp)}
              </td>

              <td className="px-5 py-4 text-right">
                <span
                  className={
                    transaction.riskScore >= 80
                      ? "font-semibold text-risk-high"
                      : transaction.riskScore >= 50
                        ? "font-semibold text-brand-gold"
                        : "font-semibold text-risk-low"
                  }
                >
                  {transaction.riskScore}/100
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}