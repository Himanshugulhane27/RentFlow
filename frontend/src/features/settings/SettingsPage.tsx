import { useState, useEffect } from 'react';
import { PageTransition } from '../../components/ui/PageTransition';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

const CURRENCIES = [
  { value: 'INR', label: '₹ Indian Rupee (INR)' },
  { value: 'USD', label: '$ US Dollar (USD)' },
  { value: 'GBP', label: '£ British Pound (GBP)' },
  { value: 'AED', label: 'د.إ UAE Dirham (AED)' },
];

export default function SettingsPage() {
  const [currency, setCurrency] = useState(
    () => localStorage.getItem('rentflow_currency') ?? 'INR'
  );

  useEffect(() => {
    document.title = 'Settings | RentFlow';
  }, []);

  const handleSave = () => {
    localStorage.setItem('rentflow_currency', currency);
    toast.success('Preferences saved');
    window.location.reload(); // Quick refresh to apply currency site-wide easily
  };

  return (
    <PageTransition>
      <div className="max-w-2xl space-y-6">
        <PageHeader
          title="Settings"
          subtitle="Configure your workspace preferences"
        />

        <Card>
          <h3 className="text-sm font-semibold text-[hsl(var(--text-primary))] mb-5">
            Display Preferences
          </h3>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--text-primary))] mb-1.5">
                Currency
              </label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-input bg-[var(--color-surface-raised)] text-[hsl(var(--text-primary))] focus-ring hover:border-brand-300 transition-colors duration-150"
              >
                {CURRENCIES.map(c => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[hsl(var(--text-tertiary))] mt-1.5">
                Affects all currency displays across the app.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[var(--color-border)]">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
            >
              Save Preferences
            </Button>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
