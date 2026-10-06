import type { BitcoinAddress } from "../../types/addresses";

type AddressDetailsProps = {
  address: BitcoinAddress;
  onClose: () => void;
};

function AddressDetails({
  address,
  onClose,
}: AddressDetailsProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-text-secondary">
            Bitcoin Address
          </p>

          <h2 className="mt-1 break-all font-mono text-lg font-semibold text-text-primary">
            {address.address}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
        >
          Close
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-text-secondary">
            Balance
          </p>

          <p className="mt-1 text-lg font-semibold text-text-primary">
            {address.balance} BTC
          </p>
        </div>

        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-text-secondary">
            Transactions
          </p>

          <p className="mt-1 text-lg font-semibold text-text-primary">
            {address.transactionCount}
          </p>
        </div>

        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-text-secondary">
            Risk Level
          </p>

          <p className="mt-1 text-lg font-semibold capitalize text-text-primary">
            {address.risk}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 border-t border-border pt-6 md:grid-cols-2">
        <div>
          <p className="text-sm text-text-secondary">
            First Seen
          </p>

          <p className="mt-1 text-sm text-text-primary">
            {address.firstSeen}
          </p>
        </div>

        <div>
          <p className="text-sm text-text-secondary">
            Last Activity
          </p>

          <p className="mt-1 text-sm text-text-primary">
            {address.lastActivity}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AddressDetails;