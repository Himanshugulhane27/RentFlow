import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Building2, Users, FileText, CreditCard,
  AlertTriangle, TrendingUp, Calendar,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

import { dashboardApi } from '../../api/dashboard.api';
import { KPICard } from '../../components/shared/KPICard';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { KPISkeleton } from '../../components/ui/Skeleton';
import { formatCurrency, formatDate, formatRelativeDate } from '../../utils/formatters';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const DashboardPage: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardApi.getStats,
  });

  const { data: trend } = useQuery({
    queryKey: ['dashboard', 'revenue-trend'],
    queryFn: () => dashboardApi.getRevenueTrend(6),
  });

  const { data: alerts } = useQuery({
    queryKey: ['dashboard', 'alerts'],
    queryFn: dashboardApi.getAlerts,
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white font-[var(--font-heading)]">
          Dashboard
        </h1>
        <p className="text-sm text-surface-500 mt-1">
          Overview of your rental portfolio
        </p>
      </div>

      {/* KPI Cards */}
      {statsLoading ? (
        <KPISkeleton />
      ) : stats ? (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-5"
        >
          <motion.div variants={fadeUp}>
            <KPICard
              title="Total Properties"
              value={stats.totalProperties}
              icon={<Building2 size={20} />}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <KPICard
              title="Occupancy Rate"
              value={stats.occupancyRate}
              format="percent"
              icon={<TrendingUp size={20} />}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <KPICard
              title="Monthly Revenue"
              value={stats.monthlyRevenue}
              format="currency"
              change={stats.revenueGrowth}
              icon={<CreditCard size={20} />}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <KPICard
              title="Active Leases"
              value={stats.activeLeases}
              icon={<FileText size={20} />}
            />
          </motion.div>
        </motion.div>
      ) : null}

      {/* Charts + Alerts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart — 2 cols */}
        <Card className="lg:col-span-2" padding="lg">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <Badge variant="info">Last 6 months</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {trend && trend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '13px',
                      }}
                      formatter={(value) => [
                        formatCurrency(typeof value === 'number' ? value : Number(value ?? 0)),
                        'Revenue'
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#6366f1"
                      strokeWidth={2}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-surface-400 text-sm">
                  No revenue data available yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats — 1 col */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            {stats && (
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-surface-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-success-50 dark:bg-success-500/15 flex items-center justify-center">
                      <Users size={16} className="text-success-600" />
                    </div>
                    <span className="text-sm text-surface-600 dark:text-surface-300">Total Tenants</span>
                  </div>
                  <span className="text-sm font-semibold text-surface-900 dark:text-white">{stats.totalTenants}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-surface-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-warning-50 dark:bg-warning-500/15 flex items-center justify-center">
                      <Calendar size={16} className="text-warning-600" />
                    </div>
                    <span className="text-sm text-surface-600 dark:text-surface-300">Expiring Leases</span>
                  </div>
                  <span className="text-sm font-semibold text-warning-600">{stats.expiringLeases}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-surface-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-danger-50 dark:bg-danger-500/15 flex items-center justify-center">
                      <AlertTriangle size={16} className="text-danger-600" />
                    </div>
                    <span className="text-sm text-surface-600 dark:text-surface-300">Overdue Payments</span>
                  </div>
                  <span className="text-sm font-semibold text-danger-600">{stats.overduePayments}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/15 flex items-center justify-center">
                      <CreditCard size={16} className="text-primary-600" />
                    </div>
                    <span className="text-sm text-surface-600 dark:text-surface-300">Pending</span>
                  </div>
                  <span className="text-sm font-semibold text-surface-900 dark:text-white">{stats.pendingPayments}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {alerts && alerts.totalAlerts > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Expiring Leases */}
          {alerts.expiringLeases.length > 0 && (
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Expiring Soon</CardTitle>
                <Badge variant="warning">{alerts.expiringLeases.length}</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.expiringLeases.slice(0, 5).map((lease) => (
                    <div
                      key={lease._id}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-50 dark:bg-surface-800/50"
                    >
                      <div>
                        <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                          {typeof lease.propertyId === 'object' ? lease.propertyId.address : 'Property'}
                        </p>
                        <p className="text-xs text-surface-500">
                          Expires {formatRelativeDate(lease.endDate)}
                        </p>
                      </div>
                      <StatusBadge status={lease.status} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Overdue Payments */}
          {alerts.overduePayments.length > 0 && (
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Overdue Payments</CardTitle>
                <Badge variant="danger">{alerts.overduePayments.length}</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.overduePayments.slice(0, 5).map((payment) => (
                    <div
                      key={payment._id}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-50 dark:bg-surface-800/50"
                    >
                      <div>
                        <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                          {typeof payment.tenantId === 'object' ? `${payment.tenantId.firstName} ${payment.tenantId.lastName}` : 'Tenant'}
                        </p>
                        <p className="text-xs text-surface-500">
                          Due {formatDate(payment.dueDate)}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-danger-600">
                        {formatCurrency(payment.totalAmount)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
