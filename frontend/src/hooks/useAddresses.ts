import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAddresses, updateAddress } from '../services/addresses';

export const useAddresses = () =>
  useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses,
    retry: 1,
  });

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { label?: string; is_watchlisted?: boolean; is_known?: boolean };
    }) => updateAddress(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};
