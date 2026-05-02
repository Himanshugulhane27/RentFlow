import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle } from 'lucide-react';

import { paymentApi } from '../../api/payments.api';
import { useMarkPaymentPaid } from './hooks/useMarkPaymentPaid';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { PageTransition } from '../../components/ui/PageTransition';
import { staggerContainer, staggerItem } from '../../lib/animations';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { PAYMENT_METHODS } from '../../utils/constants';
import type { Payment } from '../../types/models';
import type { MarkPaidRequest } from '../../types/api';

const PaymentsPage: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [payModal, setPayModal] = useState<string | null>(null);
  const [payForm, setPayForm] = useState<MarkPaidRequest>({ paymentMethod: 'bank_transfer' });

  const { data, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: () => paymentApi.getAll(),
  });

  const { mutate: markPaidM, isPending } = useMarkPaymentPaid();

  const handleMarkPaid = (e: React.FormEvent) => {
    e.preventDefault();
    if (payModal) {
      const payment = payments.find(p => p._id === payModal);
      markPaidM(
        { paymentId: payModal, paidAmount: payment?.totalAmount ?? 0, notes: payForm.notes },
        {
          onSuccess: () => setPayModal(null)
        }
      );
    }
  };

  const payments = (data?.data || []).filter((p: Payment) =>
    filter === 'all' || p.status === filter
  );

  const methodOpts = Object.entries(PAYMENT_METHODS).map(([v, l]) => ({ value: v, label: l }));

  return (
    <PageTransition className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--text-primary))]">Payments</h1>
          <p className="text-sm text-[hsl(var(--text-secondary))] mt-1">{payments.length} payments</p>
        </div>
      </div>

      <div className="flex gap-2">
        {['all', 'pending', 'paid', 'overdue'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
              filter === s
                ? 'bg-brand-50 text-brand-700'
                : 'text-[hsl(var(--text-tertiary))] hover:bg-[var(--color-surface)]'
            }`}>
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : payments.length === 0 ? (
        <EmptyState
          title="No payments"
          description="Payments will appear here when created from active leases."
          icon={<CreditCard size={28} />}
        />
      ) : (
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {payments.map((p: Payment) => (
            <motion.div key={p._id} variants={staggerItem} layout layoutId={p._id}>
              <Card hoverable>
              <div className="flex items-start justify-between mb-3">
                <StatusBadge status={p.status} />
                <span className="text-lg font-bold text-[hsl(var(--text-primary))]">
                  {formatCurrency(p.totalAmount)}
                </span>
              </div>

              <p className="text-sm font-medium text-[hsl(var(--text-primary))]">
                {typeof p.tenantId === 'object'
                  ? `${p.tenantId.firstName} ${p.tenantId.lastName}`
                  : 'Tenant'}
              </p>
              <p className="text-xs text-[hsl(var(--text-tertiary))] mt-1">
                Due: {formatDate(p.dueDate)}
                {p.paidDate && ` · Paid: ${formatDate(p.paidDate)}`}
              </p>

              {p.lateFee > 0 && (
                <p className="text-xs text-danger-600 mt-1">
                  Late fee: {formatCurrency(p.lateFee)}
                </p>
              )}

              {(p.status === 'pending' || p.status === 'overdue') && (
                <div className="pt-3 mt-3 border-t border-[var(--color-border-subtle)]">
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
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Mark Paid Modal */}
      <Modal
        open={!!payModal}
        onClose={() => setPayModal(null)}
        title="Mark Payment as Paid"
        size="sm"
      >
        <form onSubmit={handleMarkPaid} className="space-y-4">
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
            <Button type="submit" loading={isPending}>Confirm</Button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
};

export default PaymentsPage;
