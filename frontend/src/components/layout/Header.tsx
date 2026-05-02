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
    <header className="h-16 bg-[var(--color-surface-raised)] border-b border-[var(--color-border)] flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="relative w-80 hidden md:block">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--text-tertiary))]"
        />
        <input
          type="text"
          placeholder="Search properties, tenants..."
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[hsl(var(--text-primary))] placeholder:text-[hsl(var(--text-tertiary))] focus-ring transition-colors"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Dark mode toggle */}
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="p-2 rounded-lg text-[hsl(var(--text-tertiary))] hover:bg-[var(--color-surface)] transition-colors focus-ring"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-[hsl(var(--text-tertiary))] hover:bg-[var(--color-surface)] transition-colors focus-ring">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[hsl(var(--danger))] rounded-full" />
        </button>

        {/* User */}
        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-[var(--color-border)]">
            <Avatar name={`${user.firstName} ${user.lastName}`} size="sm" />
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-[hsl(var(--text-primary))] leading-tight">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-[hsl(var(--text-tertiary))] capitalize">{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
