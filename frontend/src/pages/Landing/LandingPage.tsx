import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
  Calendar,
  X,
  Mail,
  Building,
  User,
  ShieldCheck,
  Building2,
} from "lucide-react";
import BitSentryLogo from "../../components/ui/BitSentryLogo";
import ThemeToggle from "../../components/layout/ThemeToggle";
import { getAuthToken } from "../../services/api";

export default function LandingPage() {
  const [hasToken, setHasToken] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  // Demo form fields
  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("Compliance Lead");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setHasToken(Boolean(getAuthToken()));
  }, []);

  const handleDemoSubmit = (e: FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
  };

  const resetDemoForm = () => {
    setIsDemoModalOpen(false);
    setDemoSubmitted(false);
    setFullName("");
    setWorkEmail("");
    setOrganization("");
    setNotes("");
  };

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-brand-orange selection:text-black">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP NAVIGATION
          ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border-subtle bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo with proprietary BitSentry mark */}
          <Link to="/" className="flex items-center gap-3">
            <BitSentryLogo className="h-8 w-8" />
            <div>
              <span className="text-xl font-bold tracking-tight text-brand-orange">
                BitSentry
              </span>
              <span className="hidden text-xs text-text-muted sm:inline-block sm:ml-2 border-l border-border-subtle pl-2">
                AML Platform
              </span>
            </div>
          </Link>

          {/* Quick Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-secondary">
            <a href="#how-it-works" className="transition-colors hover:text-text-primary">
              How It Works
            </a>
            <a href="#rules" className="transition-colors hover:text-text-primary">
              What We Check
            </a>
            <a href="#tools" className="transition-colors hover:text-text-primary">
              Compliance Tools
            </a>
            <a href="#who-its-for" className="transition-colors hover:text-text-primary">
              Who It's For
            </a>
          </nav>

          {/* Actions & Theme Toggle */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setIsDemoModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-background-card px-3.5 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-background-hover cursor-pointer"
            >
              <Calendar size={15} className="text-brand-orange" />
              Book a Demo
            </button>

            {hasToken ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-black transition-transform hover:opacity-90 active:scale-95 shadow-sm"
              >
                Go to Dashboard
                <ArrowRight size={16} />
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-black transition-transform hover:opacity-90 active:scale-95 shadow-sm"
              >
                Sign In
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION
          ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-14 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle decorative glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-orange/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">

            {/* Main Headline */}
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl text-text-primary">
              Know what’s happening with every{" "}
              <span className="text-brand-orange">Bitcoin payment</span>.
            </h1>

            {/* Subtitle in plain English */}
            <p className="mt-5 text-base sm:text-lg text-text-secondary leading-relaxed">
              BitSentry monitors on-chain Bitcoin transactions, flags suspicious patterns
              before they become compliance headaches, and gives your team clear,
              explainable risk scores anyone can understand.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={hasToken ? "/dashboard" : "/login"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-7 py-3.5 text-base font-semibold text-black transition-all hover:opacity-95 hover:shadow-lg active:scale-95 shadow-md"
              >
                {hasToken ? "Go to Dashboard" : "Sign In to Portal"}
                <ArrowRight size={18} />
              </Link>

              <button
                type="button"
                onClick={() => setIsDemoModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border-subtle bg-background-card px-7 py-3.5 text-base font-medium text-text-primary transition-colors hover:bg-background-hover shadow-sm cursor-pointer"
              >
                <Calendar size={18} className="text-brand-orange" />
                Book a Demo
              </button>
            </div>

            {/* Internal Access Notice */}
            <p className="mt-4 text-xs text-text-muted">
              Note: System access is managed internally by your organization's administrator.
            </p>

            {/* Micro stats banner */}
            <div className="mt-12 grid grid-cols-2 gap-4 border-t border-border-subtle pt-8 sm:grid-cols-4 text-left">
              <div>
                <p className="text-2xl font-bold text-text-primary">0 to 100</p>
                <p className="text-xs text-text-secondary">Simple safety scale</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">7 Checks</p>
                <p className="text-xs text-text-secondary">Clear safety rules</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">100%</p>
                <p className="text-xs text-text-secondary">Explainable scoring</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">Full Audit</p>
                <p className="text-xs text-text-secondary">Compliance ready</p>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              3. PRODUCT PREVIEW BANNER (High-fidelity feature snapshot)
              ───────────────────────────────────────────────────────────── */}
          <div className="mt-16 sm:mt-20">
            <div className="relative mx-auto max-w-5xl rounded-2xl border border-border-subtle bg-background-card p-6 shadow-2xl sm:p-8">
              {/* Window controls bar */}
              <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-risk-critical" />
                  <span className="h-3 w-3 rounded-full bg-risk-medium" />
                  <span className="h-3 w-3 rounded-full bg-risk-low" />
                  <span className="ml-3 text-xs font-medium text-text-muted">
                    BitSentry Live Monitoring Console
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-brand-teal">
                  <span className="h-2 w-2 rounded-full bg-brand-teal animate-pulse" />
                  Real-time Node Connected
                </div>
              </div>

              {/* Grid preview of live monitoring components */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Metric 1 */}
                <div className="rounded-xl border border-border-subtle bg-background p-4">
                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <span>Scanned Block Height</span>
                    <Activity size={16} className="text-brand-orange" />
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-text-primary">#840,103</p>
                  <p className="mt-1 text-xs text-text-muted">
                    Continuous sync with Bitcoin tip
                  </p>
                </div>

                {/* Metric 2 */}
                <div className="rounded-xl border border-border-subtle bg-background p-4">
                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <span>Active Alerts</span>
                    <AlertTriangle size={16} className="text-risk-high" />
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-text-primary">4 Open</p>
                  <p className="mt-1 text-xs text-risk-high">
                    1 Critical whale transfer flagged
                  </p>
                </div>

                {/* Metric 3 */}
                <div className="rounded-xl border border-border-subtle bg-background p-4">
                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <span>Active Cases</span>
                    <FileText size={16} className="text-brand-teal" />
                  </div>
                  <p className="mt-2 text-2xl font-extrabold text-text-primary">2 In Progress</p>
                  <p className="mt-1 text-xs text-text-muted">
                    Assigned to compliance officers
                  </p>
                </div>
              </div>

              {/* Sample alert card snapshot */}
              <div className="mt-6 rounded-xl border border-border-subtle bg-background p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-risk-high-bg text-risk-high font-bold">
                      !
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-text-primary">
                          Alert #104: High Risk Peel Chain Detected
                        </span>
                        <span className="rounded bg-risk-high-bg px-2 py-0.5 text-xs font-semibold text-risk-high">
                          HIGH RISK (65/100)
                        </span>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5 font-mono">
                        TX: c3297fd77f63...820604337d15
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-text-muted">Detected 8 mins ago</span>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="rounded bg-background-card p-2.5 border border-border-subtle">
                    <span className="text-text-muted">Triggered Rule:</span>
                    <p className="font-semibold text-text-primary mt-0.5">
                      Peel Chain Money Splitting (+25 pts)
                    </p>
                  </div>
                  <div className="rounded bg-background-card p-2.5 border border-border-subtle">
                    <span className="text-text-muted">Counterparty:</span>
                    <p className="font-semibold text-text-primary mt-0.5">
                      Flagged Mixer Deposit
                    </p>
                  </div>
                  <div className="rounded bg-background-card p-2.5 border border-border-subtle">
                    <span className="text-text-muted">Action Taken:</span>
                    <p className="font-semibold text-brand-teal mt-0.5">
                      Escalated to Case #3
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. HOW IT WORKS (3 SIMPLE STEPS)
          ───────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="border-t border-border-subtle bg-background-card py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
              Simple Workflow
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              How BitSentry works in 3 steps
            </h2>
            <p className="mt-3 text-base text-text-secondary">
              No black-box machine learning models. Just clean, deterministic monitoring
              from payment receipt to team sign-off.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative rounded-2xl border border-border-subtle bg-background p-6 transition-all hover:border-brand-orange/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-text-primary">Watch the chain</h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                Connect your Bitcoin node or ingested transaction feed. BitSentry monitors
                every block, input, output, and wallet balance with zero delay.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl border border-border-subtle bg-background p-6 transition-all hover:border-brand-orange/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-text-primary">Score the risk</h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                Each payment is tested against 7 straightforward safety checks. Scores add
                up to an intuitive 0–100 scale: Low, Medium, High, or Critical.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl border border-border-subtle bg-background p-6 transition-all hover:border-brand-orange/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-text-primary">Review & resolve</h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                Suspicious transfers create alerts. Compliance analysts can group alerts
                into cases, write notes, and maintain a complete audit history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. WHAT WE CHECK (THE 7 SIMPLE WARNING SIGNS)
          ───────────────────────────────────────────────────────────── */}
      <section id="rules" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
              Transparency First
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              The 7 warning signs we check for
            </h2>
            <p className="mt-3 text-base text-text-secondary">
              Every score is fully explained. You and your regulators always know exactly
              why a transaction was flagged.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Rule 1 */}
            <div className="rounded-xl border border-border-subtle bg-background-card p-5 hover:bg-background-hover transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-brand-orange uppercase">
                  Rule 1
                </span>
                <span className="rounded bg-brand-orange/10 px-2 py-0.5 text-xs font-semibold text-brand-orange">
                  +30 pts
                </span>
              </div>
              <h4 className="text-base font-bold text-text-primary">Large Amount</h4>
              <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                Flags transfers exceeding your team's threshold (e.g. over 10M sats)
                so high-value movements always receive analyst review.
              </p>
            </div>

            {/* Rule 2 */}
            <div className="rounded-xl border border-border-subtle bg-background-card p-5 hover:bg-background-hover transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-brand-orange uppercase">
                  Rule 2
                </span>
                <span className="rounded bg-brand-orange/10 px-2 py-0.5 text-xs font-semibold text-brand-orange">
                  +25 pts
                </span>
              </div>
              <h4 className="text-base font-bold text-text-primary">Split (Peel Chain)</h4>
              <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                Catches patterns where someone peels off small payments repeatedly while
                continuing the remainder forward to disguise the trail.
              </p>
            </div>

            {/* Rule 3 */}
            <div className="rounded-xl border border-border-subtle bg-background-card p-5 hover:bg-background-hover transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-brand-orange uppercase">
                  Rule 3
                </span>
                <span className="rounded bg-brand-orange/10 px-2 py-0.5 text-xs font-semibold text-brand-orange">
                  +25 pts
                </span>
              </div>
              <h4 className="text-base font-bold text-text-primary">Rapid Movement</h4>
              <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                Flags coins transferred to another address immediately upon arrival, a
                frequent indicator of automated laundering.
              </p>
            </div>

            {/* Rule 4 */}
            <div className="rounded-xl border border-border-subtle bg-background-card p-5 hover:bg-background-hover transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-brand-orange uppercase">
                  Rule 4
                </span>
                <span className="rounded bg-brand-orange/10 px-2 py-0.5 text-xs font-semibold text-brand-orange">
                  +20 pts
                </span>
              </div>
              <h4 className="text-base font-bold text-text-primary">High Frequency</h4>
              <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                Identifies addresses initiating an unusually high number of transactions
                within a compressed time window.
              </p>
            </div>

            {/* Rule 5 */}
            <div className="rounded-xl border border-border-subtle bg-background-card p-5 hover:bg-background-hover transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-brand-orange uppercase">
                  Rule 5
                </span>
                <span className="rounded bg-brand-orange/10 px-2 py-0.5 text-xs font-semibold text-brand-orange">
                  +20 pts
                </span>
              </div>
              <h4 className="text-base font-bold text-text-primary">Many Destinations</h4>
              <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                Warns when one payment branches out into dozens of new destination
                wallets at once (unusual output fan-out).
              </p>
            </div>

            {/* Rule 6 */}
            <div className="rounded-xl border border-border-subtle bg-background-card p-5 hover:bg-background-hover transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-brand-orange uppercase">
                  Rule 6
                </span>
                <span className="rounded bg-brand-orange/10 px-2 py-0.5 text-xs font-semibold text-brand-orange">
                  +20 pts
                </span>
              </div>
              <h4 className="text-base font-bold text-text-primary">Watchlist Address</h4>
              <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                Flags any transfer touching an address marked as a mixer, scam, or
                sanctioned entity in your database.
              </p>
            </div>

            {/* Rule 7 */}
            <div className="rounded-xl border border-border-subtle bg-background-card p-5 hover:bg-background-hover transition-colors sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-brand-orange uppercase">
                  Rule 7
                </span>
                <span className="rounded bg-brand-orange/10 px-2 py-0.5 text-xs font-semibold text-brand-orange">
                  +25 pts
                </span>
              </div>
              <h4 className="text-base font-bold text-text-primary">Multi-Hop Chains</h4>
              <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                Traces coins bouncing across multiple intermediary wallets in quick
                succession before coming to rest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. COMPLIANCE TOOLS WORKSPACE
          ───────────────────────────────────────────────────────────── */}
      <section id="tools" className="border-t border-border-subtle bg-background-card py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
              All-In-One Workspace
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Tools built for real compliance work
            </h2>
            <p className="mt-3 text-base text-text-secondary">
              Everything your team needs to review alerts, make decisions, and stay organized.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Tool 1 */}
            <div className="rounded-2xl border border-border-subtle bg-background p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-brand-orange/10 p-2.5 text-brand-orange">
                  <Activity size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">
                    Real-Time Dashboard
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Your compliance command center
                  </p>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Get an instant snapshot of your operation: total volume scanned, current
                risk distribution charts, active alerts needing review, and quick links to
                recent events.
              </p>
            </div>

            {/* Tool 2 */}
            <div className="rounded-2xl border border-border-subtle bg-background p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-risk-high-bg p-2.5 text-risk-high">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">
                    Instant Alert Inbox
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Never miss a critical payment
                  </p>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                When a payment triggers warnings, it lands in a clean inbox. Analysts can
                review the evidence, mark it as safe, or turn it into an investigation with
                one click.
              </p>
            </div>

            {/* Tool 3 */}
            <div className="rounded-2xl border border-border-subtle bg-background p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-brand-teal/10 p-2.5 text-brand-teal">
                  <Search size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">
                    Address & Wallet Lookup
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Know who you're dealing with
                  </p>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Search any Bitcoin address to view its full transaction history, total
                inflow/outflow, known exchange labels, and whether it has been added to a
                watchlist.
              </p>
            </div>

            {/* Tool 4 */}
            <div className="rounded-2xl border border-border-subtle bg-background p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-brand-gold/10 p-2.5 text-brand-gold">
                  <FileText size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">
                    Case Folders & Team Notes
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Collaborate and resolve
                  </p>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Bundle related payments and addresses into a single Case. Assign team
                members, write timestamped notes, and maintain a complete audit history
                ready for regulators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. WHO BITSENTRY IS FOR & WHAT IT SUPPORTS (REPLACES UNDER THE HOOD)
          ───────────────────────────────────────────────────────────── */}
      <section id="who-its-for" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
              Audience & Capabilities
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Built for modern crypto businesses & compliance teams
            </h2>
            <p className="mt-3 text-base text-text-secondary">
              BitSentry delivers dependable Bitcoin monitoring without complex setup or
              black-box confusion.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Column 1: Who It's Designed For */}
            <div className="rounded-2xl border border-border-subtle bg-background-card p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-subtle">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">
                    Who BitSentry is Designed For
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Tailored for organizations handling digital assets
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-border-subtle bg-background p-4">
                  <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-orange" />
                    Virtual Asset Service Providers (VASPs)
                  </h4>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    Continuously monitor inbound and outbound customer deposits, verify fund origins,
                    and fulfill regulatory compliance obligations with ease.
                  </p>
                </div>

                <div className="rounded-xl border border-border-subtle bg-background p-4">
                  <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-orange" />
                    Over-The-Counter (OTC) Desks
                  </h4>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    Pre-screen large block transactions, inspect counterparty wallet histories,
                    and prevent settling funds tied to suspicious actors.
                  </p>
                </div>

                <div className="rounded-xl border border-border-subtle bg-background p-4">
                  <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-orange" />
                    Digital Asset Platforms & Custodians
                  </h4>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    Maintain automated watchlists, identify mixer interactions, and isolate
                    high-risk wallets before funds enter institutional custody.
                  </p>
                </div>

                <div className="rounded-xl border border-border-subtle bg-background p-4">
                  <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-orange" />
                    Compliance & Investigation Teams
                  </h4>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    Triage alerts, document findings with timestamped analyst notes, and maintain
                    a clean, exportable audit trail ready for regulators.
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: What The System Supports */}
            <div className="rounded-2xl border border-border-subtle bg-background-card p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-subtle">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">
                    What The System Supports
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Production-ready AML monitoring capabilities
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="rounded-xl border border-border-subtle bg-background p-3.5">
                  <p className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-brand-teal shrink-0" />
                    Bitcoin Core RPC Sync
                  </p>
                  <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                    Native block and transaction ingestion via regtest, testnet, or mainnet node.
                  </p>
                </div>

                <div className="rounded-xl border border-border-subtle bg-background p-3.5">
                  <p className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-brand-teal shrink-0" />
                    7 Deterministic Rules
                  </p>
                  <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                    Transparent scoring from 0 to 100 with no black-box AI hallucinations.
                  </p>
                </div>

                <div className="rounded-xl border border-border-subtle bg-background p-3.5">
                  <p className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-brand-teal shrink-0" />
                    Automated Alert Inbox
                  </p>
                  <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                    Severity levels (Low, Medium, High, Critical) with quick triage actions.
                  </p>
                </div>

                <div className="rounded-xl border border-border-subtle bg-background p-3.5">
                  <p className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-brand-teal shrink-0" />
                    Address Watchlists
                  </p>
                  <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                    Label known exchanges, tag flagged mixer addresses, and track fan-out.
                  </p>
                </div>

                <div className="rounded-xl border border-border-subtle bg-background p-3.5">
                  <p className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-brand-teal shrink-0" />
                    Case Folders & Notes
                  </p>
                  <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                    Organize multi-transaction investigations and collaborate with teammates.
                  </p>
                </div>

                <div className="rounded-xl border border-border-subtle bg-background p-3.5">
                  <p className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-brand-teal shrink-0" />
                    RBAC & Audit Trail
                  </p>
                  <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                    Admin, Analyst, and Auditor roles with tamper-evident user activity logs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. CALL TO ACTION (CTA BANNER)
          ───────────────────────────────────────────────────────────── */}
      <section className="border-t border-border-subtle bg-background-card py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-5">
            <BitSentryLogo className="h-12 w-12" />
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
            Ready to explore BitSentry?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-text-secondary leading-relaxed">
            Step into our compliance portal to monitor transactions, review active alerts,
            or request a private walkthrough with our solutions team.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={hasToken ? "/dashboard" : "/login"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-8 py-3.5 text-sm font-bold text-black transition-transform hover:opacity-95 active:scale-95 shadow-md"
            >
              {hasToken ? "Explore Dashboard" : "Sign In to Portal"}
              <ArrowRight size={16} />
            </Link>

            <button
              type="button"
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border-subtle bg-background px-8 py-3.5 text-sm font-medium text-text-primary transition-colors hover:bg-background-hover shadow-sm cursor-pointer"
            >
              <Calendar size={16} className="text-brand-orange" />
              Book a Demo
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. COMPACT FOOTER WITH REAL LINKS ONLY
          ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border-subtle bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo and Tagline */}
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
              <BitSentryLogo className="h-6 w-6 shrink-0" />
              <div>
                <span className="font-bold text-sm text-brand-orange">BitSentry AML</span>
                <span className="hidden sm:inline text-text-muted mx-2">•</span>
                <span className="block sm:inline text-xs text-text-secondary">
                  Bitcoin transaction monitoring and AML investigation platform.
                </span>
              </div>
            </div>

          </div>

          {/* Bottom subtle copyright and status */}
          <div className="mt-6 pt-4 border-t border-border-subtle/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-text-muted">
            <p>© {new Date().getFullYear()} BitSentry AML. Internal Enterprise Edition.</p>

          </div>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          10. "BOOK A DEMO" MODAL DIALOG
          ───────────────────────────────────────────────────────────── */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-background p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-border-subtle bg-background-card p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={resetDemoForm}
              className="absolute top-5 right-5 rounded-lg p-1 text-text-secondary hover:bg-background-hover hover:text-text-primary cursor-pointer"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {demoSubmitted ? (
              <div className="py-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-text-primary">
                  Demo Request Received
                </h3>
                <p className="mt-2 text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-text-primary">{fullName}</span>!
                  Our compliance solutions team will contact you at{" "}
                  <span className="font-mono text-brand-orange">{workEmail}</span> to schedule
                  your private platform walkthrough.
                </p>
                <button
                  type="button"
                  onClick={resetDemoForm}
                  className="mt-6 rounded-xl bg-brand-orange px-6 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <BitSentryLogo className="h-7 w-7" />
                  <h3 className="text-xl font-bold text-text-primary">
                    Book a Platform Demo
                  </h3>
                </div>
                <p className="text-xs text-text-secondary mb-6 leading-relaxed">
                  Experience how BitSentry monitors Bitcoin payments and streamlines AML
                  investigations for your organization.
                </p>

                <form onSubmit={handleDemoSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-3 text-text-muted" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="w-full rounded-lg border border-border-subtle bg-input-background py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-orange focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Work Email *
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-3 text-text-muted" />
                        <input
                          type="email"
                          required
                          value={workEmail}
                          onChange={(e) => setWorkEmail(e.target.value)}
                          placeholder="alex@company.com"
                          className="w-full rounded-lg border border-border-subtle bg-input-background py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-orange focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Organization *
                      </label>
                      <div className="relative">
                        <Building size={16} className="absolute left-3 top-3 text-text-muted" />
                        <input
                          type="text"
                          required
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          placeholder="Company name"
                          className="w-full rounded-lg border border-border-subtle bg-input-background py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-orange focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Your Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full rounded-lg border border-border-subtle bg-input-background py-2.5 px-3 text-sm text-text-primary focus:border-brand-orange focus:outline-none"
                    >
                      <option value="Compliance Lead">Compliance Lead / MLRO</option>
                      <option value="Risk Analyst">Risk & AML Analyst</option>
                      <option value="Executive / Operations">Operations / Executive</option>
                      <option value="Forensic Investigator">Forensic Investigator</option>
                      <option value="Auditor">Compliance Auditor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Notes or Specific Needs (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Tell us about your transaction volume or monitoring goals..."
                      className="w-full rounded-lg border border-border-subtle bg-input-background p-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-orange focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-brand-orange py-3 text-sm font-semibold text-black transition hover:opacity-95 shadow-md cursor-pointer"
                    >
                      Request Walkthrough
                    </button>
                    <p className="mt-2 text-center text-[11px] text-text-muted">
                      No spam. We will only contact you to schedule your demo.
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
