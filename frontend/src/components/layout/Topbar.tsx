import { Search, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { NotificationCenter } from '../NotificationCenter';

const routeTitles: Record<string, string> = {
  '/': 'Overview',
  '/rent-roll': 'Rent Roll',
  '/properties': 'Properties',
  '/tenants': 'Tenants',
  '/leases': 'Leases',
  '/payments': 'Payments',
  '/documents': 'Documents',
  '/settings': 'Settings',
};

export const Topbar: React.FC = () => {
  const location = useLocation();
  const title = routeTitles[location.pathname] || 'RentFlow';

  return (
    <header className="fixed top-0 left-60 right-0 h-14 bg-[var(--color-surface-raised)]/80 backdrop-blur-sm border-b border-[var(--color-border)] z-30 flex items-center justify-between px-6">
      <div className="flex-1">
        <h1 className="text-sm font-semibold text-[hsl(var(--text-primary))]">{title}</h1>
      </div>

      <div className="flex-1 flex justify-center">
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('open-command-bar'))}
          className="flex items-center gap-2 px-3 py-1.5 w-64 bg-[var(--color-surface)] hover:border-brand-300 text-[hsl(var(--text-tertiary))] border border-[var(--color-border)] rounded-lg transition-colors text-sm cursor-pointer"
        >
          <Search size={16} />
          <span className="flex-1 text-left">Search...</span>
          <span className="text-xs bg-[var(--color-surface-raised)] px-1.5 py-0.5 rounded text-[hsl(var(--text-tertiary))] font-medium">⌘K</span>
        </button>
      </div>

      <div className="flex-1 flex justify-end items-center gap-4">
        <NotificationCenter />
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-surface)] text-[hsl(var(--text-secondary))] font-medium text-sm hover:bg-[var(--color-border)] transition-colors focus-ring">
          <User size={16} />
        </button>
      </div>
    </header>
  );
};
