import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlideOver } from '../../../components/ui/SlideOver';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import type { RentRollRow } from '../hooks/useRentRoll';
import { formatCurrency, formatDate } from '../../../utils/format';
import { useMarkPaymentPaid } from '../../payments/hooks/useMarkPaymentPaid';
import { CheckCircle2 } from 'lucide-react';

interface TenantQuickViewSlideOverProps {
  open: boolean;
  onClose: () => void;
  row: RentRollRow | null;
}

export const TenantQuickViewSlideOver: React.FC<TenantQuickViewSlideOverProps> = ({
  open,
  onClose,
  row,
}) => {
  const navigate = useNavigate();
  const [recording, setRecording] = useState(false);
  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState('');
  const { mutate: markPaid, isPending } = useMarkPaymentPaid();

  if (!row) return null;

  return (
    <SlideOver open={open} onClose={onClose} title="Tenant Quick View" width="md">
      {/* Header section */}
      <div className="bg-neutral-50 p-6 -mx-6 -mt-6 mb-6 border-b border-neutral-100 flex items-center gap-4">
        {row.tenantName ? (
          <>
            <div className="w-14 h-14 rounded-full bg-brand-100 text-brand-700 text-xl font-bold flex items-center justify-center flex-shrink-0">
              {row.tenantInitial}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">{row.tenantName}</h2>
              <p className="text-sm text-neutral-500">{row.unit} · {row.propertyName}</p>
              {row.healthScore && (
                <div className="mt-2">
                  <Badge 
                    variant={row.healthScore === 'reliable' ? 'success' : row.healthScore === 'watch' ? 'warning' : 'danger'}
                  >
                    {row.healthScore.charAt(0).toUpperCase() + row.healthScore.slice(1)} Health
                  </Badge>
                </div>
              )}
            </div>
          </>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Vacant Unit</h2>
            <p className="text-sm text-neutral-500">{row.unit} · {row.propertyName}</p>
            <div className="mt-2">
              <Badge variant="neutral">Vacant</Badge>
            </div>
          </div>
        )}
      </div>

      {/* Stats row */}
      {row.status !== 'vacant' && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-neutral-100 rounded-lg p-3">
            <p className="text-xs text-neutral-400 mb-1">Monthly Rent</p>
            <p className="text-sm font-semibold text-neutral-800">
              {row.monthlyRent ? formatCurrency(row.monthlyRent) : '—'}
            </p>
          </div>
          <div className="bg-white border border-neutral-100 rounded-lg p-3">
            <p className="text-xs text-neutral-400 mb-1">Lease Ends</p>
            <p className="text-sm font-semibold text-neutral-800">
              {row.leaseEndsAt ? formatDate(row.leaseEndsAt) : '—'}
            </p>
          </div>
          <div className="bg-white border border-neutral-100 rounded-lg p-3">
            <p className="text-xs text-neutral-400 mb-1">Last Payment</p>
            <p className="text-sm font-semibold text-neutral-800">
              {row.lastPaymentDate ? formatDate(row.lastPaymentDate) : 'Never'}
            </p>
          </div>
        </div>
      )}

      {/* Payment status section */}
      {row.status !== 'vacant' && (
        <div className="mb-6">
          <div className="mb-3">
            <Badge 
              variant={row.status === 'paid' ? 'success' : row.status === 'overdue' ? 'danger' : 'warning'}
            >
              {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
            </Badge>
          </div>
          
          {row.status === 'overdue' && (
            <div className="bg-danger-50 border border-danger-100 rounded-lg p-3 text-sm text-danger-700 mb-4">
              Rent is overdue. Take action below.
            </div>
          )}

          {/* Quick actions */}
          <div className="flex gap-2 flex-wrap mb-4">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => {
                alert(`Reminder sent to ${row.tenantName}`);
              }}
            >
              Send Reminder
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                navigate(`/tenants/${row.tenantId}`);
                onClose();
              }}
            >
              View Full Profile →
            </Button>
          </div>

          {row.status !== 'paid' ? (
            <div className="mt-4 pt-4 border-t border-neutral-100">
              {!recording ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setAmount(row.monthlyRent ?? 0);
                    setRecording(true);
                  }}
                >
                  Record Payment
                </Button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                      Amount Received
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={e => setAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-input focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                      Notes (optional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="e.g. Paid via bank transfer"
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-input focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      loading={isPending}
                      onClick={() => {
                        if (!row?.id) return;
                        markPaid(
                          { paymentId: row.id, paidAmount: amount, notes },
                          { onSuccess: () => {
                              setRecording(false);
                              onClose();
                            }
                          }
                        );
                      }}
                    >
                      Confirm Payment
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setRecording(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-success-500" />
                <span className="text-sm text-success-600 font-medium">
                  Paid {row.lastPaymentDate ? formatDate(row.lastPaymentDate) : ''}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {row.status === 'vacant' && (
        <div>
          <div className="bg-neutral-50 border border-neutral-100 rounded-lg p-4 text-center">
            <p className="text-sm text-neutral-600 mb-3">This unit is currently vacant.</p>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => {
                navigate(`/leases/new?property=${row.propertyId}`);
                onClose();
              }}
            >
              Create New Lease
            </Button>
          </div>
        </div>
      )}
    </SlideOver>
  );
};
