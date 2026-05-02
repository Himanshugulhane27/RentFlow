import React from 'react';
import { createBrowserRouter, RouterProvider, useRouteError } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute, GuestRoute } from './components/layout/AuthGuard';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

function RouteErrorBoundary() {
  const error = useRouteError() as Error;
  return (
    <div className="min-h-screen bg-[var(--color-page-bg)] p-6">
      <ErrorBoundary>
        {/* We throw the error so the class ErrorBoundary can catch and render it */}
        <ThrowError error={error} />
      </ErrorBoundary>
    </div>
  );
}

function ThrowError({ error }: { error: Error }): React.ReactNode {
  throw error;
}

// ─── Lazy loaded pages ──────────────────────────────────────
const LoginPage = React.lazy(() => import('./features/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./features/auth/RegisterPage'));
const DashboardPage = React.lazy(() => import('./features/dashboard/DashboardPage'));
const PropertiesPage = React.lazy(() => import('./features/properties/PropertiesPage'));
const TenantsPage = React.lazy(() => import('./features/tenants/TenantsPage'));
const LeasesPage = React.lazy(() => import('./features/leases/LeasesPage'));
const PaymentsPage = React.lazy(() => import('./features/payments/PaymentsPage'));
const RentRollPage = React.lazy(() => import('./features/rent-roll/RentRollPage'));

const ComingSoonPage = React.lazy(() => import('./features/placeholder/ComingSoonPage'));

// ─── Suspense Wrapper ───────────────────────────────────────
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <React.Suspense
    fallback={
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    }
  >
    {children}
  </React.Suspense>
);

// ─── Router Definition ──────────────────────────────────────
const router = createBrowserRouter([
  // Guest routes (login / register)
  {
    element: <GuestRoute />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: '/login',
        element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
      },
      {
        path: '/register',
        element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper>,
      },
    ],
  },

  // Protected routes (dashboard shell)
  {
    element: <ProtectedRoute />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: '/',
            element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper>,
          },
          {
            path: '/properties',
            element: <SuspenseWrapper><PropertiesPage /></SuspenseWrapper>,
          },
          {
            path: '/rent-roll',
            element: <SuspenseWrapper><RentRollPage /></SuspenseWrapper>,
          },
          {
            path: '/tenants',
            element: <SuspenseWrapper><TenantsPage /></SuspenseWrapper>,
          },
          {
            path: '/leases',
            element: <SuspenseWrapper><LeasesPage /></SuspenseWrapper>,
          },
          {
            path: '/payments',
            element: <SuspenseWrapper><PaymentsPage /></SuspenseWrapper>,
          },
          {
            path: '/documents',
            element: <SuspenseWrapper><ComingSoonPage title="Documents" /></SuspenseWrapper>,
          },
          {
            path: '/settings',
            element: <SuspenseWrapper><ComingSoonPage title="Settings" /></SuspenseWrapper>,
          },
        ],
      },
    ],
  },

  // 404 catch-all
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-page-bg)]">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-[hsl(var(--text-disabled))] mb-4">404</h1>
          <p className="text-[hsl(var(--text-secondary))] mb-6">Page not found</p>
          <a href="/" className="text-brand-600 hover:underline text-sm">Back to Dashboard</a>
        </div>
      </div>
    ),
  },
]);

// ─── Export ─────────────────────────────────────────────────
const AppRouter: React.FC = () => <RouterProvider router={router} />;

export default AppRouter;
