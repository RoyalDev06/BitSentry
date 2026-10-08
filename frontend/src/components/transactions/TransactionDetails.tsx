import { ArrowDown, ArrowUp, Copy, X } from "lucide-react";
import type { Transaction } from "../../types/transactions";
import RiskBadge from "../ui/RiskBadge";

interface TransactionDetailsProps {
  transaction: Transaction;
  onClose: () => void;
}

function formatAmount(amount: number) {
  return `${amount.toFixed(4)} BTC`;
}

function formatDateTime(timestamp: string) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

function riskScoreClass(score: number) {
  if (score >= 80) return "text-risk-high";
  if (score >= 50) return "text-brand-gold";
  return "text-risk-low";
}

const statusClasses: Record<Transaction["status"], string> = {
  confirmed: "bg-risk-low/10 text-risk-low",
  pending: "bg-brand-gold/10 text-brand-gold",
  flagged: "bg-risk-high/10 text-risk-high",
};

const statusLabels: Record<Transaction["status"], string> = {
  confirmed: "Confirmed",
  pending: "Pending",
  flagged: "Flagged",
};

export default function TransactionDetails({
  transaction,
  onClose,
}: TransactionDetailsProps) {
  const copyTransactionId = async () => {
    await navigator.clipboard.writeText(transaction.txId);
  };

  return (
    <div className="rounded-xl border border-border-subtle bg-background-card">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-border-subtle p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            Transaction Details
          </p>

          <h2 className="mt-1 font-mono text-sm font-semibold text-text-primary">
            {transaction.txId}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-background-hover hover:text-text-primary"
          aria-label="Close transaction details"
          title="Close"
        >
          <X size={18} />
        </button>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 gap-4 border-b border-border-subtle p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs text-text-muted">Amount</p>
          <p className="mt-1 font-semibold text-text-primary">
            {formatAmount(transaction.amountBtc)}
          </p>
        </div>

        <div>
          <p className="text-xs text-text-muted">Risk Level</p>
          <div className="mt-1">
            <RiskBadge level={transaction.riskLevel} />
          </div>
        </div>

        <div>
          <p className="text-xs text-text-muted">Risk Score</p>
          <p
            className={`mt-1 font-semibold ${riskScoreClass(
              transaction.riskScore,
            )}`}
          >
            {transaction.riskScore}/100
          </p>
        </div>

        <div>
          <p className="text-xs text-text-muted">Status</p>
          <span
            className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[transaction.status]}`}
          >
            {statusLabels[transaction.status]}
          </span>
        </div>
      </div>

      {/* Transaction flow */}
      <div className="border-b border-border-subtle p-5">
        <h3 className="text-sm font-semibold text-text-primary">
          Transaction Flow
        </h3>

        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-border-subtle bg-background p-4">
            <div className="flex items-center gap-2">
              <ArrowUp size={16} className="text-brand-orange" />
              <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                From Address
              </p>
            </div>

            <p className="mt-2 break-all font-mono text-xs text-text-secondary">
              {transaction.fromAddress}
            </p>
          </div>

          <div className="flex justify-center">
            <ArrowDown size={18} className="text-brand-teal" />
          </div>

          <div className="rounded-lg border border-border-subtle bg-background p-4">
            <div className="flex items-center gap-2">
              <ArrowDown size={16} className="text-brand-teal" />
              <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                To Address
              </p>
            </div>

            <p className="mt-2 break-all font-mono text-xs text-text-secondary">
              {transaction.toAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
        <div>
          <p className="text-xs text-text-muted">Transaction Record ID</p>
          <p className="mt-1 font-mono text-xs text-text-secondary">
            {transaction.id}
          </p>
        </div>

        <div>
          <p className="text-xs text-text-muted">Timestamp</p>
          <p className="mt-1 text-sm text-text-secondary">
            {formatDateTime(transaction.timestamp)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 border-t border-border-subtle p-5">
        <button
          type="button"
          onClick={copyTransactionId}
          className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-background-hover hover:text-brand-teal"
        >
          <Copy size={16} />
          Copy Transaction ID
        </button>
      </div>
    </div>
  );
}