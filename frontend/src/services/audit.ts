import type { AuditEntry } from '../types/audit';
import { api } from './api';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

const mockAuditLogs: AuditEntry[] = [
  {
    id: 101,
    actor_id: 1,
    action: 'USER_CREATED',
    target_type: 'user',
    target_id: 2,
    details: { email: 'analyst@bitsentry.local', role: 'analyst' },
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 102,
    actor_id: 1,
    action: 'WALLET_CREATED',
    target_type: 'wallet',
    target_id: 1,
    details: { name: 'Primary Treasury Wallet' },
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 103,
    actor_id: 1,
    action: 'BLOCK_INGESTED',
    target_type: 'block',
    target_id: 840100,
    details: { height: 840100, transactions: 2450 },
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 104,
    actor_id: 1,
    action: 'ALERTS_GENERATED',
    target_type: 'alert',
    target_id: null,
    details: { created_alert_ids: [1, 2, 3] },
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 105,
    actor_id: 1,
    action: 'CASE_CREATED',
    target_type: 'case',
    target_id: 1,
    details: { priority: 'HIGH', title: 'Potential Peel Chain Activity' },
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 106,
    actor_id: 1,
    action: 'USER_PASSWORD_CHANGED',
    target_type: 'user',
    target_id: 1,
    details: {},
    created_at: new Date(Date.now() - 600000).toISOString(),
  },
];

export async function getAuditLogs(limit = 100): Promise<AuditEntry[]> {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 300));
    return mockAuditLogs.slice(0, limit);
  }
  return api.get<AuditEntry[]>(`/audit?limit=${limit}`);
}
