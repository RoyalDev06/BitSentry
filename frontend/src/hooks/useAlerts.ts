import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAlerts, getAlertById, updateAlertStatus } from '../services/alerts';
import type { AlertStatus } from '../types/dashboard';

export const useAlerts = () =>
  useQuery({
    queryKey: ['alerts'],
    queryFn: getAlerts,
    retry: 1,
  });

export const useAlert = (id: string) =>
  useQuery({
    queryKey: ['alerts', id],
    queryFn: () => getAlertById(id),
    retry: 0,
    enabled: Boolean(id),
  });

export const useUpdateAlertStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AlertStatus }) =>
      updateAlertStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
