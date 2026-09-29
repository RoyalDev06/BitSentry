import { useQuery } from '@tanstack/react-query';
import {
  getDashboardSummary,
  getRiskDistribution,
  getDashboardActivity,
} from '../services/dashboard';

export const useDashboardSummary = () =>
  useQuery({ queryKey: ['dashboard', 'summary'], queryFn: getDashboardSummary, retry: 1 });

export const useRiskDistribution = () =>
  useQuery({ queryKey: ['dashboard', 'risk-distribution'], queryFn: getRiskDistribution, retry: 1 });

export const useDashboardActivity = () =>
  useQuery({ queryKey: ['dashboard', 'activity'], queryFn: getDashboardActivity, retry: 1 });