import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Plus, Search, X, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { getWallets, createWallet } from '../../services/wallets';
import type { MonitoredWallet } from '../../types/wallets';
import StateView from '../../components/dashboard/StateView';

export default function WalletsPage() {
  const [wallets, setWallets] = useState<MonitoredWallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [label, setLabel] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const fetchWallets = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await getWallets();
      setWallets(data);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const filteredWallets = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return wallets;
    return wallets.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.address.toLowerCase().includes(q) ||
        (w.label && w.label.toLowerCase().includes(q))
    );
  }, [wallets, search]);

  const handleCreateWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) {
      setFormError('Wallet name and Bitcoin address are required.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const created = await createWallet({
        name: name.trim(),
        address: address.trim(),
        label: label.trim() || undefined,
      });
      setWallets((prev) => [created, ...prev]);
      setFormSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setName('');
        setAddress('');
        setLabel('');
        setFormSuccess(false);
      }, 1000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to register wallet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <header>
          <h1 className="text-2xl font-semibold text-text-primary">
            Monitored Wallets
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Register and monitor platform-tracked Bitcoin wallets, OTC desks, and treasury accounts.
          </p>
        </header>

        <button
          type="button"
          onClick={() => {
            setFormError('');
            setFormSuccess(false);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
        >
          <Plus size={16} />
          Add Wallet
        </button>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-border-subtle bg-background-card p-4 text-xs text-text-secondary">
        <ShieldCheck size={18} className="text-brand-teal shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-text-primary">
            Internal Custody & Treasury Accounts
          </p>
          <p className="mt-0.5 leading-relaxed">
            Wallets registered here represent your organization's own cold storage, OTC accounts, and operational treasury. To investigate external counterparty blockchain addresses, use{" "}
            <Link to="/addresses" className="text-brand-orange hover:underline font-medium">
              Addresses
            </Link>.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search wallets by name, address, or label..."
            className="w-full rounded-lg border border-border-subtle bg-background-card py-2.5 pl-9 pr-4 text-sm text-text-primary outline-none focus:border-brand-teal"
          />
        </div>
      </div>

      {isLoading || isError ? (
        <div className="rounded-xl border border-border-subtle bg-background-card p-6">
          <StateView isLoading={isLoading} isError={isError} onRetry={fetchWallets} />
        </div>
      ) : filteredWallets.length === 0 ? (
        <div className="rounded-xl border border-border-subtle bg-background-card px-6 py-12 text-center">
          <Wallet className="mx-auto mb-3 h-10 w-10 text-text-muted" />
          <p className="text-base font-medium text-text-primary">No monitored wallets found</p>
          <p className="mt-1 text-sm text-text-secondary">
            {search ? 'Try adjusting your search criteria.' : 'Register a wallet to start tracking its activity.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border-subtle bg-background-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border-subtle bg-background/50 text-xs uppercase text-text-muted">
              <tr>
                <th className="py-3 px-4 font-medium">Wallet Name</th>
                <th className="py-3 px-4 font-medium">Bitcoin Address</th>
                <th className="py-3 px-4 font-medium">Category / Label</th>
                <th className="py-3 px-4 font-medium">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredWallets.map((w) => (
                <tr key={w.id} className="transition-colors hover:bg-background-hover">
                  <td className="py-3.5 px-4 font-medium text-text-primary flex items-center gap-2">
                    <Wallet size={16} className="text-brand-orange shrink-0" />
                    <span>{w.name}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-brand-teal">
                    {w.address}
                  </td>
                  <td className="py-3.5 px-4">
                    {w.label ? (
                      <span className="rounded-full bg-brand-teal/10 px-2.5 py-1 text-xs font-medium text-brand-teal">
                        {w.label}
                      </span>
                    ) : (
                      <span className="text-text-muted text-xs">None</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-text-secondary">
                    {w.created_at ? new Date(w.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Wallet Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border-subtle bg-background-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-subtle p-5">
              <h2 className="text-base font-semibold text-text-primary">Register Monitored Wallet</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-text-secondary hover:bg-background-hover hover:text-text-primary"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateWallet} className="space-y-4 p-5">
              {formSuccess && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-xs font-medium text-emerald-400">
                  <CheckCircle2 size={16} />
                  Wallet registered successfully!
                </div>
              )}

              {formError && (
                <div className="rounded-lg bg-risk-critical/10 p-3 text-xs text-risk-critical">
                  {formError}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                  Wallet Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cold Storage Vault #1"
                  className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                  Bitcoin Address *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. bc1q..."
                  className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-teal font-mono text-xs"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                  Category / Classification Label
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Treasury, OTC Counterparty, Exchange"
                  className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-teal"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-border-subtle pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-lg border border-border-subtle px-4 py-2 text-xs font-medium text-text-primary hover:bg-background-hover"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || formSuccess}
                  className="flex items-center gap-1.5 rounded-lg bg-brand-orange px-4 py-2 text-xs font-semibold text-black hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Registering...
                    </>
                  ) : (
                    'Register Wallet'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
