import { useQuery } from '@tanstack/react-query';
import { getCases } from '../services/cases';

export const useCases = () =>
  useQuery({ queryKey: ['cases'], queryFn: getCases, retry: 1 });