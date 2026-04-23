import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Building2, Users, FileText,
  CreditCard, Settings, ChevronLeft, ChevronRight,
  LogOut,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSidebarCollapsed } from '../../store/slices/uiSlice';
import { logout, selectUser } from '../../store/slices/authSlice';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
  { label: 'Properties', path: '/properties', icon: <Building2 size={20} /> },
  { label: 'Tenants', path: '/tenants', icon: <Users size={20} /> },
  { label: 'Leases', path: '/leases', icon: <FileText size={20} /> },
  { label: 'Payments', path: '/payments', icon: <CreditCard size={20} /> },
  { label: 'Settings', path: '/settings', icon: <Settings size={20} />, roles: ['admin'] },
];

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
  const user = useAppSelector(selectUser);
  const location = useLocation();

  const filteredNav = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 z-40 flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-surface-200 dark:border-surface-800">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">R</span>
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="ml-3 text-lg font-bold text-surface-900 dark:text-white font-[var(--font-heading)]"
          >
            RentFlow
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => {
          const isActive = item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-400'
                  : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-200',
                collapsed && 'justify-center px-0'
              )}
              title={collapsed ? item.label : undefined}
              aria-label={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary-600 rounded-r-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer: collapse toggle + logout */}
      <div className="border-t border-surface-200 dark:border-surface-800 p-3 space-y-1">
        <button
          onClick={() => dispatch(logout())}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-surface-500 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors',
            collapsed && 'justify-center px-0'
          )}
          title="Logout"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>

        <button
          onClick={() => dispatch(toggleSidebarCollapsed())}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-xs text-surface-400 hover:text-surface-600 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors',
            collapsed && 'justify-center px-0'
          )}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
};
