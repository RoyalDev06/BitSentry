import type { BitcoinAddress } from "../../types/addresses";

type AddressTableProps = {
  addresses: BitcoinAddress[];
  onSelectAddress: (address: BitcoinAddress) => void;
};

function AddressTable({
  addresses,
  onSelectAddress,
}: AddressTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-border bg-surface-secondary">
            <tr>
              <th className="px-6 py-4 text-sm font-medium text-text-secondary">
                Address
              </th>
              <th className="px-6 py-4 text-sm font-medium text-text-secondary">
                Network
              </th>
              <th className="px-6 py-4 text-sm font-medium text-text-secondary">
                Balance
              </th>
              <th className="px-6 py-4 text-sm font-medium text-text-secondary">
                Transactions
              </th>
              <th className="px-6 py-4 text-sm font-medium text-text-secondary">
                Risk
              </th>
              <th className="px-6 py-4 text-sm font-medium text-text-secondary">
                Last Activity
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {addresses.map((address) => (
              <tr
                key={address.id}
                onClick={() => onSelectAddress(address)}
                className="cursor-pointer transition-colors hover:bg-surface-secondary"
              >
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-text-primary">
                    {address.address}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-text-secondary">
                  {address.network}
                </td>

                <td className="px-6 py-4 text-sm text-text-primary">
                  {address.balance} BTC
                </td>

                <td className="px-6 py-4 text-sm text-text-secondary">
                  {address.transactionCount}
                </td>

                <td className="px-6 py-4">
                  <RiskBadge risk={address.risk} />
                </td>

                <td className="px-6 py-4 text-sm text-text-secondary">
                  {address.lastActivity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type RiskBadgeProps = {
  risk: BitcoinAddress["risk"];
};

function RiskBadge({ risk }: RiskBadgeProps) {
  const styles = {
    low: "bg-risk-low/10 text-risk-low",
    medium: "bg-risk-medium/10 text-risk-medium",
    high: "bg-risk-high/10 text-risk-high",
    critical: "bg-risk-critical/10 text-risk-critical",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${styles[risk]}`}
    >
      {risk}
    </span>
  );
}

export default AddressTable;