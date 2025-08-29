import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'brand' | 'influencer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredUserType 
}) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const location = useLocation();

  // Show loading while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    // Save the attempted location for redirect after login
    return <Navigate to={`/sign-in?redirect_url=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Check user type if required
  if (requiredUserType && user) {
    const userType = user.unsafeMetadata?.userType as string;
    console.log('ProtectedRoute: checking userType:', userType, 'required:', requiredUserType);
    
    if (!userType) {
      // User type is not set, redirect to user type selection
      console.log('ProtectedRoute: userType not set, redirecting to select-user-type');
      return <Navigate to="/select-user-type" replace />;
    }
    
    if (userType !== requiredUserType) {
      // Redirect to appropriate dashboard based on user type
      const redirectPath = userType === 'brand' ? '/brand/dashboard' : '/creator/dashboard';
      console.log('ProtectedRoute: userType mismatch, redirecting to:', redirectPath);
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
