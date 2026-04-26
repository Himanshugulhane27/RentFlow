import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/client';
import toast from 'react-hot-toast';

interface MarkPaidInput {
  paymentId: string;
  paidAmount: number;
  notes?: string;
}

export function useMarkPaymentPaid() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, paidAmount, notes }: MarkPaidInput) =>
      apiClient
        .patch(`/payments/${paymentId}/pay`, { paidAmount, notes })
        .then(r => r.data.data),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payments'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      qc.invalidateQueries({ queryKey: ['timeline'] });
      toast.success('Payment recorded successfully');
    },

    onError: (err: Error) => {
      toast.error(err?.message ?? 'Failed to record payment');
    },
  });
}
