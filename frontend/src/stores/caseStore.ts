import { create } from 'zustand';
import type { CaseDetail, CaseStatus } from '../types/cases';

interface CaseStore {
  overrides: Record<string, Partial<CaseDetail>>;
  extraNotes: Record<string, CaseDetail['notes']>;
  setStatus: (id: string, status: CaseStatus) => void;
  assignTo: (id: string, analyst: string | null) => void;
  addNote: (id: string, author: string, body: string) => void;
  clear: () => void;
}

const OVERRIDES_STORAGE_KEY = 'bitsentry-case-overrides';
const NOTES_STORAGE_KEY = 'bitsentry-case-notes';

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors
  }
}

export const useCaseStore = create<CaseStore>((set) => ({
  overrides: loadStored<Record<string, Partial<CaseDetail>>>(OVERRIDES_STORAGE_KEY, {}),
  extraNotes: loadStored<Record<string, CaseDetail['notes']>>(NOTES_STORAGE_KEY, {}),

  setStatus: (id, status) =>
    set((s) => {
      const nextOverrides = {
        ...s.overrides,
        [id]: { ...s.overrides[id], status, updatedAt: new Date().toISOString() },
      };
      saveStored(OVERRIDES_STORAGE_KEY, nextOverrides);
      return { overrides: nextOverrides };
    }),

  assignTo: (id, analyst) =>
    set((s) => {
      const nextOverrides = {
        ...s.overrides,
        [id]: { ...s.overrides[id], assignedTo: analyst, updatedAt: new Date().toISOString() },
      };
      saveStored(OVERRIDES_STORAGE_KEY, nextOverrides);
      return { overrides: nextOverrides };
    }),

  addNote: (id, author, body) =>
    set((s) => {
      const nextNotes = {
        ...s.extraNotes,
        [id]: [
          ...(s.extraNotes[id] ?? []),
          { id: `local-${Date.now()}`, author, body, createdAt: new Date().toISOString() },
        ],
      };
      saveStored(NOTES_STORAGE_KEY, nextNotes);
      return { extraNotes: nextNotes };
    }),

  clear: () => {
    saveStored(OVERRIDES_STORAGE_KEY, {});
    saveStored(NOTES_STORAGE_KEY, {});
    set({ overrides: {}, extraNotes: {} });
  },
}));

/** Merge mock data with local overrides + locally added notes. */
export function applyOverrides(
  c: CaseDetail,
  overrides: CaseStore['overrides'],
  extraNotes: CaseStore['extraNotes'],
): CaseDetail {
  const override = overrides[c.id] ?? {};
  const extra = extraNotes[c.id] ?? [];
  return { ...c, ...override, notes: [...c.notes, ...extra] };
}