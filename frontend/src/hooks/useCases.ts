import { useQuery } from '@tanstack/react-query';
import { getCases, getCaseById } from '../services/cases';

export const useCases = () =>
  useQuery({ queryKey: ['cases'], queryFn: getCases, retry: 1 });

export const useCase = (id: string) =>
  useQuery({
    queryKey: ['cases', id],
    queryFn: () => getCaseById(id),
    retry: 0, // don't retry a not-found
    enabled: Boolean(id),
  });