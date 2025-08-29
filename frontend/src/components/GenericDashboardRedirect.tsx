import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const GenericDashboardRedirect: React.FC = () => {
  const { user } = useUser();
  
  // Redirect based on user type stored in Clerk metadata
  const userType = user?.unsafeMetadata?.userType as string;
  console.log('GenericDashboardRedirect: userType:', userType, 'user metadata:', user?.unsafeMetadata);
  
  if (userType === 'brand') {
    console.log('GenericDashboardRedirect: redirecting to brand dashboard');
    return <Navigate to="/brand/dashboard" replace />;
  } else if (userType === 'influencer') {
    console.log('GenericDashboardRedirect: redirecting to creator dashboard');
    return <Navigate to="/creator/dashboard" replace />;
  }
  
  // If no user type is set, redirect to user type selection
  console.log('GenericDashboardRedirect: no userType, redirecting to select-user-type');
  return <Navigate to="/select-user-type" replace />;
};

export default GenericDashboardRedirect;
