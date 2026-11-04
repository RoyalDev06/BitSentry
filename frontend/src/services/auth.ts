import type { CurrentUser, BitcoinStatus } from '../types/auth';
import { api, clearAuthToken, setAuthToken, getAuthToken } from './api';

export type { CurrentUser, BitcoinStatus };

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

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

export async function login(
  credentials: LoginRequest
): Promise<LoginResponse> {
  const result = await api.post<LoginResponse>('/auth/login', credentials);
  if (result?.access_token) {
    setAuthToken(result.access_token);
  }
  return result;
}

export async function getCurrentUser(): Promise<CurrentUser> {
  if (USE_MOCKS && !getAuthToken()) {
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
  window.location.href = '/login';
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export async function changePassword(
  payload: ChangePasswordRequest
): Promise<{ message: string }> {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 400));
    return { message: "Password updated successfully" };
  }
  return api.post<{ message: string }>('/auth/change-password', payload);
}

