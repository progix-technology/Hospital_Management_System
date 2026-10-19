import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute: Enforces JWT Token Authentication & Role-Based Access Control
 * - Redirects unauthenticated users to /login
 * - Redirects unauthorized roles to their respective dashboards
 */
export default function ProtectedRoute({ allowedRoles }) {
  const location = useLocation();
  const rawUser = localStorage.getItem('userInfo');

  let user = null;
  try {
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch (e) {
    user = null;
  }

  // 1. Missing Token / Not Logged In
  if (!user || !user.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Role Authorization Check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'doctor') {
      return <Navigate to="/doctor/dashboard" replace />;
    } else if (user.role === 'lab_technician') {
      return <Navigate to="/lab/dashboard" replace />;
    } else {
      return <Navigate to="/portal" replace />;
    }
  }

  return <Outlet />;
}
