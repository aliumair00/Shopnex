import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children, requireAdmin }) => {
  const location = useLocation();
  const userToken = localStorage.getItem('userToken');
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  // Debug information
  console.log('ProtectedRoute - User Token:', userToken ? 'exists' : 'missing');
  console.log('ProtectedRoute - User Info:', userInfo);
  console.log('ProtectedRoute - User Role:', userInfo?.role);
  console.log('ProtectedRoute - Require Admin:', requireAdmin);

  if (!userToken) {
    console.log('ProtectedRoute - Redirecting to login: No token');
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && userInfo?.role !== 'admin') {
    console.log('ProtectedRoute - Redirecting to home: Not admin');
    // Redirect to home if not admin
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute - Access granted');
  return children;
};

export const AuthRoute = ({ children }) => {
  const userToken = localStorage.getItem('userToken');
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  if (userToken) {
    // Redirect to previous location or home if already authenticated
    return <Navigate to={from} replace />;
  }

  return children;
};