import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, CreditCard, Search, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { paymentApi } from '../../api/payments.api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { PAYMENT_METHODS } from '../../utils/constants';
import type { Payment } from '../../types/models';
import type { MarkPaidRequest } from '../../types/api';

const PaymentsPage: React.FC = () => {
  const qc = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [payModal, setPayModal] = useState<string | null>(null);
  const [payForm, setPayForm] = useState<MarkPaidRequest>({ paymentMethod: 'bank_transfer' });

  const { data, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: () => paymentApi.getAll(),
  });

  const markPaidM = useMutation({
    mutationFn: ({ id, d }: { id: string; d: MarkPaidRequest }) => paymentApi.markPaid(id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Payment marked as paid');
      setPayModal(null);
    },
    onError: (e: { message?: string }) => toast.error(e.message || 'Failed'),
  });

  const payments = (data?.data || []).filter((p: Payment) =>
    filter === 'all' || p.status === filter
  );

  const methodOpts = Object.entries(PAYMENT_METHODS).map(([v, l]) => ({ value: v, label: l }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white font-[var(--font-heading)]">Payments</h1>
          <p className="text-sm text-surface-500 mt-1">{payments.length} payments</p>
        </div>
      </div>

      <div className="flex gap-2">
        {['all', 'pending', 'paid', 'overdue'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
              filter === s
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
                : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800'
            }`}>
            {s}
          </button>
        ))}
      </div>

      {isLoading ? <CardSkeleton count={6} /> : payments.length === 0 ? (
        <EmptyState
          title="No payments"
          description="Payments will appear here when created from active leases."
          icon={<CreditCard size={28} />}
        />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {payments.map((p: Payment) => (
            <Card key={p._id}>
              <div className="flex items-start justify-between mb-3">
                <StatusBadge status={p.status} />
                <span className="text-lg font-bold text-surface-900 dark:text-white">
                  {formatCurrency(p.totalAmount)}
                </span>
              </div>

              <p className="text-sm font-medium text-surface-900 dark:text-white">
                {typeof p.tenantId === 'object'
                  ? `${p.tenantId.firstName} ${p.tenantId.lastName}`
                  : 'Tenant'}
              </p>
              <p className="text-xs text-surface-500 mt-1">
                Due: {formatDate(p.dueDate)}
                {p.paidDate && ` · Paid: ${formatDate(p.paidDate)}`}
              </p>

              {p.lateFee > 0 && (
                <p className="text-xs text-danger-600 mt-1">
                  Late fee: {formatCurrency(p.lateFee)}
                </p>
              )}

              {(p.status === 'pending' || p.status === 'overdue') && (
                <div className="pt-3 mt-3 border-t border-surface-100 dark:border-surface-700">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<CheckCircle size={14} />}
                    onClick={() => setPayModal(p._id)}
                  >
                    Mark Paid
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </motion.div>
      )}

      {/* Mark Paid Modal */}
      <Modal
        isOpen={!!payModal}
        onClose={() => setPayModal(null)}
        title="Mark Payment as Paid"
        size="sm"
      >
        <form onSubmit={e => {
          e.preventDefault();
          if (payModal) markPaidM.mutate({ id: payModal, d: payForm });
        }} className="space-y-4">
          <Select
            label="Payment Method"
            value={payForm.paymentMethod}
            onChange={e => setPayForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
            options={methodOpts}
          />
          <Input
            label="Transaction ID (optional)"
            value={payForm.transactionId || ''}
            onChange={e => setPayForm(prev => ({ ...prev, transactionId: e.target.value }))}
          />
          <Input
            label="Notes (optional)"
            value={payForm.notes || ''}
            onChange={e => setPayForm(prev => ({ ...prev, notes: e.target.value }))}
          />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" type="button" onClick={() => setPayModal(null)}>Cancel</Button>
            <Button type="submit" loading={markPaidM.isPending}>Confirm</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PaymentsPage;
