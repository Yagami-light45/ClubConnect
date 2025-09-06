// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from './LoginForm';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser } = useAuth();

  // If user is not logged in, show login form
  if (!currentUser) {
    return <LoginForm />;
  }

  // If roles are specified and user doesn't have required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;