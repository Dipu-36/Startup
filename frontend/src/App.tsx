import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { CLERK_PUBLISHABLE_KEY, clerkAppearance } from './config/clerk';
import { 
  LandingPage, 
  BrandDashboard, 
  ProtectedRoute, 
  CreateCampaign,
  Campaigns,
  ManageCampaign,
  UserTypeSelection
} from './components';
import GenericDashboardRedirect from './components/GenericDashboardRedirect';
import CreatorDashboard from './components/creator/CreatorDashboard';

function App() {
  return (
    <div className="min-h-screen">
      <ClerkProvider 
        publishableKey={CLERK_PUBLISHABLE_KEY}
        appearance={clerkAppearance}
      >
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            {/* User Type Selection - for new users */}
            <Route path="/select-user-type" element={
              <ProtectedRoute>
                <UserTypeSelection />
              </ProtectedRoute>
            } />
            
            {/* Generic dashboard - redirects based on user type */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <GenericDashboardRedirect />
              </ProtectedRoute>
            } />
            
            {/* Brand-specific dashboard - only for brand users */}
            <Route path="/brand/dashboard" element={
              <ProtectedRoute requiredUserType="brand">
                <BrandDashboard />
              </ProtectedRoute>
            } />

            {/* Create Campaign - only for brand users */}
            <Route path="/brand/create-campaign" element={
              <ProtectedRoute requiredUserType="brand">
                <CreateCampaign />
              </ProtectedRoute>
            } />

            {/* Campaigns Page - only for brand users */}
            <Route path="/brand/campaigns" element={
              <ProtectedRoute requiredUserType="brand">
                <Campaigns />
              </ProtectedRoute>
            } />

            {/* Manage Campaign - only for brand users */}
            <Route path="/brand/campaigns/:campaignId/manage" element={
              <ProtectedRoute requiredUserType="brand">
                <ManageCampaign />
              </ProtectedRoute>
            } />

            {/* Creator Dashboard - only for creator users */}
            <Route path="/creator/dashboard" element={
              <ProtectedRoute requiredUserType="influencer">
                <CreatorDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </ClerkProvider>
    </div>
  );
}

export default App;
