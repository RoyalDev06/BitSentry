import { Search, X } from "lucide-react";
import type {
  TransactionRiskLevel,
  TransactionStatus,
} from "../../types/transactions";

interface TransactionFiltersProps {
  search: string;
  riskLevel: TransactionRiskLevel | "all";
  status: TransactionStatus | "all";
  onSearchChange: (value: string) => void;
  onRiskLevelChange: (
    value: TransactionRiskLevel | "all",
  ) => void;
  onStatusChange: (value: TransactionStatus | "all") => void;
  onClear: () => void;
}

export default function TransactionFilters({
  search,
  riskLevel,
  status,
  onSearchChange,
  onRiskLevelChange,
  onStatusChange,
  onClear,
}: TransactionFiltersProps) {
  const hasFilters =
    search !== "" || riskLevel !== "all" || status !== "all";

  return (
    <div className="rounded-xl border border-border-subtle bg-background-card p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search transaction ID..."
            className="w-full rounded-lg border border-border-subtle bg-background px-10 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-brand-teal"
          />
        </div>

        {/* Risk filter */}
        <select
          value={riskLevel}
          onChange={(event) =>
            onRiskLevelChange(
              event.target.value as TransactionRiskLevel | "all",
            )
          }
          className="rounded-lg border border-border-subtle bg-background px-3 py-2.5 text-sm text-text-primary outline-none focus:border-brand-teal"
        >
          <option value="all">All risk levels</option>
          <option value="low">Low risk</option>
          <option value="medium">Medium risk</option>
          <option value="high">High risk</option>
          <option value="critical">Critical risk</option>
        </select>

        {/* Status filter */}
        <select
          value={status}
          onChange={(event) =>
            onStatusChange(
              event.target.value as TransactionStatus | "all",
            )
          }
          className="rounded-lg border border-border-subtle bg-background px-3 py-2.5 text-sm text-text-primary outline-none focus:border-brand-teal"
        >
          <option value="all">All statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>

      {hasFilters && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-brand-teal"
          >
            <X size={14} />
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}