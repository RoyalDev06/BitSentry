import type {
  DashboardSummary,
  RiskDistributionItem,
  DashboardActivity,
} from '../types/dashboard';
import {
  mockSummary,
  mockRiskDistribution,
  mockActivity,
} from '../mocks/dashboard';
import { api } from './api';
import {
  toFrontendDashboardSummary,
  toFrontendRiskDistribution,
  toFrontendDashboardActivity,
  type BackendDashboardSummary,
} from './adapters';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

// Demo switch: /dashboard?mock=loading | empty | error
const mockMode = () =>
  new URLSearchParams(window.location.search).get('mock');

async function mockResponse<T>(data: T, emptyValue: T): Promise<T> {
  const mode = mockMode();
  await new Promise((r) =>
    setTimeout(r, mode === 'loading' ? 60_000 : 500)
  );
  if (mode === 'error')
    throw new Error('Mock error: failed to load dashboard data');
  if (mode === 'empty') return emptyValue;
  return data;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  if (USE_MOCKS) {
    return mockResponse(mockSummary, {
      transactionsMonitored: 0,
      activeAlerts: 0,
      highCriticalAlerts: 0,
      openCases: 0,
    });
  }

  const raw = await api.get<BackendDashboardSummary>('/dashboard/summary');
  return toFrontendDashboardSummary(raw);
}

export async function getRiskDistribution(): Promise<RiskDistributionItem[]> {
  if (USE_MOCKS) return mockResponse(mockRiskDistribution, []);

  const raw = await api.get<Array<{ level: string; count: number }>>(
    '/dashboard/risk-distribution'
  );
  return toFrontendRiskDistribution(raw);
}

export async function getDashboardActivity(): Promise<DashboardActivity> {
  if (USE_MOCKS) {
    return mockResponse(mockActivity, {
      recentTransactions: [],
      recentAlerts: [],
    });
  }

  const raw = await api.get<any>('/dashboard/activity');
  return toFrontendDashboardActivity(raw);
}
