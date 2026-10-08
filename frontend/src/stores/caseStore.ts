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

export const useCaseStore = create<CaseStore>((set) => ({
  overrides: {},
  extraNotes: {},

  setStatus: (id, status) =>
    set((s) => ({
      overrides: {
        ...s.overrides,
        [id]: { ...s.overrides[id], status, updatedAt: new Date().toISOString() },
      },
    })),

  assignTo: (id, analyst) =>
    set((s) => ({
      overrides: {
        ...s.overrides,
        [id]: { ...s.overrides[id], assignedTo: analyst, updatedAt: new Date().toISOString() },
      },
    })),

  addNote: (id, author, body) =>
    set((s) => ({
      extraNotes: {
        ...s.extraNotes,
        [id]: [
          ...(s.extraNotes[id] ?? []),
          { id: `local-${Date.now()}`, author, body, createdAt: new Date().toISOString() },
        ],
      },
    })),

  clear: () => set({ overrides: {}, extraNotes: {} }),
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