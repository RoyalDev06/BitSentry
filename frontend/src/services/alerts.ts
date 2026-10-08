import type { Alert } from '../types/alerts';
import type { AlertStatus } from '../types/dashboard';
import { mockAlerts } from '../mocks/alerts';
import {
  api,
} from './api';
import {
  toFrontendAlert,
  toBackendAlertStatus,
  type BackendAlert,
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
    throw new Error('Mock error: failed to load alerts');
  if (mode === 'empty') return emptyValue;
  return data;
}

export async function getAlerts(): Promise<Alert[]> {
  if (USE_MOCKS) {
    return mockResponse(mockAlerts, []);
  }

  const raw = await api.get<BackendAlert[]>('/alerts');
  return raw.map(toFrontendAlert);
}

export async function getAlertById(id: string): Promise<Alert> {
  if (USE_MOCKS) {
    const found = mockAlerts.find((a) => a.id === id);
    await new Promise((r) => setTimeout(r, 400));
    if (!found) throw new Error('Alert not found');
    return found;
  }

  const numericId = id.replace(/\D/g, '') || id;
  const raw = await api.get<BackendAlert>(`/alerts/${numericId}`);
  return toFrontendAlert(raw);
}

export async function updateAlertStatus(
  id: string,
  status: AlertStatus
): Promise<Alert> {
  if (USE_MOCKS) {
    const found = mockAlerts.find((a) => a.id === id);
    if (!found) throw new Error('Alert not found');
    return { ...found, status };
  }

  const numericId = id.replace(/\D/g, '') || id;
  const raw = await api.patch<BackendAlert>(`/alerts/${numericId}/status`, {
    status: toBackendAlertStatus(status),
  });
  return toFrontendAlert(raw);
}

export async function generateAlerts(): Promise<{ created_alert_ids: number[] }> {
  if (USE_MOCKS) {
    return { created_alert_ids: [] };
  }
  return api.post<{ created_alert_ids: number[] }>('/alerts/generate');
}
