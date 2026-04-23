import React from 'react';
import { Search, Bell, Moon, Sun } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleDarkMode } from '../../store/slices/uiSlice';
import { selectUser } from '../../store/slices/authSlice';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isDark = useAppSelector((s) => s.ui.isDarkMode);

  return (
    <header className="h-16 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="relative w-80 hidden md:block">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"
        />
        <input
          type="text"
          placeholder="Search properties, tenants..."
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Dark mode toggle */}
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
        </button>

        {/* User */}
        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-surface-200 dark:border-surface-700">
            <Avatar name={`${user.firstName} ${user.lastName}`} size="sm" />
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-surface-900 dark:text-surface-100 leading-tight">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-surface-500 capitalize">{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
