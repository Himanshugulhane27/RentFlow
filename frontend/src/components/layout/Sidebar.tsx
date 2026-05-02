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
  LogOut,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectUser, logout } from '../../store/slices/authSlice';

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
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const userInitial = user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() : '?';
  const userName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const userRole = user?.role ?? 'user';

  return (
    <aside className="bg-[var(--color-surface-raised)] border-r border-[var(--color-border)] fixed left-0 top-0 h-full w-60 z-40 flex flex-col">
      {/* Logo Area */}
      <div className="h-14 flex items-center px-5 border-b border-[var(--color-border)]">
        <span className="text-base font-bold text-[hsl(var(--text-primary))] tracking-tight">Rent<span className="text-brand-600">Flow</span></span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto flex flex-col gap-1 pb-20">
        <div className="px-4 pt-5 pb-1.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--text-tertiary))]">Menu</p>
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
                'relative flex items-center gap-3 mx-2 px-3 py-2 rounded-lg text-sm transition-colors duration-150',
                isActive
                  ? 'bg-brand-50 text-brand-700 font-medium'
                  : 'text-[hsl(var(--text-secondary))] hover:bg-[var(--color-surface)] hover:text-[hsl(var(--text-primary))]'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-600 rounded-full -ml-2"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon size={18} strokeWidth={1.75} className={isActive ? 'text-brand-600' : 'text-[hsl(var(--text-tertiary))]'} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--color-border)] bg-[var(--color-surface-raised)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-xs font-semibold text-[hsl(var(--text-secondary))] flex-shrink-0">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[hsl(var(--text-primary))] truncate">{userName}</p>
            <p className="text-xs text-[hsl(var(--text-tertiary))] capitalize truncate">{userRole}</p>
          </div>
          <button
            onClick={() => { dispatch(logout()); window.location.href = '/login'; }}
            className="p-1.5 rounded-lg text-[hsl(var(--text-tertiary))] hover:bg-[var(--color-surface)] hover:text-[hsl(var(--text-primary))] transition-colors"
            style={{ transitionDuration: 'var(--transition-fast)' }}
            title="Sign out"
          >
            <LogOut size={14} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </aside>
  );
};
