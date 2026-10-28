import type { MonitoredWallet, CreateWalletRequest } from '../types/wallets';
import { api } from './api';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';
const WALLETS_STORAGE_KEY = 'bitsentry-monitored-wallets';

const mockDefaultWallets: MonitoredWallet[] = [
  {
    id: 1,
    name: 'Primary Treasury Wallet',
    address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    label: 'Exchange Reserve',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 2,
    name: 'OTC Liquidity Desk #2',
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    label: 'High-Volume OTC',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 3,
    name: 'Suspicious Mixer Counterparty',
    address: 'bc1q9d2l36v6u3s3m5m258vhv0yqu8p4vg5j3n6x07',
    label: 'Watchlist',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

function getStoredWallets(): MonitoredWallet[] {
  try {
    const raw = localStorage.getItem(WALLETS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : mockDefaultWallets;
  } catch {
    return mockDefaultWallets;
  }
}

function saveStoredWallets(wallets: MonitoredWallet[]): void {
  try {
    localStorage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(wallets));
  } catch {
    // Ignore storage errors
  }
}

export async function getWallets(): Promise<MonitoredWallet[]> {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 300));
    return getStoredWallets();
  }
  return api.get<MonitoredWallet[]>('/wallets');
}

export async function createWallet(
  payload: CreateWalletRequest
): Promise<MonitoredWallet> {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 300));
    const current = getStoredWallets();
    const newWallet: MonitoredWallet = {
      id: Date.now(),
      name: payload.name,
      address: payload.address,
      label: payload.label || null,
      created_at: new Date().toISOString(),
    };
    const updated = [newWallet, ...current];
    saveStoredWallets(updated);
    return newWallet;
  }
  return api.post<MonitoredWallet>('/wallets', payload);
}
