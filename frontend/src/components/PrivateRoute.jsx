// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from '../context/AuthContext';

export default function PrivateRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuthState();
  const location = useLocation();

  if (loading) {
    console.log('[PrivateRoute] Waiting for auth to finish loading');
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    console.log('[PrivateRoute] No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log('[PrivateRoute] User role not allowed, redirecting to unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

