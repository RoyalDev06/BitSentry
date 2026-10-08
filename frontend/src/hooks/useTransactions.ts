import { useQuery } from '@tanstack/react-query';
import { getTransactions, getTransactionById } from '../services/transactions';

export const useTransactions = (limit?: number) =>
  useQuery({
    queryKey: ['transactions', limit],
    queryFn: () => getTransactions(limit),
    retry: 1,
  });

export const useTransaction = (id: string) =>
  useQuery({
    queryKey: ['transactions', id],
    queryFn: () => getTransactionById(id),
    retry: 0,
    enabled: Boolean(id),
  });
