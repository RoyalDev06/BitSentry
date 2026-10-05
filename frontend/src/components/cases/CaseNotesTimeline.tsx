import { useState } from 'react';
import { Send } from 'lucide-react';
import type { CaseNote } from '../../types/cases';
import { formatDateTime } from '../dashboard/dashboardUtils';

interface CaseNotesTimelineProps {
  caseId: string;
  notes: CaseNote[];
  onAdd: (caseId: string, author: string, body: string) => void;
}

const CURRENT_ANALYST = 'A. Kimani';

export default function CaseNotesTimeline({ caseId, notes, onAdd }: CaseNotesTimelineProps) {
  const [draft, setDraft] = useState('');

  const submit = () => {
    const body = draft.trim();
    if (body === '') return;
    onAdd(caseId, CURRENT_ANALYST, body);
    setDraft('');
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1 block text-xs font-medium text-text-muted">
          Add investigation note
        </label>
        <div className="flex gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            placeholder="What did you find?"
            className="w-full resize-none rounded-md border border-border-subtle bg-background-card px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-teal focus:outline-none"
          />
          <button
            type="button"
            onClick={submit}
            disabled={draft.trim() === ''}
            className="self-end rounded-md bg-brand-teal px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Add note"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <p className="text-sm text-text-muted">No notes yet. Be the first to add one.</p>
      ) : (
        <ol className="relative space-y-4 border-l border-border-subtle pl-5">
          {notes.map((n) => (
            <li key={n.id} className="relative">
              <span className="absolute -left-[23px] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-teal" />
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-text-primary">{n.author}</span>
                <span className="text-xs text-text-muted">{formatDateTime(n.createdAt)}</span>
              </div>
              <p className="mt-1 text-sm text-text-secondary">{n.body}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}