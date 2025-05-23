// src/components/PrivateRoute.jsx
import React from 'react';
import { useAuthState } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, roleRequired }) {
  const { user, loading } = useAuthState();

  if (loading) {
    return <div className="flex-1 flex items-center justify-center">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
}

