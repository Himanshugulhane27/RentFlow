import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  AlertCircle,
  Building2,
  UserPlus,
  Plus,
  Calendar,
  Grid3x3
} from 'lucide-react';


import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { PageTransition } from '../../components/ui/PageTransition';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { DateRangePicker } from '../../components/dashboard/DateRangePicker';
import { OccupancyChart } from '../../components/dashboard/OccupancyChart';
import { OnboardingBanner } from '../../components/onboarding/OnboardingBanner';
import { SmartSummary } from '../../components/dashboard/SmartSummary';
import { TodaysFocus } from '../../components/dashboard/TodaysFocus';
import { useStreakCounter } from '../../hooks/useStreakCounter';
import { staggerContainer, staggerItem } from '../../lib/animations';

import {
  useDashboardStats,
  useRentRollPreview,
} from './hooks/useDashboardStats';

import { formatCurrency, formatPercent, formatDate, differenceInDays } from '../../utils/format';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  const { data: rentRollPreview, isLoading: rentRollLoading } = useRentRollPreview();
  const { streakCount } = useStreakCounter();

  return (
    <PageTransition className="space-y-6 max-w-[1280px] mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--text-primary))]">Dashboard</h1>
        <DateRangePicker />
      </div>
      
      {/* ZONE 1: Smart Insight Banner */}
      {(!statsLoading && stats && (stats.totalUnits === 0 && stats.totalTenants === 0 || !localStorage.getItem('rf_onboarding_dismissed'))) && (
        <OnboardingBanner 
          propertiesCount={stats?.totalUnits || 0} 
          tenantsCount={stats?.totalTenants || 0}
          hasCollectedRent={(stats?.collectedThisMonth || 0) > 0} 
        />
      )}
      
      <SmartSummary />

      {/* ZONE 2: KPI Cards Row */}
      {statsLoading || !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
            <motion.div variants={staggerItem} layout className="relative">
              <StatCard
                label="Collected This Month"
                value={formatCurrency(stats.collectedThisMonth)}
                subtext={`of ${formatCurrency(stats.totalExpectedThisMonth)} expected`}
                trend={stats.collectedThisMonth >= stats.collectedLastMonth ? 'up' : 'down'}
                icon={<DollarSign size={20} />}
                color="blue"
                onClick={() => navigate('/payments?status=paid')}
              />
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[var(--color-surface)]">
                <div 
                  className="h-1.5 bg-brand-500 transition-all duration-700"
                  style={{ width: `${stats.collectionPercent}%` }}
                />
              </div>
            </motion.div>

            <motion.div variants={staggerItem} layout>
              <StatCard
                label="Overdue Rent"
                value={formatCurrency(stats.overdueAmount)}
                subtext={`${stats.overdueCount} tenants affected`}
                trend={stats.overdueAmount <= stats.overdueLastMonth ? 'down' : 'up'}
                icon={<AlertCircle size={20} />}
                color="red"
                onClick={() => navigate('/payments?status=overdue')}
              />
            </motion.div>

            <motion.div variants={staggerItem} layout>
              <StatCard
                label="Occupancy Rate"
                value={formatPercent(stats.occupancyRate)}
                subtext={`${stats.occupiedUnits} of ${stats.totalUnits} units`}
                trend={stats.occupancyRate >= stats.occupancyLastMonth ? 'up' : 'down'}
                icon={<Building2 size={20} />}
                color="green"
                onClick={() => navigate('/properties')}
              />
            </motion.div>

            <motion.div variants={staggerItem} layout>
              <StatCard
                label="Leases Expiring"
                value={stats.expiringLeasesCount.toString()}
                subtext="in the next 30 days"
                icon={<Calendar size={20} />}
                color="amber"
                onClick={() => navigate('/leases?filter=expiring')}
              />
            </motion.div>
        </motion.div>
      )}

      {/* ZONE 2.5: Quick Actions Row */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <Button 
          variant="primary" 
          icon={<UserPlus size={16} />} 
          onClick={() => navigate('/tenants?action=add')}
        >
          Add Tenant
        </Button>
        <Button 
          variant="secondary" 
          icon={<DollarSign size={16} />} 
          onClick={() => navigate('/payments?action=collect')}
        >
          Collect Rent
        </Button>
        <Button 
          variant="secondary" 
          icon={<Building2 size={16} />} 
          onClick={() => navigate('/properties?action=add')}
        >
          Add Property
        </Button>
        <Button 
          variant="ghost" 
          icon={<Plus size={16} />} 
          onClick={() => navigate('/leases?action=add')}
        >
          New Lease
        </Button>
      </div>

      {/* ZONE 3: Action Center + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Action Center / Todays Focus */}
        <div className="lg:col-span-2">
          <TodaysFocus />
        </div>

        <Card className="lg:col-span-1 flex flex-col p-6 min-h-[360px]">
          <div className="mb-4 flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-[hsl(var(--text-secondary))] uppercase tracking-wider">Occupancy Trend</h3>
              <p className="text-xs text-[hsl(var(--text-tertiary))] mt-1">Last 6 months</p>
            </div>
            {streakCount >= 3 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[hsl(var(--warning-light))] text-[hsl(var(--warning-dark))] border border-[hsl(var(--warning)/0.3)] text-xs font-semibold">
                🔥 {streakCount} payments on time in a row
              </span>
            )}
          </div>
          
          {statsLoading ? (
            <div className="h-40 w-full animate-pulse bg-[var(--color-surface)] rounded-[var(--radius-lg)]" />
          ) : (
            <div className="flex-1 flex flex-col">
              <OccupancyChart data={[
                { month: 'Oct', occupancy: 82 },
                { month: 'Nov', occupancy: 85 },
                { month: 'Dec', occupancy: 84 },
                { month: 'Jan', occupancy: 88 },
                { month: 'Feb', occupancy: 91 },
                { month: 'Mar', occupancy: stats?.occupancyRate || 95 },
              ]} />
              
              <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex justify-between items-end">
                <div>
                  <p className="text-sm text-[hsl(var(--text-secondary))] mb-1">Current</p>
                  <p className="text-2xl font-bold tabular-nums text-[hsl(var(--text-primary))]">
                    {stats?.occupancyRate || 0}%
                  </p>
                </div>
                {stats && stats.occupancyRate >= stats.occupancyLastMonth && (
                  <Badge variant="success" className="mb-1">+{stats.occupancyRate - stats.occupancyLastMonth}%</Badge>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* ZONE 4: Rent Roll Preview */}
      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <h3 className="text-sm font-medium text-[hsl(var(--text-secondary))] uppercase tracking-wider">Rent Roll</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/rent-roll')}>
            View Full Rent Roll →
          </Button>
        </div>

        <DataTable
          loading={rentRollLoading}
          data={rentRollPreview}
          className="border-0 rounded-none shadow-none"
          emptyState={
            <EmptyState 
              icon={<Grid3x3 size={24} />}
              title="No units found"
              description="Add a property to get started"
            />
          }
          columns={[
            {
              key: 'unit',
              header: 'Unit',
              render: (row) => (
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--text-primary))]">{row.unit}</p>
                  <p className="text-xs text-[hsl(var(--text-tertiary))]">{row.propertyName}</p>
                </div>
              )
            },
            {
              key: 'tenant',
              header: 'Tenant',
              render: (row) => row.tenantName ? (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[var(--color-surface)] text-[hsl(var(--text-secondary))] text-xs font-semibold flex items-center justify-center flex-shrink-0">
                    {row.tenantName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-[hsl(var(--text-primary))]">{row.tenantName}</span>
                </div>
              ) : (
                <span className="text-sm text-[hsl(var(--text-tertiary))] italic">Vacant</span>
              )
            },
            {
              key: 'rent',
              header: 'Monthly Rent',
              render: (row) => (
                <span className="text-sm font-medium text-[hsl(var(--text-primary))]">
                  {row.monthlyRent ? formatCurrency(row.monthlyRent) : '—'}
                </span>
              )
            },
            {
              key: 'status',
              header: 'Status',
              className: 'hidden md:table-cell',
              render: (row) => {
                const variantMap: Record<string, any> = {
                  paid: 'success',
                  overdue: 'danger', 
                  pending: 'warning',
                  vacant: 'neutral'
                };
                return (
                  <Badge variant={variantMap[row.status] || 'neutral'}>
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                  </Badge>
                );
              }
            },
            {
              key: 'leaseEnds',
              header: 'Lease Ends',
              className: 'hidden lg:table-cell',
              render: (row) => {
                if (!row.leaseEndsAt) return <span className="text-[hsl(var(--text-disabled))]">—</span>;
                const daysLeft = differenceInDays(new Date(row.leaseEndsAt), new Date());
                return (
                  <span className={`text-sm ${daysLeft < 30 ? 'text-danger-600 font-medium' : 'text-[hsl(var(--text-secondary))]'}`}>
                    {formatDate(row.leaseEndsAt)}
                  </span>
                );
              }
            },
            {
              key: 'action',
              header: '',
              render: (row) => (
                <Button variant="ghost" size="sm" onClick={() => navigate(`/tenants/${row.id}`)}>
                  View
                </Button>
              )
            }
          ]}
        />
      </Card>
    </PageTransition>
  );
};

export default DashboardPage;
