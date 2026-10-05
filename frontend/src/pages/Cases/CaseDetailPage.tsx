import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useCase } from '../../hooks/useCases';
import { useCaseStore } from '../../stores/caseStore';
import RiskBadge from '../../components/ui/RiskBadge';
import StateView from '../../components/dashboard/StateView';
import CaseHeaderControls from '../../components/cases/CaseHeaderControls';
import type { CaseDetail } from '../../types/cases';
import SectionCard from '../../components/dashboard/SectionCard';
import CaseRelatedAlerts from '../../components/cases/CaseRelatedAlerts';
import CaseRelatedTransactions from '../../components/cases/CaseRelatedTransactions';
import CaseRelatedAddresses from '../../components/cases/CaseRelatedAddresses';
import CaseNotesTimeline from '../../components/cases/CaseNotesTimeline';

const EMPTY: Partial<CaseDetail> = {};
const EMPTY_NOTES: [] = [];
export default function CaseDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const { data, isLoading, isError, error, refetch } = useCase(id);
  
const rawOverride = useCaseStore((s) => s.overrides[id]);
const overrides = rawOverride ?? EMPTY;
const rawExtra = useCaseStore((s) => s.extraNotes[id]);
const extraNotes = rawExtra ?? EMPTY_NOTES;
const addNote = useCaseStore((s) => s.addNote);

const merged = data
  ? { ...data, ...overrides, notes: [...data.notes, ...extraNotes] }
  : undefined;

  const notFound = isError && (error as Error)?.message === 'Case not found';

  return (
    <div className="space-y-6">
      <Link
        to="/cases"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-brand-teal"
      >
        <ArrowLeft size={16} />
        Back to cases
      </Link>

      {isLoading && (
        <section className="rounded-xl border border-border-subtle bg-background-card p-5">
          <StateView isLoading />
        </section>
      )}

      {notFound && (
        <section className="rounded-xl border border-border-subtle bg-background-card p-10">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <AlertCircle className="h-8 w-8 text-risk-critical" />
            <h2 className="text-lg font-semibold text-text-primary">Case not found</h2>
            <p className="text-sm text-text-secondary">
              We couldn't find a case with ID <span className="font-mono">{id}</span>.
            </p>
            <Link
              to="/cases"
              className="mt-2 rounded-md border border-border-subtle bg-background-hover px-4 py-2 text-sm font-medium text-text-primary hover:bg-background-hover"
            >
              Back to cases
            </Link>
          </div>
        </section>
      )}

      {isError && !notFound && (
        <section className="rounded-xl border border-border-subtle bg-background-card p-5">
          <StateView isError onRetry={refetch} />
        </section>
      )}

      {merged && (
        <>
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-text-muted">{merged.id}</span>
                <RiskBadge level={merged.priority} />
              </div>
              <h1 className="mt-2 text-2xl font-semibold text-text-primary">
                {merged.title}
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-text-secondary">
                {merged.description}
              </p>
            </div>

            <CaseHeaderControls caseId={merged.id} />
          </header>

         <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
  <SectionCard title="Related Alerts">
    <CaseRelatedAlerts alerts={merged.relatedAlerts} />
  </SectionCard>

  <SectionCard title="Related Addresses">
    <CaseRelatedAddresses addresses={merged.relatedAddresses} />
  </SectionCard>
</div>

<SectionCard title="Related Transactions">
  <CaseRelatedTransactions transactions={merged.relatedTransactions} />
</SectionCard>

<SectionCard title="Investigation Notes">
  <CaseNotesTimeline
    caseId={merged.id}
    notes={merged.notes}
    onAdd={addNote}
  />
</SectionCard>
        </>
      )}
    </div>
  );
}