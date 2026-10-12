import type { CurrentUser, BitcoinStatus } from '../types/auth';
import { api, clearAuthToken } from './api';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

const mockUser: CurrentUser = {
  id: 1,
  email: 'admin@bitsentry.local',
  full_name: 'Lead Compliance Analyst',
  roles: ['admin', 'analyst'],
  is_active: true,
};

const mockBitcoinStatus: BitcoinStatus = {
  connected: false,
  network: 'regtest',
  blocks: 840103,
  headers: 840103,
  verification_progress: 1.0,
  error: 'Bitcoin node offline (Mock Mode)',
};

export async function getCurrentUser(): Promise<CurrentUser> {
  if (USE_MOCKS) {
    return mockUser;
  }
  return api.get<CurrentUser>('/auth/me');
}

export async function getBitcoinStatus(): Promise<BitcoinStatus> {
  if (USE_MOCKS) {
    return mockBitcoinStatus;
  }
  return api.get<BitcoinStatus>('/bitcoin/status');
}

export function logout(): void {
  clearAuthToken();
  // Reload window to reset all in-memory React and Query state
  window.location.reload();
}
