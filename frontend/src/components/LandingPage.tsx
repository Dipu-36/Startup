import React from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_NAME } from '../config/appConfig';
import '../styles/LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleGetStartedClick = () => {
    navigate('/signup');
  };

  const handleBookDemo = () => {
    // For now, navigate to signup
    navigate('/signup');
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-brand">
          <h2>{APP_NAME}</h2>
        </div>
        <div className="nav-links">
          <a href="#products">Products And Solutions</a>
          <a href="#about">About Us</a>
          <a href="#help">Help</a>
          <div className="nav-buttons">
            <button className="btn btn-brand-mode">BRAND MODE</button>
            <button className="btn btn-login-signup" onClick={handleLoginClick}>LOGIN / SIGN-UP</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-left">
            <div className="hero-title">
              <h1>
                Influence
                <br />
                <span className="cross-symbol">×</span>
                <br />
                <span className="opportunity-text">Opportunity</span>
              </h1>
            </div>
            <button className="get-started-btn" onClick={handleGetStartedClick}>
              GET STARTED
            </button>
          </div>

          <div className="hero-right">
            <div className="business-illustration">
              <img src="/tiny-business.png" alt="Business collaboration illustration" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="feature-card feature-smart">
            <div className="feature-icon">
              <div className="targeting-icon">📊</div>
            </div>
            <div className="feature-content">
              <h3>Smarter, Targeted Campaigns</h3>
              <p>Connect With The Right Creators, Every Time — AI-Driven Matching And Targeting To Maximize ROI And Engagement.</p>
            </div>
          </div>

          <div className="feature-card feature-trust">
            <div className="feature-icon">
              <div className="handshake-icon">🤝</div>
            </div>
            <div className="feature-content">
              <h3>Trust & Transparency Built In</h3>
              <p>Collaborate With Confidence — Trusted Insights To Ensure Quality, Reduce Risks, And Deliver On Time</p>
            </div>
          </div>

          <div className="feature-card feature-deals">
            <div className="feature-icon">
              <div className="percentage-icon">%</div>
            </div>
            <div className="feature-content">
              <h3>Fair, Hassle-Free Deals</h3>
              <p>Cut Out The Middlemen — Negotiate Directly, Protect Payments, And Build Reliable Partnerships.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Start Collaborating Smartly—Today !!</h2>
          <button className="book-demo-btn" onClick={handleBookDemo}>
            BOOK A DEMO NOW
          </button>
          
          <div className="stats-section">
            <div className="stat-item">
              <div className="stat-number">250+</div>
              <div className="stat-label">BRANDS</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">150+</div>
              <div className="stat-label">CREATORS</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">30+</div>
              <div className="stat-label">SUCCESSFUL CAMPAIGNS</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
