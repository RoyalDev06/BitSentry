import { useQuery } from '@tanstack/react-query';
import { getCurrentUser, getBitcoinStatus } from '../services/auth';

export const useCurrentUser = () =>
  useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

export const useBitcoinStatus = () =>
  useQuery({
    queryKey: ['bitcoin', 'status'],
    queryFn: getBitcoinStatus,
    staleTime: 30 * 1000,
    retry: 1,
  });
