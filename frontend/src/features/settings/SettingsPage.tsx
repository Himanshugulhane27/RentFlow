import { useState, useEffect } from 'react';
import { PageTransition } from '../../components/layout/PageTransition';
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
          <h3 className="text-sm font-semibold text-neutral-800 mb-5">
            Display Preferences
          </h3>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Currency
              </label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-input bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors duration-150"
              >
                {CURRENCIES.map(c => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-neutral-400 mt-1.5">
                Affects all currency displays across the app.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-neutral-100">
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
