import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, CreditCard, UserPlus, Bell, FilePlus,
  Grid3x3, AlertCircle, Calendar, Building2,
} from 'lucide-react';

interface Command {
  id: string;
  group: string;
  label: string;
  icon: React.ElementType;
  shortcut: string | null;
  action: () => void;
}

export const CommandBar: React.FC = () => {
  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut to open/close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    const handleCustomEvent = () => setOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-bar', handleCustomEvent);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-bar', handleCustomEvent);
    };
  }, [open]);

  // Reset state when opened
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('');
      setHighlightedIndex(0);
      // Small timeout to allow animation to start before focusing
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const close = () => setOpen(false);

  const COMMANDS: Command[] = [
    // QUICK ACTIONS group
    {
      id: 'record-payment',
      group: 'Quick Actions',
      label: 'Record a Payment',
      icon: CreditCard,
      shortcut: null,
      action: () => { 
        navigate('/payments?action=new');
        close();
      }
    },
    {
      id: 'add-tenant',
      group: 'Quick Actions', 
      label: 'Add New Tenant',
      icon: UserPlus,
      shortcut: null,
      action: () => {
        navigate('/tenants');
        close();
      }
    },
    {
      id: 'send-reminder',
      group: 'Quick Actions',
      label: 'Send Rent Reminder',
      icon: Bell,
      shortcut: null,
      action: () => { 
        // TODO: Open reminder modal
        alert('Send Reminder dialog');
        close();
      }
    },
    {
      id: 'create-lease',
      group: 'Quick Actions',
      label: 'Create New Lease',
      icon: FilePlus,
      shortcut: null,
      action: () => {
        navigate('/leases');
        close();
      }
    },
    // NAVIGATE group
    {
      id: 'nav-rentroll',
      group: 'Navigate',
      label: 'Go to Rent Roll',
      icon: Grid3x3,
      shortcut: null,
      action: () => {
        navigate('/rent-roll');
        close();
      }
    },
    {
      id: 'nav-overdue',
      group: 'Navigate',
      label: 'View Overdue Payments',
      icon: AlertCircle,
      shortcut: null,
      action: () => {
        navigate('/payments?status=overdue');
        close();
      }
    },
    {
      id: 'nav-expiring',
      group: 'Navigate',
      label: 'Expiring Leases',
      icon: Calendar,
      shortcut: null,
      action: () => {
        navigate('/leases?filter=expiring');
        close();
      }
    },
    {
      id: 'nav-add-property',
      group: 'Navigate',
      label: 'Add New Property',
      icon: Building2,
      shortcut: null,
      action: () => {
        navigate('/properties');
        close();
      }
    },
  ];

  const filtered = query.trim() === '' 
    ? COMMANDS 
    : COMMANDS.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = [];
    acc[cmd.group].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  // Handle keyboard navigation within results
  useEffect(() => {
    const handleResultNavigation = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[highlightedIndex]) {
          filtered[highlightedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleResultNavigation);
    return () => window.removeEventListener('keydown', handleResultNavigation);
  }, [open, filtered, highlightedIndex]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={prefersReduced ? {} : { opacity: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0 }}
            className="fixed inset-0 bg-[hsl(220 20% 10% / 0.4)] backdrop-blur-sm z-[var(--z-overlay)]"
            onClick={close}
          />

          {/* Panel */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, scale: 0.96, y: -8 }}
            animate={prefersReduced ? {} : { opacity: 1, scale: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: prefersReduced ? 0 : 0.15 }}
            className="fixed top-[10%] sm:top-[20%] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] sm:w-full max-w-xl z-[var(--z-overlay)] glass-strong elevation-5 rounded-[var(--radius-xl)] overflow-hidden mx-auto"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[color-mix(in_srgb,var(--color-border)_50%,transparent)]">
              <Search size={18} className="text-[hsl(var(--text-tertiary))] flex-shrink-0"/>
              <input
                ref={inputRef}
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                placeholder="Search or type a command..."
                className="flex-1 text-base text-[hsl(var(--text-primary))] placeholder:text-[hsl(var(--text-tertiary))] bg-transparent outline-none"
              />
              <kbd className="text-xs text-[hsl(var(--text-tertiary))] bg-[var(--color-surface-subtle)] px-2 py-1 rounded-md font-mono hidden sm:block">
                esc
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto py-2 px-2">
              {Object.entries(grouped).map(([group, cmds]) => (
                <div key={group} className="mb-2">
                  <p className="text-xs font-semibold tracking-wider uppercase text-[hsl(var(--text-tertiary))] px-3 py-2">
                    {group}
                  </p>
                  <div className="space-y-0.5">
                    {cmds.map(cmd => {
                      const globalIdx = filtered.indexOf(cmd);
                      const isHighlighted = highlightedIndex === globalIdx;
                      return (
                        <motion.button
                          key={cmd.id}
                          onClick={cmd.action}
                          whileHover={prefersReduced ? undefined : { backgroundColor: "color-mix(in srgb, var(--color-surface) 50%, transparent)" }}
                          transition={{ duration: 0.15 }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-left transition-colors duration-150 ease-out ${
                            isHighlighted ? 'bg-[hsl(var(--brand-500)/0.08)] text-[hsl(var(--brand-600))]' : ''
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center flex-shrink-0 ${
                            isHighlighted ? 'bg-[hsl(var(--brand-500)/0.1)] text-[hsl(var(--brand-600))]' : 'bg-[var(--color-surface-subtle)] text-[hsl(var(--text-tertiary))]'
                          }`}>
                            <cmd.icon size={16} />
                          </div>
                          <span className={`text-sm font-medium ${
                            isHighlighted ? 'text-[hsl(var(--brand-600))]' : 'text-[hsl(var(--text-primary))]'
                          }`}>
                            {cmd.label}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="py-10 text-center flex flex-col items-center justify-center">
                  <Search size={32} className="text-[hsl(var(--text-tertiary))] mb-3 opacity-50" />
                  <p className="text-sm text-[hsl(var(--text-secondary))]">
                    No results found for "{query}"
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
