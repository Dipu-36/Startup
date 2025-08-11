import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import { LandingPage, LoginPage, SignupPage, BrandDashboard } from './components';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/brand/dashboard" element={<BrandDashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
