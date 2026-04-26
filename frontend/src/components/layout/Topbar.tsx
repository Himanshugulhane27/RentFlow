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
    <header className="fixed top-0 left-60 right-0 h-14 bg-white/80 backdrop-blur-sm border-b border-neutral-100 z-30 flex items-center justify-between px-8">
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-neutral-900">{title}</h1>
      </div>

      <div className="flex-1 flex justify-center">
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('open-command-bar'))}
          className="flex items-center gap-2 px-4 py-1.5 w-64 bg-neutral-100 hover:bg-neutral-200 text-neutral-500 rounded-md transition-colors text-sm"
        >
          <Search size={16} />
          <span className="flex-1 text-left">Search...</span>
          <span className="text-xs bg-white px-1.5 py-0.5 rounded text-neutral-400 font-medium">⌘K</span>
        </button>
      </div>

      <div className="flex-1 flex justify-end items-center gap-4">
        <NotificationCenter />
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-medium text-sm hover:bg-brand-200 transition-colors">
          <User size={16} />
        </button>
      </div>
    </header>
  );
};
