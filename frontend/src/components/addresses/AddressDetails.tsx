import { useState } from "react";
import { Copy, Check, ShieldAlert, X, ExternalLink } from "lucide-react";
import type { BitcoinAddress } from "../../types/addresses";
import RiskBadge from "../ui/RiskBadge";
import { useUpdateAddress } from "../../hooks/useAddresses";

type AddressDetailsProps = {
  address: BitcoinAddress;
  onClose: () => void;
};

function AddressDetails({ address, onClose }: AddressDetailsProps) {
  const [copied, setCopied] = useState(false);
  const updateAddressMutation = useUpdateAddress();

  const isWatchlisted = address.risk === "high" || address.risk === "critical";

  const handleCopy = () => {
    navigator.clipboard.writeText(address.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleWatchlist = () => {
    updateAddressMutation.mutate({
      id: address.id,
      payload: { is_watchlisted: !isWatchlisted },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border-subtle bg-background-card p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="address-details-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border-subtle pb-4">
          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Bitcoin Address Investigation
            </p>

            <h2
              id="address-details-title"
              className="mt-1 break-all font-mono text-base font-semibold text-text-primary"
            >
              {address.address}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-secondary transition hover:bg-background-hover hover:text-text-primary"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action bar */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-background px-3 py-1.5 text-xs font-medium text-text-primary transition hover:bg-background-hover"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? "Copied!" : "Copy Address"}</span>
          </button>

          <button
            type="button"
            onClick={toggleWatchlist}
            disabled={updateAddressMutation.isPending}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
              isWatchlisted
                ? "border-risk-critical/30 bg-risk-critical/10 text-risk-critical hover:bg-risk-critical/20"
                : "border-border-subtle bg-background text-text-secondary hover:border-risk-critical hover:text-risk-critical"
            }`}
          >
            <ShieldAlert size={14} />
            <span>{isWatchlisted ? "Watchlisted Address" : "Add to Watchlist"}</span>
          </button>

          <a
            href={`https://mempool.space/address/${address.address}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-background px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:text-brand-teal"
          >
            <ExternalLink size={14} />
            <span>View on Mempool</span>
          </a>
        </div>

        {/* Metrics Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border-subtle bg-background p-4">
            <p className="text-xs font-medium text-text-muted">Current Balance</p>
            <p className="mt-1 text-lg font-semibold text-text-primary">
              {address.balance} BTC
            </p>
          </div>

          <div className="rounded-lg border border-border-subtle bg-background p-4">
            <p className="text-xs font-medium text-text-muted">Transaction Count</p>
            <p className="mt-1 text-lg font-semibold text-text-primary">
              {address.transactionCount}
            </p>
          </div>

          <div className="rounded-lg border border-border-subtle bg-background p-4">
            <p className="text-xs font-medium text-text-muted">Risk Assessment</p>
            <div className="mt-1">
              <RiskBadge level={address.risk} />
            </div>
          </div>
        </div>

        {/* Timeline Details */}
        <div className="mt-6 space-y-3 rounded-lg border border-border-subtle bg-background p-4 text-xs">
          <div className="flex justify-between">
            <span className="text-text-muted">Network</span>
            <span className="font-medium text-text-primary uppercase">{address.network}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-text-muted">First Activity Seen</span>
            <span className="font-mono text-text-secondary">
              {new Date(address.firstSeen).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-text-muted">Most Recent Activity</span>
            <span className="font-mono text-text-secondary">
              {new Date(address.lastActivity).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddressDetails;