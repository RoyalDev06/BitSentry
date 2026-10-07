import type { CaseDetail, CaseStatus } from '../types/cases';
import { mockCases } from '../mocks/cases';
import { api } from './api';
import {
  toFrontendCase,
  toBackendCaseStatus,
  type BackendCase,
} from './adapters';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

const mockMode = () =>
  new URLSearchParams(window.location.search).get('mock');

async function mockResponse<T>(data: T, emptyValue: T): Promise<T> {
  const mode = mockMode();
  await new Promise((r) =>
    setTimeout(r, mode === 'loading' ? 60_000 : 500)
  );
  if (mode === 'error')
    throw new Error('Mock error: failed to load cases');
  if (mode === 'empty') return emptyValue;
  return data;
}

export async function getCases(): Promise<CaseDetail[]> {
  if (USE_MOCKS) return mockResponse(mockCases, []);

  const raw = await api.get<BackendCase[]>('/cases');
  return raw.map(toFrontendCase);
}

export async function getCaseById(id: string): Promise<CaseDetail> {
  if (USE_MOCKS) {
    const found = mockCases.find((c) => c.id === id);
    await new Promise((r) => setTimeout(r, 400));
    if (!found) throw new Error('Case not found');
    return found;
  }

  const numericId = id.replace(/\D/g, '') || id;
  const raw = await api.get<{
    case: BackendCase;
    alert_ids: number[];
    notes: Array<{ id: number; note: string; author_id: number; created_at: string }>;
    activity: Array<{ action: string; created_at: string }>;
  }>(`/cases/${numericId}`);

  const caseDetail = toFrontendCase(raw.case);
  if (raw.notes) {
    caseDetail.notes = raw.notes.map((n) => ({
      id: String(n.id),
      author: `User #${n.author_id}`,
      body: n.note,
      createdAt: n.created_at,
    }));
  }
  return caseDetail;
}

export async function updateCaseStatus(
  id: string,
  status: CaseStatus
): Promise<void> {
  if (USE_MOCKS) return;

  const numericId = id.replace(/\D/g, '') || id;
  await api.patch(`/cases/${numericId}/status`, {
    status: toBackendCaseStatus(status),
  });
}

export async function addCaseNote(
  id: string,
  note: string
): Promise<void> {
  if (USE_MOCKS) return;

  const numericId = id.replace(/\D/g, '') || id;
  await api.post(`/cases/${numericId}/notes`, { note });
}