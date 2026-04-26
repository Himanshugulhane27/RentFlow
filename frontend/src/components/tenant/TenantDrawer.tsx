import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { X, Copy, FileText } from 'lucide-react';
import { tenantApi } from '../../api/tenants.api';
import { paymentApi } from '../../api/payments.api';
import { leaseApi } from '../../api/leases.api';
import { propertyApi } from '../../api/properties.api';
import { slideInRight, springGentle } from '../../lib/animations';
import { cn } from '../../utils/cn';
import { FadeImage } from '../ui/FadeImage';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { SkeletonTenantCard, Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { formatDate, formatCurrency } from '../../utils/format';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface TenantDrawerProps {
  tenantId: string | null;
  onClose: () => void;
  onEdit: (id: string) => void;
}

export const TenantDrawer: React.FC<TenantDrawerProps> = ({ tenantId, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'documents' | 'notes'>('overview');
  const drawerRef = React.useRef<HTMLDivElement>(null);
  useFocusTrap(drawerRef as React.RefObject<HTMLElement>, !!tenantId);

  const { data: tenant, isLoading: isTenantLoading } = useQuery({
    queryKey: ['tenant', tenantId],
    queryFn: () => tenantApi.getById(tenantId!),
    enabled: !!tenantId,
  });

  const { data: leasesData } = useQuery({
    queryKey: ['leases', { tenantId }],
    queryFn: () => leaseApi.getAll(), // Ideally filtered by tenantId via API
    enabled: !!tenantId,
  });

  const { data: paymentsData } = useQuery({
    queryKey: ['payments', { tenantId }],
    queryFn: () => paymentApi.getAll(), // Ideally filtered
    enabled: !!tenantId,
  });

  const { data: propertiesData } = useQuery({
    queryKey: ['properties'],
    queryFn: () => propertyApi.getAll(),
    enabled: !!tenantId,
  });

  useEffect(() => {
    if (tenantId) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEscape);
      };
    }
  }, [tenantId, onClose]);

  if (typeof document === 'undefined') return null;

  const activeLease = leasesData?.data?.find((l: any) => 
    (typeof l.tenantId === 'string' ? l.tenantId : l.tenantId?._id) === tenantId && l.status === 'active'
  );
  
  const property = propertiesData?.data?.find((p: any) => 
    activeLease && (typeof activeLease.propertyId === 'string' ? activeLease.propertyId : activeLease.propertyId?._id) === p._id
  );

  const tenantPayments = paymentsData?.data?.filter((p: any) => 
    (typeof p.tenantId === 'string' ? p.tenantId : p.tenantId?._id) === tenantId
  ).sort((a: any, b: any) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()) || [];

  return createPortal(
    <AnimatePresence>
      {tenantId && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-hsl(220 20% 10% / 0.3) backdrop-blur-[2px] z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            variants={slideInRight}
            initial="initial"
            animate="animate"
            exit={{ x: '100%', transition: springGentle }}
            className="relative w-full sm:w-[440px] lg:w-[520px] glass-strong elevation-5 z-50 flex flex-col h-full bg-hsl(var(--surface-0))"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
          >
            {isTenantLoading ? (
              <div className="p-6">
                <SkeletonTenantCard />
                <div className="mt-6 space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            ) : tenant ? (
              <>
                {/* Header */}
                <div className="p-6 border-b border-hsl(var(--surface-border)) flex-shrink-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <FadeImage
                        src={tenant.avatar || `https://ui-avatars.com/api/?name=${tenant.firstName}+${tenant.lastName}&background=random`}
                        alt={tenant.fullName}
                        className="w-12 h-12 rounded-[var(--radius-full)] object-cover"
                      />
                      <div>
                        <h2 id="drawer-title" className="text-lg font-bold text-hsl(var(--text-primary))">
                          {tenant.fullName}
                        </h2>
                        <p className="text-sm text-hsl(var(--text-secondary))">
                          {property ? `${property.address} ${property.unit ? `Unit ${property.unit}` : ''}` : 'No active property'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-1.5 rounded-[var(--radius-md)] text-hsl(var(--text-tertiary)) hover:bg-hsl(var(--surface-3)) hover:text-hsl(var(--text-primary)) transition-colors focus-ring"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="flex gap-3 mt-6">
                    <div className="flex-1 bg-hsl(var(--surface-3)) rounded-[var(--radius-md)] px-3 py-2 text-center">
                      <p className="text-xs text-hsl(var(--text-tertiary)) mb-0.5">Monthly Rent</p>
                      <p className="text-sm font-semibold tabular-nums text-hsl(var(--text-primary))">
                        {activeLease ? formatCurrency(activeLease.monthlyRent) : '-'}
                      </p>
                    </div>
                    <div className="flex-1 bg-hsl(var(--surface-3)) rounded-[var(--radius-md)] px-3 py-2 text-center">
                      <p className="text-xs text-hsl(var(--text-tertiary)) mb-0.5">Lease End</p>
                      <p className="text-sm font-semibold tabular-nums text-hsl(var(--text-primary))">
                        {activeLease ? formatDate(activeLease.endDate) : '-'}
                      </p>
                    </div>
                    <div className="flex-1 bg-hsl(var(--surface-3)) rounded-[var(--radius-md)] px-3 py-2 text-center">
                      <p className="text-xs text-hsl(var(--text-tertiary)) mb-0.5">Status</p>
                      <p className="text-sm font-semibold text-hsl(var(--text-primary))">
                        {activeLease ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-hsl(var(--surface-border)) px-6 flex-shrink-0">
                  {['overview', 'history', 'documents', 'notes'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={cn(
                        'px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors focus-ring',
                        activeTab === tab
                          ? 'border-hsl(var(--brand-500)) text-hsl(var(--brand-500))'
                          : 'border-transparent text-hsl(var(--text-secondary)) hover:text-hsl(var(--text-primary))'
                      )}
                    >
                      {tab === 'history' ? 'Payment History' : tab}
                    </button>
                  ))}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <section>
                        <h3 className="text-sm font-semibold text-hsl(var(--text-primary)) mb-3">Contact Information</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-hsl(var(--text-secondary))">Email</span>
                            <div className="flex items-center gap-2">
                              <span className="text-hsl(var(--text-primary)) font-medium">{tenant.email}</span>
                              <button className="text-hsl(var(--text-tertiary)) hover:text-hsl(var(--brand-500))"><Copy size={14}/></button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-hsl(var(--text-secondary))">Phone</span>
                            <div className="flex items-center gap-2">
                              <span className="text-hsl(var(--text-primary)) font-medium">{tenant.phone}</span>
                              <button className="text-hsl(var(--text-tertiary)) hover:text-hsl(var(--brand-500))"><Copy size={14}/></button>
                            </div>
                          </div>
                        </div>
                      </section>

                      {tenant.emergencyContact && (
                        <section>
                          <h3 className="text-sm font-semibold text-hsl(var(--text-primary)) mb-3">Emergency Contact</h3>
                          <div className="bg-hsl(var(--surface-2)) rounded-[var(--radius-md)] p-3 space-y-1">
                            <p className="text-sm font-medium text-hsl(var(--text-primary))">{tenant.emergencyContact.name}</p>
                            <p className="text-xs text-hsl(var(--text-secondary))">{tenant.emergencyContact.relationship} • {tenant.emergencyContact.phone}</p>
                          </div>
                        </section>
                      )}
                    </div>
                  )}

                  {activeTab === 'history' && (
                    <div className="space-y-4">
                      {tenantPayments.length > 0 ? (
                        tenantPayments.slice(0, 10).map((payment: any) => (
                          <div key={payment._id} className="flex justify-between items-center py-2 border-b border-hsl(var(--surface-border)) last:border-0">
                            <div>
                              <p className="text-sm font-medium text-hsl(var(--text-primary))">{formatDate(payment.dueDate)}</p>
                              <p className="text-xs text-hsl(var(--text-secondary)) capitalize">{payment.paymentMethod || 'Unpaid'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-hsl(var(--text-primary)) tabular-nums">{formatCurrency(payment.amount)}</p>
                              <Badge variant={payment.status === 'paid' ? 'success' : payment.status === 'overdue' ? 'danger' : 'warning'} className="mt-1">
                                {payment.status}
                              </Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <EmptyState icon={<FileText size={32} className="text-hsl(var(--text-tertiary))" />} title="No payments found" description="This tenant hasn't made any payments yet." />
                      )}
                    </div>
                  )}

                  {activeTab === 'documents' && (
                    <EmptyState icon={<FileText size={32} className="text-hsl(var(--text-tertiary))"/>} title="No documents" description="There are no documents uploaded for this tenant." />
                  )}

                  {activeTab === 'notes' && (
                    <div className="space-y-4 flex flex-col h-full">
                      <div className="flex-1 space-y-3">
                        {tenant.notes ? (
                          <div className="bg-hsl(var(--surface-2)) p-3 rounded-[var(--radius-md)]">
                            <p className="text-xs text-hsl(var(--text-tertiary)) mb-1">System Note</p>
                            <p className="text-sm text-hsl(var(--text-primary))">{tenant.notes}</p>
                          </div>
                        ) : (
                          <EmptyState icon={<FileText size={32} className="text-hsl(var(--text-tertiary))" />} title="No notes" description="Add some notes about this tenant." />
                        )}
                      </div>
                      <div className="mt-auto pt-4 border-t border-hsl(var(--surface-border))">
                        <Input placeholder="Add a new note..." className="mb-2" />
                        <Button className="w-full">Add Note</Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="border-t border-hsl(var(--surface-border)) p-4 flex gap-3 bg-hsl(var(--surface-1)) flex-shrink-0">
                  <Button variant="secondary" className="flex-1" onClick={() => alert('Send Reminder')}>Send Reminder</Button>
                  <Button variant="primary" className="flex-1" onClick={() => onEdit(tenant._id)}>Edit Tenant</Button>
                </div>
              </>
            ) : null}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
