import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LandingPage, LoginPage, SignupPage, BrandDashboard, ProtectedRoute, CreateCampaign } from './components';

function App() {
  return (
    <div className="min-h-screen">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
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
      </AuthProvider>
    </div>
  );
}

export default App;
