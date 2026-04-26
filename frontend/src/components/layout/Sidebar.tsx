import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Grid3x3,
  Building2,
  Users,
  FileText,
  CreditCard,
  FolderOpen,
  Settings,
} from 'lucide-react';
import { cn } from '../../utils/cn';

const navItems = [
  { label: 'Overview', path: '/', icon: LayoutDashboard },
  { label: 'Rent Roll', path: '/rent-roll', icon: Grid3x3 },
  { label: 'Properties', path: '/properties', icon: Building2 },
  { label: 'Tenants', path: '/tenants', icon: Users },
  { label: 'Leases', path: '/leases', icon: FileText },
  { label: 'Payments', path: '/payments', icon: CreditCard },
  { label: 'Documents', path: '/documents', icon: FolderOpen },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="bg-white border-r border-neutral-100 fixed left-0 top-0 h-full w-60 z-40 flex flex-col">
      {/* Logo Area */}
      <div className="h-14 flex items-center px-6 border-b border-neutral-100 font-bold text-brand-600 text-lg tracking-tight">
        RentFlow
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto flex flex-col gap-1">
        <div className="px-5 mt-2 mb-1">
          <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Menu</p>
        </div>
        {navItems.map((item) => {
          const isActive = item.path === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2 mx-2 rounded-lg text-sm transition-colors duration-150',
                isActive
                  ? 'bg-brand-50 text-brand-700 font-medium'
                  : 'text-neutral-600 hover:bg-neutral-100'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-brand-600 rounded-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon size={18} strokeWidth={1.75} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
