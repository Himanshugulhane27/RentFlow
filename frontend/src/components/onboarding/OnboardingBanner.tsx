import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles } from 'lucide-react';
import { OnboardingChecklist } from './OnboardingChecklist';
import { Card } from '../ui/Card';

interface OnboardingBannerProps {
  propertiesCount: number;
  tenantsCount: number;
  hasCollectedRent: boolean;
}

export const OnboardingBanner: React.FC<OnboardingBannerProps> = ({
  propertiesCount,
  tenantsCount,
  hasCollectedRent
}) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);

  const steps = [
    { id: 'prop', title: 'Add Property', description: 'Create your first rental unit', completed: propertiesCount > 0, path: '/properties?action=add' },
    { id: 'tenant', title: 'Add Tenant', description: 'Link a tenant to your property', completed: tenantsCount > 0, path: '/tenants?action=add' },
    { id: 'rent', title: 'Collect Rent', description: 'Record your first payment', completed: hasCollectedRent, path: '/payments?action=collect' },
  ];

  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  const dismiss = () => {
    setIsDismissing(true);
    localStorage.setItem('rf_onboarding_dismissed', 'true');
    setTimeout(() => setIsVisible(false), 300);
  };

  useEffect(() => {
    const isDismissed = localStorage.getItem('rf_onboarding_dismissed');
    if (!isDismissed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
    }
    
    if (completedCount === 3 && isVisible && !isDismissed) {
      // Auto dismiss with celebration
      const t = setTimeout(() => {
        dismiss();
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [completedCount, isVisible]);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {!isDismissing && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: prefersReduced ? 0 : 0.25 }}
          className="mb-6"
        >
          <Card className="bg-[var(--color-surface-raised)] border border-[var(--color-border)] border-l-4 border-l-brand-500 overflow-hidden relative">
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-[hsl(var(--text-primary))] flex items-center gap-2">
                    <Sparkles className="text-brand-500" size={20} />
                    Welcome to RentFlow
                  </h3>
                  <p className="text-sm text-[hsl(var(--text-secondary))] mt-1">Let's get your account set up to start managing your rentals.</p>
                </div>
                <button onClick={dismiss} className="text-[hsl(var(--text-tertiary))] hover:text-[hsl(var(--text-primary))] transition-colors p-1 rounded focus-ring">
                  <X size={20} />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 mb-2 flex items-center justify-between text-xs font-medium text-brand-700">
                <span>Setup Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2 w-full bg-brand-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-brand-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: prefersReduced ? 0 : 0.5, ease: "easeOut" }}
                />
              </div>

              <OnboardingChecklist steps={steps} onNavigate={navigate} />
            </div>
            
            {/* Celebration Flash overlay when complete */}
            {completedCount === 3 && (
              <motion.div 
                className="absolute inset-0 bg-success-500 z-10 mix-blend-overlay pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: prefersReduced ? 0 : 1 }}
              />
            )}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
