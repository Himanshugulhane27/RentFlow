import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { tenantApi } from '../../api/tenants.api';
import { shakeX } from '../../lib/animations';
import { cn } from '../../utils/cn';

interface TenantFormModalProps {
  mode: 'add' | 'edit';
  tenantId?: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10,}$/;

export const TenantFormModal: React.FC<TenantFormModalProps> = ({ mode, tenantId, open, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    unit: '',
    startDate: '',
    endDate: '',
    monthlyRent: '',
    securityDeposit: '',
    dueDay: '1',
    confirmed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: tenantData } = useQuery({
    queryKey: ['tenant', tenantId],
    queryFn: () => tenantApi.getById(tenantId!),
    enabled: mode === 'edit' && !!tenantId && open,
  });

  useEffect(() => {
    if (tenantData && mode === 'edit') {
      setFormData(prev => ({
        ...prev,
        firstName: tenantData.firstName || '',
        lastName: tenantData.lastName || '',
        email: tenantData.email || '',
        phone: tenantData.phone || '',
        dateOfBirth: tenantData.dateOfBirth?.split('T')[0] || '',
      }));
    }
  }, [tenantData, mode]);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(1);
        setDirection(1);
        setErrors({});
        if (mode === 'add') {
          setFormData({
            firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '',
            unit: '', startDate: '', endDate: '', monthlyRent: '', securityDeposit: '', dueDay: '1', confirmed: false,
          });
        }
      }, 300);
    }
  }, [open, mode]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value: string | boolean;
    if (e.target.type === 'checkbox') {
      value = (e.target as HTMLInputElement).checked;
    } else {
      value = e.target.value;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };


  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Phone must be at least 10 digits';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (parseFloat(formData.monthlyRent) <= 0 || isNaN(parseFloat(formData.monthlyRent))) {
      newErrors.monthlyRent = 'Rent must be greater than 0';
    }
    if (!formData.unit) newErrors.unit = 'Unit is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.monthlyRent) newErrors.monthlyRent = 'Monthly rent is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    if (step === 1) isValid = validateStep1();
    if (step === 2) isValid = validateStep2();

    if (isValid) {
      setDirection(1);
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(prev => prev - 1);
  };

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return mode === 'add' ? tenantApi.create(data) : tenantApi.update(tenantId!, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      if (tenantId) queryClient.invalidateQueries({ queryKey: ['tenant', tenantId] });
      onSuccess();
      onClose();
    },
  });

  const handleSubmit = () => {
    if (!formData.confirmed) return;
    
    // In real app, separate lease vs tenant payload based on API design
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      // Pass other fields appropriately if API accepts them directly
    };

    mutation.mutate(payload);
  };

  const stepVariants = {
    initial: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    animate: { x: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
    exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0, transition: { duration: 0.15 } }),
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'add' ? 'Add New Tenant' : 'Edit Tenant'}
      size="lg"
      footer={
        <div className="flex w-full justify-between items-center">
          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="secondary" onClick={handleBack} disabled={mutation.isPending}>
                ← Back
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            {step < 3 ? (
              <>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button onClick={handleNext}>Next →</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!formData.confirmed || mutation.isPending}
                  loading={mutation.isPending}
                >
                  {mode === 'add' ? 'Add Tenant' : 'Save Changes'}
                </Button>
              </>
            )}
          </div>
        </div>
      }
    >
      <div className="mb-8">
        {/* Stepper */}
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-hsl(var(--surface-3)) -z-10 -translate-y-1/2"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="flex flex-col items-center gap-2 bg-hsl(var(--surface-0)) px-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300",
                step === i ? "bg-hsl(var(--brand-500)) text-white" :
                step > i ? "bg-hsl(var(--success)) text-white" :
                "bg-hsl(var(--surface-3)) text-hsl(var(--text-tertiary))"
              )}>
                {step > i ? '✓' : i}
              </div>
              <span className="text-xs font-medium text-hsl(var(--text-secondary))">
                {i === 1 ? 'Personal Info' : i === 2 ? 'Lease Details' : 'Review'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden min-h-[300px]">
        <AnimatePresence custom={direction} mode="wait">
          {step === 1 && (
            <motion.div key="step1" custom={direction} variants={stepVariants} initial="initial" animate="animate" exit="exit" className="grid grid-cols-2 gap-4">
              <motion.div variants={errors.firstName ? shakeX : undefined} animate={errors.firstName ? 'animate' : 'initial'}>
                <Input id="firstName" label="First Name" value={formData.firstName} onChange={handleChange('firstName')} error={errors.firstName} />
              </motion.div>
              <motion.div variants={errors.lastName ? shakeX : undefined} animate={errors.lastName ? 'animate' : 'initial'}>
                <Input id="lastName" label="Last Name" value={formData.lastName} onChange={handleChange('lastName')} error={errors.lastName} />
              </motion.div>
              <motion.div variants={errors.email ? shakeX : undefined} animate={errors.email ? 'animate' : 'initial'} className="col-span-2">
                <Input id="email" type="email" label="Email Address" value={formData.email} onChange={handleChange('email')} error={errors.email} />
              </motion.div>
              <motion.div variants={errors.phone ? shakeX : undefined} animate={errors.phone ? 'animate' : 'initial'}>
                <Input id="phone" type="tel" label="Phone Number" value={formData.phone} onChange={handleChange('phone')} error={errors.phone} />
              </motion.div>
              <motion.div variants={errors.dateOfBirth ? shakeX : undefined} animate={errors.dateOfBirth ? 'animate' : 'initial'}>
                <Input id="dateOfBirth" type="date" label="Date of Birth" value={formData.dateOfBirth} onChange={handleChange('dateOfBirth')} error={errors.dateOfBirth} />
              </motion.div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" custom={direction} variants={stepVariants} initial="initial" animate="animate" exit="exit" className="grid grid-cols-2 gap-4">
              <motion.div variants={errors.unit ? shakeX : undefined} animate={errors.unit ? 'animate' : 'initial'} className="col-span-2">
                <Input id="unit" label="Unit Number" value={formData.unit} onChange={handleChange('unit')} error={errors.unit} />
              </motion.div>
              <motion.div variants={errors.startDate ? shakeX : undefined} animate={errors.startDate ? 'animate' : 'initial'}>
                <Input id="startDate" type="date" label="Lease Start Date" value={formData.startDate} onChange={handleChange('startDate')} error={errors.startDate} />
              </motion.div>
              <motion.div variants={errors.endDate ? shakeX : undefined} animate={errors.endDate ? 'animate' : 'initial'}>
                <Input id="endDate" type="date" label="Lease End Date" value={formData.endDate} onChange={handleChange('endDate')} error={errors.endDate} />
              </motion.div>
              <motion.div variants={errors.monthlyRent ? shakeX : undefined} animate={errors.monthlyRent ? 'animate' : 'initial'}>
                <Input id="monthlyRent" type="number" label="Monthly Rent" value={formData.monthlyRent} onChange={handleChange('monthlyRent')} error={errors.monthlyRent} icon={<span className="text-hsl(var(--text-tertiary))">$</span>} />
              </motion.div>
              <motion.div variants={errors.securityDeposit ? shakeX : undefined} animate={errors.securityDeposit ? 'animate' : 'initial'}>
                <Input id="securityDeposit" type="number" label="Security Deposit" value={formData.securityDeposit} onChange={handleChange('securityDeposit')} error={errors.securityDeposit} icon={<span className="text-hsl(var(--text-tertiary))">$</span>} />
              </motion.div>
              <div className="col-span-2">
                <Select id="dueDay" label="Payment Due Day" value={formData.dueDay} onChange={handleChange('dueDay')} options={Array.from({length: 28}, (_, i) => ({ value: String(i+1), label: `Day ${i+1}` }))} />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" custom={direction} variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="grid grid-cols-2 gap-6 bg-hsl(var(--surface-1)) p-4 rounded-[var(--radius-lg)]">
                <div>
                  <h4 className="text-sm font-semibold text-hsl(var(--text-primary)) mb-3 border-b border-hsl(var(--surface-border)) pb-2">Personal Info</h4>
                  <div className="space-y-2">
                    <div><p className="text-xs text-hsl(var(--text-tertiary)) uppercase tracking-wide">Name</p><p className="text-sm font-medium text-hsl(var(--text-primary))">{formData.firstName} {formData.lastName}</p></div>
                    <div><p className="text-xs text-hsl(var(--text-tertiary)) uppercase tracking-wide">Email</p><p className="text-sm font-medium text-hsl(var(--text-primary))">{formData.email}</p></div>
                    <div><p className="text-xs text-hsl(var(--text-tertiary)) uppercase tracking-wide">Phone</p><p className="text-sm font-medium text-hsl(var(--text-primary))">{formData.phone}</p></div>
                    <div><p className="text-xs text-hsl(var(--text-tertiary)) uppercase tracking-wide">DOB</p><p className="text-sm font-medium text-hsl(var(--text-primary))">{formData.dateOfBirth}</p></div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-hsl(var(--text-primary)) mb-3 border-b border-hsl(var(--surface-border)) pb-2">Lease Details</h4>
                  <div className="space-y-2">
                    <div><p className="text-xs text-hsl(var(--text-tertiary)) uppercase tracking-wide">Unit</p><p className="text-sm font-medium text-hsl(var(--text-primary))">{formData.unit}</p></div>
                    <div><p className="text-xs text-hsl(var(--text-tertiary)) uppercase tracking-wide">Lease Period</p><p className="text-sm font-medium text-hsl(var(--text-primary))">{formData.startDate} to {formData.endDate}</p></div>
                    <div><p className="text-xs text-hsl(var(--text-tertiary)) uppercase tracking-wide">Monthly Rent</p><p className="text-sm font-medium text-hsl(var(--text-primary))">${formData.monthlyRent}</p></div>
                    <div><p className="text-xs text-hsl(var(--text-tertiary)) uppercase tracking-wide">Due Day</p><p className="text-sm font-medium text-hsl(var(--text-primary))">Day {formData.dueDay}</p></div>
                  </div>
                </div>
              </div>
              
              <label className="flex items-start gap-3 cursor-pointer mt-4 bg-hsl(var(--surface-0)) p-3 rounded-[var(--radius-md)] border border-hsl(var(--surface-border)) hover:border-hsl(var(--brand-300)) transition-colors">
                <input type="checkbox" checked={formData.confirmed} onChange={handleChange('confirmed')} className="mt-1 w-4 h-4 rounded border-hsl(var(--surface-3)) text-hsl(var(--brand-500)) focus:ring-hsl(var(--brand-500))" />
                <span className="text-sm text-hsl(var(--text-primary))">I confirm this information is accurate and the lease details have been verified.</span>
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};
