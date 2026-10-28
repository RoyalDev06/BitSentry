import type { PlatformUser, CreatePlatformUserRequest } from '../types/users';
import { api } from './api';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';
const USERS_STORAGE_KEY = 'bitsentry-platform-users';

const mockDefaultUsers: PlatformUser[] = [
  {
    id: 1,
    email: 'admin@bitsentry.local',
    full_name: 'Lead Compliance Officer',
    is_active: true,
    roles: ['admin', 'analyst'],
  },
  {
    id: 2,
    email: 'sarah.analyst@bitsentry.local',
    full_name: 'Sarah Connor',
    is_active: true,
    roles: ['analyst'],
  },
  {
    id: 3,
    email: 'marcus.investigator@bitsentry.local',
    full_name: 'Marcus Vance',
    is_active: true,
    roles: ['analyst'],
  },
];

function getStoredUsers(): PlatformUser[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : mockDefaultUsers;
  } catch {
    return mockDefaultUsers;
  }
}

function saveStoredUsers(users: PlatformUser[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // Ignore storage errors
  }
}

export async function getUsers(): Promise<PlatformUser[]> {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 300));
    return getStoredUsers();
  }
  return api.get<PlatformUser[]>('/users');
}

export async function createUser(
  payload: CreatePlatformUserRequest
): Promise<PlatformUser> {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 300));
    const current = getStoredUsers();
    const newUser: PlatformUser = {
      id: Date.now(),
      email: payload.email,
      full_name: payload.full_name,
      is_active: true,
      roles: [payload.role],
    };
    const updated = [...current, newUser];
    saveStoredUsers(updated);
    return newUser;
  }
  return api.post<PlatformUser>('/users', payload);
}
