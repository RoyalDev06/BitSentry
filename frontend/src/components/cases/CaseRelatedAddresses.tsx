import { Link } from 'react-router-dom';
import type { RelatedAddress } from '../../types/cases';
import RiskBadge from '../ui/RiskBadge';

interface CaseRelatedAddressesProps {
  addresses: RelatedAddress[];
}

export default function CaseRelatedAddresses({ addresses }: CaseRelatedAddressesProps) {
  if (addresses.length === 0) {
    return (
      <p className="py-4 text-sm text-text-muted">No related addresses on this case.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {addresses.map((a) => (
        <Link
          key={a.address}
          to="/addresses"
          className="block rounded-lg border border-border-subtle bg-background-hover p-4 transition-colors hover:border-brand-teal"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-text-secondary">
              {a.label ?? 'Unlabeled'}
            </span>
            <RiskBadge level={a.riskLevel} />
          </div>
          <p className="mt-2 truncate font-mono text-xs text-text-primary" title={a.address}>
            {a.address}
          </p>
          <p className="mt-1 text-xs text-text-muted">
            {a.txCount} {a.txCount === 1 ? 'transaction' : 'transactions'}
          </p>
        </Link>
      ))}
    </div>
  );
}