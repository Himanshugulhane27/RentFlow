import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute, GuestRoute } from './components/layout/AuthGuard';

// ─── Lazy loaded pages ──────────────────────────────────────
const LoginPage = React.lazy(() => import('./features/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./features/auth/RegisterPage'));
const DashboardPage = React.lazy(() => import('./features/dashboard/DashboardPage'));
const PropertiesPage = React.lazy(() => import('./features/properties/PropertiesPage'));
const TenantsPage = React.lazy(() => import('./features/tenants/TenantsPage'));
const LeasesPage = React.lazy(() => import('./features/leases/LeasesPage'));
const PaymentsPage = React.lazy(() => import('./features/payments/PaymentsPage'));

// ─── Suspense Wrapper ───────────────────────────────────────
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <React.Suspense
    fallback={
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
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
    children: [
      {
        element: <MainLayout />,
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
        ],
      },
    ],
  },

  // 404 catch-all
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-surface-300 dark:text-surface-700 mb-4">404</h1>
          <p className="text-surface-600 dark:text-surface-400 mb-6">Page not found</p>
          <a href="/" className="text-primary-600 hover:underline text-sm">Back to Dashboard</a>
        </div>
      </div>
    ),
  },
]);

// ─── Export ─────────────────────────────────────────────────
const AppRouter: React.FC = () => <RouterProvider router={router} />;

export default AppRouter;
