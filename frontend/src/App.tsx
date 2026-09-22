function App() {
  return (
    <main className="min-h-screen bg-background p-8 text-text-primary">
      <div className="rounded-xl border border-border-subtle bg-background-card p-6">
        <h1 className="text-3xl font-bold text-brand-orange">
          BitSentry AML
        </h1>

        <p className="mt-2 text-text-secondary">
          Bitcoin Transaction Monitoring & AML Investigation Platform
        </p>

        <div className="mt-6 flex gap-3">
          <span className="rounded-full bg-risk-low-bg px-3 py-1 text-sm text-risk-low">
            Low
          </span>

          <span className="rounded-full bg-risk-medium-bg px-3 py-1 text-sm text-risk-medium">
            Medium
          </span>

          <span className="rounded-full bg-risk-high-bg px-3 py-1 text-sm text-risk-high">
            High
          </span>

          <span className="rounded-full bg-risk-critical-bg px-3 py-1 text-sm text-risk-critical">
            Critical
          </span>
        </div>

        <div className="mt-6 rounded-lg border border-border-subtle bg-background-hover p-4">
          <p className="text-brand-teal">
            Theme tokens are working.
          </p>
        </div>
      </div>
    </main>
  );
}

export default App;