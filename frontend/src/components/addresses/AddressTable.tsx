import type { BitcoinAddress } from "../../types/addresses";
import RiskBadge from "../ui/RiskBadge";

type AddressTableProps = {
  addresses: BitcoinAddress[];
  onSelectAddress: (address: BitcoinAddress) => void;
};

function AddressTable({
  addresses,
  onSelectAddress,
}: AddressTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-subtle bg-background-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-border-subtle bg-background-hover">
            <tr>
              <th className="px-6 py-4 text-xs font-medium text-text-secondary uppercase">
                Address
              </th>
              <th className="px-6 py-4 text-xs font-medium text-text-secondary uppercase">
                Network
              </th>
              <th className="px-6 py-4 text-xs font-medium text-text-secondary uppercase">
                Balance
              </th>
              <th className="px-6 py-4 text-xs font-medium text-text-secondary uppercase">
                Transactions
              </th>
              <th className="px-6 py-4 text-xs font-medium text-text-secondary uppercase">
                Risk
              </th>
              <th className="px-6 py-4 text-xs font-medium text-text-secondary uppercase">
                Last Activity
              </th>
              <th className="px-6 py-4 text-xs font-medium text-text-secondary uppercase">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-subtle">
            {addresses.map((address) => (
              <tr
                key={address.id}
                onClick={() => onSelectAddress(address)}
                className="cursor-pointer transition-colors hover:bg-background-hover"
              >
                <td className="px-6 py-4">
                  <span className="font-mono text-sm font-medium text-text-primary">
                    {address.address}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-text-secondary capitalize">
                  {address.network}
                </td>

                <td className="px-6 py-4 text-sm font-medium text-text-primary">
                  {address.balance} BTC
                </td>

                <td className="px-6 py-4 text-sm text-text-secondary">
                  {address.transactionCount}
                </td>

                <td className="px-6 py-4">
                  <RiskBadge level={address.risk} />
                </td>

                <td className="px-6 py-4 text-sm text-text-secondary">
                  {new Date(address.lastActivity).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 text-sm">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAddress(address);
                    }}
                    className="font-medium text-brand-orange hover:underline text-xs"
                  >
                    Investigate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AddressTable;