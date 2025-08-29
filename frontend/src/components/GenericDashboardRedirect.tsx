import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GenericDashboardRedirect: React.FC = () => {
  const { user } = useAuth();
  
  // Redirect based on user type
  if (user?.userType === 'brand') {
    return <Navigate to="/brand/dashboard" replace />;
  } else if (user?.userType === 'influencer') {
    return <Navigate to="/creator/dashboard" replace />;
  }
  
  // Default fallback to brand dashboard
  return <Navigate to="/brand/dashboard" replace />;
};

export default GenericDashboardRedirect;
