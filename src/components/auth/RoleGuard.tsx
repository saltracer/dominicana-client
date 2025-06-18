
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';

interface RoleGuardProps {
  children: JSX.Element;
  requiredRole: UserRole;
  fallbackPath?: string;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  requiredRole, 
  fallbackPath = "/auth" 
}) => {
  const { user, loading, userRole } = useAuth();
  const location = useLocation();

  // Free access doesn't require authentication - return children immediately
  if (requiredRole === 'free') {
    return children;
  }

  // For all other roles, wait for loading to complete
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading authorization status...</div>
      </div>
    );
  }

  // For authenticated or higher roles, check if user is logged in
  if (!user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  const roleHierarchy: Record<UserRole, number> = {
    'free': 0,
    'authenticated': 1,
    'subscribed': 2,
    'admin': 3
  };

  const hasRequiredRole = roleHierarchy[userRole] >= roleHierarchy[requiredRole];

  // Check if user has the required role
  if (!hasRequiredRole) {
    // For authenticated users without subscription
    if (user && requiredRole === 'subscribed') {
      return <Navigate to="/subscription" state={{ from: location }} replace />;
    }
    
    // For any other role mismatch
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
};

export default RoleGuard;
