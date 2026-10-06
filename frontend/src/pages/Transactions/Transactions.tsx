import { useMemo, useState } from "react";
import TransactionDetails from "../../components/transactions/TransactionDetails";
import TransactionFilters from "../../components/transactions/TransactionFilters";
import TransactionTable from "../../components/transactions/TransactionTable";
import { mockTransactions } from "../../mocks/transactions";
import type {
  Transaction,
  TransactionRiskLevel,
  TransactionStatus,
} from "../../types/transactions";

function Transactions() {
  const [search, setSearch] = useState("");
  const [riskLevel, setRiskLevel] =
    useState<TransactionRiskLevel | "all">("all");
  const [status, setStatus] =
    useState<TransactionStatus | "all">("all");

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return mockTransactions.filter((transaction) => {
      const matchesSearch =
        normalizedSearch === "" ||
        transaction.txId.toLowerCase().includes(normalizedSearch);

      const matchesRisk =
        riskLevel === "all" ||
        transaction.riskLevel === riskLevel;

      const matchesStatus =
        status === "all" ||
        transaction.status === status;

      return matchesSearch && matchesRisk && matchesStatus;
    });
  }, [search, riskLevel, status]);

  const clearFilters = () => {
    setSearch("");
    setRiskLevel("all");
    setStatus("all");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-text-primary">
          Transactions
        </h1>

        <p className="mt-1 text-sm text-text-secondary">
          Monitor Bitcoin transactions and transaction risk.
        </p>
      </header>

      {selectedTransaction && (
        <TransactionDetails
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Transaction Activity
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Review monitored transactions and their associated risk
            levels.
          </p>
        </div>

        <TransactionFilters
          search={search}
          riskLevel={riskLevel}
          status={status}
          onSearchChange={setSearch}
          onRiskLevelChange={setRiskLevel}
          onStatusChange={setStatus}
          onClear={clearFilters}
        />

        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            Showing{" "}
            <span className="font-medium text-text-primary">
              {filteredTransactions.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-text-primary">
              {mockTransactions.length}
            </span>{" "}
            transactions
          </p>
        </div>

        {filteredTransactions.length > 0 ? (
          <TransactionTable
            transactions={filteredTransactions}
            onTransactionClick={setSelectedTransaction}
          />
        ) : (
          <div className="rounded-xl border border-border-subtle bg-background-card px-6 py-12 text-center">
            <p className="text-sm font-medium text-text-primary">
              No transactions found
            </p>

            <p className="mt-1 text-sm text-text-secondary">
              Try adjusting your search or filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 text-sm font-medium text-brand-teal hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default Transactions;