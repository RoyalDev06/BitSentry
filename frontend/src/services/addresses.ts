import type { BitcoinAddress } from '../types/addresses';
import { mockAddresses } from '../mocks/addresses';
import { api } from './api';
import {
  toFrontendAddress,
  type BackendAddress,
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
    throw new Error('Mock error: failed to load addresses');
  if (mode === 'empty') return emptyValue;
  return data;
}

export async function getAddresses(): Promise<BitcoinAddress[]> {
  if (USE_MOCKS) {
    return mockResponse(mockAddresses, []);
  }

  const raw = await api.get<BackendAddress[]>('/addresses');
  return raw.map(toFrontendAddress);
}

export async function updateAddress(
  id: string,
  payload: { label?: string; is_watchlisted?: boolean; is_known?: boolean }
): Promise<BitcoinAddress> {
  if (USE_MOCKS) {
    const found = mockAddresses.find((a) => a.id === id || a.address === id);
    if (!found) throw new Error('Address not found');
    return { ...found };
  }

  const numericId = id.replace(/\D/g, '') || id;
  const raw = await api.patch<BackendAddress>(
    `/addresses/${numericId}`,
    payload
  );
  return toFrontendAddress(raw);
}
