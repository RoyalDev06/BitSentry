import { useState } from "react";
import {
  User,
  Shield,
  Server,
  LogOut,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Cpu,
} from "lucide-react";
import { useCurrentUser, useBitcoinStatus } from "../../hooks/useCurrentUser";
import { logout } from "../../services/auth";
import StateView from "../../components/dashboard/StateView";

export default function Settings() {
  const { data: user, isLoading: isUserLoading, isError: isUserError, refetch: refetchUser } = useCurrentUser();
  const { data: btcStatus, isLoading: isBtcLoading, refetch: refetchBtc } = useBitcoinStatus();

  const [copiedToken, setCopiedToken] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
  const useMocks = import.meta.env.VITE_USE_MOCKS !== "false";

  const handleCopyToken = () => {
    const token = localStorage.getItem("bitsentry_token");
    if (token) {
      navigator.clipboard.writeText(token);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings & System</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Manage your analyst profile, inspect Bitcoin node status, and review system configuration.
        </p>
      </div>

      {isUserLoading || isUserError ? (
        <div className="rounded-xl border border-border-subtle bg-background-card p-6">
          <StateView isLoading={isUserLoading} isError={isUserError} onRetry={refetchUser} />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* 1. Analyst Profile Card */}
          <div className="rounded-xl border border-border-subtle bg-background-card p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-border-subtle pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-text-primary">Analyst Profile</h2>
                <p className="text-xs text-text-secondary">Logged in via BitSentry RBAC</p>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-sm">
              <div>
                <span className="text-xs font-medium text-text-muted">Full Name</span>
                <p className="font-medium text-text-primary">{user?.full_name || "N/A"}</p>
              </div>

              <div>
                <span className="text-xs font-medium text-text-muted">Email Address</span>
                <p className="font-medium text-text-primary">{user?.email || "N/A"}</p>
              </div>

              <div>
                <span className="text-xs font-medium text-text-muted">Assigned Roles</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {user?.roles?.map((r) => (
                    <span
                      key={r}
                      className="inline-flex items-center gap-1 rounded-md bg-brand-teal/10 px-2.5 py-1 text-xs font-medium text-brand-teal"
                    >
                      <Shield size={12} />
                      {r.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-text-muted">Account Status</span>
                <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                  <CheckCircle2 size={14} />
                  <span>Active & Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Bitcoin Node Connection Card */}
          <div className="rounded-xl border border-border-subtle bg-background-card p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                  <Cpu size={20} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-text-primary">Bitcoin RPC Node</h2>
                  <p className="text-xs text-text-secondary">Blockchain Ingestion Status</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => refetchBtc()}
                disabled={isBtcLoading}
                className="rounded-lg p-1.5 text-text-secondary hover:bg-background-hover hover:text-text-primary"
                title="Refresh Node Status"
              >
                <RefreshCw size={16} className={isBtcLoading ? "animate-spin" : ""} />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-muted">Connection</span>
                {btcStatus?.connected ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                    <CheckCircle2 size={12} />
                    Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                    <AlertCircle size={12} />
                    Standalone / Dev Mode
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-muted">Network</span>
                <span className="font-mono text-xs text-text-primary uppercase">
                  {btcStatus?.network || "regtest"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-muted">Synced Block Height</span>
                <span className="font-mono text-xs font-medium text-text-primary">
                  {btcStatus?.blocks?.toLocaleString() ?? "840,103"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-muted">Verification Progress</span>
                <span className="font-mono text-xs text-text-secondary">
                  {btcStatus?.verification_progress
                    ? `${(btcStatus.verification_progress * 100).toFixed(1)}%`
                    : "100.0%"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. System & API Configuration */}
      <div className="rounded-xl border border-border-subtle bg-background-card p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-border-subtle pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <Server size={20} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-text-primary">System & API Configuration</h2>
            <p className="text-xs text-text-secondary">Environment integration parameters</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 text-sm">
          <div className="rounded-lg border border-border-subtle/60 bg-background p-4">
            <span className="text-xs font-medium text-text-muted">API Gateway URL</span>
            <p className="mt-1 font-mono text-xs text-brand-teal truncate">{apiBaseUrl}</p>
          </div>

          <div className="rounded-lg border border-border-subtle/60 bg-background p-4">
            <span className="text-xs font-medium text-text-muted">Data Layer Mode</span>
            <p className="mt-1 text-xs font-medium text-text-primary">
              {useMocks ? (
                <span className="text-amber-400">Mock Data (VITE_USE_MOCKS=true)</span>
              ) : (
                <span className="text-emerald-400">Live FastAPI Database (VITE_USE_MOCKS=false)</span>
              )}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-5">
          <div>
            <p className="text-sm font-medium text-text-primary">Developer Session Token</p>
            <p className="text-xs text-text-muted">Access token used for authenticated requests</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyToken}
              className="rounded-lg border border-border-subtle bg-background-hover px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-border-strong"
            >
              {copiedToken ? "Copied!" : "Copy JWT Token"}
            </button>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg bg-risk-critical/10 px-3 py-1.5 text-xs font-medium text-risk-critical transition-colors hover:bg-risk-critical/20"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
