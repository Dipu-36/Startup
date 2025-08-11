import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleGetStartedClick = () => {
    navigate('/signup');
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-brand">
          <h2>SponsorConnect</h2>
        </div>
        <div className="nav-links">
          <a href="#home">HOME</a>
          <a href="#services">SERVICES</a>
          <a href="#about">ABOUT</a>
          <div className="nav-buttons">
            <button className="btn btn-login" onClick={handleLoginClick}>LOGIN</button>
            <button className="btn btn-get-started" onClick={handleGetStartedClick}>GET STARTED</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-left">
          <div className="hero-text">
            <h1 className="hero-title">
              CONNECTING BRANDS TO THEIR
              <br />
              CUSTOMERS THROUGH
            </h1>
            <h1 className="hero-highlight">
              PEOPLE THEY
              <br />
              <span className="trust-text">TRUST</span>
            </h1>
            <button className="get-started-main-btn" onClick={handleGetStartedClick}>GET STARTED</button>
          </div>
        </div>

        <div className="content-right">
          <div className="phone-mockup">
            <div className="phone-frame">
              <div className="phone-screen">
                <div className="post-preview">
                  <div className="profile-section">
                    <div className="profile-pic"></div>
                    <div className="post-actions">
                      <span>♡</span>
                      <span>💬</span>
                      <span>📤</span>
                      <span>🔖</span>
                    </div>
                  </div>
                  <div className="post-image">
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(45deg, #fd79a8, #fdcb6e)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      CREATOR POST
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="car-image">
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(45deg, #74b9ff, #0984e3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              BRAND COLLAB
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        {/* <div className="bg-dots bg-dots-1"></div>
        <div className="bg-dots bg-dots-2"></div>
        <div className="bg-dots bg-dots-3"></div>
        <div className="bg-dots bg-dots-4"></div>
        <div className="bg-dots bg-dots-5"></div>
        <div className="bg-dots bg-dots-6"></div>
        <div className="bg-dots bg-dots-7"></div>
        <div className="bg-dots bg-dots-8"></div> */}
      </main>
    </div>
  );
};

export default LandingPage;
