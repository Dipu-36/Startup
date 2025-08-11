import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './styles/App.css';
import { LandingPage, LoginPage, SignupPage, BrandDashboard, ProtectedRoute, CreateCampaign } from './components';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Generic dashboard - redirects based on user type */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <BrandDashboard />
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
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
