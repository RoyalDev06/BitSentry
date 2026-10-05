import type { CaseDetail } from '../types/cases';
import { mockCases } from '../mocks/cases';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

const mockMode = () => new URLSearchParams(window.location.search).get('mock');

async function mockResponse<T>(data: T, emptyValue: T): Promise<T> {
  const mode = mockMode();
  await new Promise((r) => setTimeout(r, mode === 'loading' ? 60_000 : 600));
  if (mode === 'error') throw new Error('Mock error: failed to load cases');
  if (mode === 'empty') return emptyValue;
  return data;
}

export async function getCases(): Promise<CaseDetail[]> {
  if (USE_MOCKS) return mockResponse(mockCases, []);
  // TODO: return (await api.get('/api/v1/cases')).data;
  throw new Error('Not implemented');
}

export async function getCaseById(id: string): Promise<CaseDetail> {
  if (USE_MOCKS) {
    const found = mockCases.find((c) => c.id === id);
    await new Promise((r) => setTimeout(r, 600));
    if (!found) throw new Error('Case not found');
    return found;
  }
  // TODO: return (await api.get(`/api/v1/cases/${id}`)).data;
  throw new Error('Not implemented');
}