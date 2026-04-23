import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

/**
 * Protects routes that require authentication.
 * Redirects to /login if no valid token exists.
 */
export const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

/**
 * Redirects authenticated users away from auth pages (login/register).
 */
export const GuestRoute: React.FC = () => {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
