import { useMemo, useState } from "react";
import AddressFilters from "../../components/addresses/AddressFilters";
import AddressTable from "../../components/addresses/AddressTable";
import { mockAddresses } from "../../mocks/addresses";
import type { AddressRisk, BitcoinAddress } from "../../types/addresses";
import AddressDetails from "../../components/addresses/AddressDetails";

function Addresses() {
  const [selectedAddress, setSelectedAddress] =
    useState<BitcoinAddress | null>(null);

  const [search, setSearch] = useState("");
  const [risk, setRisk] = useState<AddressRisk | "all">("all");

  const filteredAddresses = useMemo(() => {
    return mockAddresses.filter((address) => {
      const matchesSearch = address.address
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesRisk = risk === "all" || address.risk === risk;

      return matchesSearch && matchesRisk;
    });
  }, [search, risk]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Addresses
        </h1>

        <p className="mt-2 text-text-secondary">
          Investigate Bitcoin addresses and wallet activity.
        </p>
      </div>

      <AddressFilters
        search={search}
        risk={risk}
        onSearchChange={setSearch}
        onRiskChange={setRisk}
      />

      <AddressTable
        addresses={filteredAddresses}
        onSelectAddress={setSelectedAddress}
      />

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