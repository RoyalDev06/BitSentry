import type { AddressRisk } from "../../types/addresses";

type AddressFiltersProps = {
  search: string;
  risk: AddressRisk | "all";
  onSearchChange: (value: string) => void;
  onRiskChange: (value: AddressRisk | "all") => void;
};

function AddressFilters({
  search,
  risk,
  onSearchChange,
  onRiskChange,
}: AddressFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 md:flex-row">
      <input
        type="text"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search Bitcoin address..."
        className="flex-1 rounded-lg border border-border bg-surface-secondary px-4 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-secondary focus:border-accent"
      />

      <select
        value={risk}
        onChange={(event) =>
          onRiskChange(event.target.value as AddressRisk | "all")
        }
        className="rounded-lg border border-border bg-surface-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent"
      >
        <option value="all">All Risk Levels</option>
        <option value="low">Low Risk</option>
        <option value="medium">Medium Risk</option>
        <option value="high">High Risk</option>
        <option value="critical">Critical Risk</option>
      </select>
    </div>
  );
}

export default AddressFilters;
