import { useMemo, useState } from "react";
import AddressFilters from "../../components/addresses/AddressFilters";
import AddressTable from "../../components/addresses/AddressTable";
import AddressDetails from "../../components/addresses/AddressDetails";
import StateView from "../../components/dashboard/StateView";
import { useAddresses } from "../../hooks/useAddresses";
import type { AddressRisk, BitcoinAddress } from "../../types/addresses";

function Addresses() {
  const { data: addresses = [], isLoading, isError, refetch } = useAddresses();

  const [selectedAddress, setSelectedAddress] =
    useState<BitcoinAddress | null>(null);

  const [search, setSearch] = useState("");
  const [risk, setRisk] = useState<AddressRisk | "all">("all");

  const filteredAddresses = useMemo(() => {
    return addresses.filter((address) => {
      const matchesSearch = address.address
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesRisk = risk === "all" || address.risk === risk;

      return matchesSearch && matchesRisk;
    });
  }, [addresses, search, risk]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-text-primary">
          Addresses
        </h1>

        <p className="mt-1 text-sm text-text-secondary">
          Investigate Bitcoin addresses and wallet activity.
        </p>
      </header>

      <AddressFilters
        search={search}
        risk={risk}
        onSearchChange={setSearch}
        onRiskChange={setRisk}
      />

      {isLoading || isError ? (
        <div className="rounded-xl border border-border-subtle bg-background-card p-6">
          <StateView isLoading={isLoading} isError={isError} onRetry={refetch} />
        </div>
      ) : (
        <AddressTable
          addresses={filteredAddresses}
          onSelectAddress={setSelectedAddress}
        />
      )}

      {selectedAddress && (
        <AddressDetails
          address={selectedAddress}
          onClose={() => setSelectedAddress(null)}
        />
      )}
    </div>
  );
}

export default Addresses;