import type { Transaction } from '../types/transactions';
import { mockTransactions } from '../mocks/transactions';
import { api } from './api';
import {
  toFrontendTransaction,
  type BackendTransaction,
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
    throw new Error('Mock error: failed to load transactions');
  if (mode === 'empty') return emptyValue;
  return data;
}

export async function getTransactions(
  limit: number = 100
): Promise<Transaction[]> {
  if (USE_MOCKS) {
    return mockResponse(mockTransactions, []);
  }

  const raw = await api.get<BackendTransaction[]>(
    `/transactions?limit=${limit}`
  );
  return raw.map((tx) => toFrontendTransaction(tx));
}

export async function getTransactionById(
  id: string
): Promise<Transaction> {
  if (USE_MOCKS) {
    const found = mockTransactions.find((t) => t.id === id || t.txId === id);
    await new Promise((r) => setTimeout(r, 400));
    if (!found) throw new Error('Transaction not found');
    return found;
  }

  const numericId = id.replace(/\D/g, '') || id;
  const raw = await api.get<BackendTransaction>(
    `/transactions/${numericId}`
  );
  return toFrontendTransaction(raw);
}
