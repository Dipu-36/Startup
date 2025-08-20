import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { APP_NAME } from '../../config/appConfig';
import '../../styles/creator/CreatorNavbar.css';

interface CreatorNavbarProps {
  activeTab?: 'dashboard' | 'campaigns' | 'applications' | 'content';
}

const CreatorNavbar: React.FC<CreatorNavbarProps> = ({ activeTab }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-detect active tab based on current route if not provided
  const getCurrentTab = () => {
    if (activeTab) return activeTab;
    
    const path = location.pathname;
    if (path.includes('/creator/campaigns')) return 'campaigns';
    if (path.includes('/creator/applications')) return 'applications';
    if (path.includes('/creator/content')) return 'content';
    if (path.includes('/creator/dashboard')) return 'dashboard';
    return 'dashboard';
  };

  const currentTab = getCurrentTab();

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleProfileAction = (action: string) => {
    setIsProfileDropdownOpen(false);
    switch (action) {
      case 'profile':
        console.log('Navigate to profile settings');
        break;
      case 'portfolio':
        console.log('Navigate to portfolio');
        break;
      case 'earnings':
        console.log('Navigate to earnings');
        break;
      case 'help':
        console.log('Navigate to help');
        break;
      case 'logout':
        handleLogout();
        break;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavigation = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        navigate('/creator/dashboard');
        break;
      case 'campaigns':
        navigate('/creator/campaigns');
        break;
      case 'applications':
        navigate('/creator/applications');
        break;
      case 'content':
        navigate('/creator/content');
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="creator-dashboard-header">
      <div className="creator-header-left">
        <h1 className="creator-brand-name">{APP_NAME}</h1>
        <nav className="creator-main-nav">
          <button
            className={`creator-nav-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigation('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`creator-nav-btn ${currentTab === 'campaigns' ? 'active' : ''}`}
            onClick={() => handleNavigation('campaigns')}
          >
            Campaigns
          </button>
          <button
            className={`creator-nav-btn ${currentTab === 'applications' ? 'active' : ''}`}
            onClick={() => handleNavigation('applications')}
          >
            Applications
          </button>
          <button
            className={`creator-nav-btn ${currentTab === 'content' ? 'active' : ''}`}
            onClick={() => handleNavigation('content')}
          >
            Content
          </button>
        </nav>
      </div>
      <div className="creator-header-right">
        <div className="creator-user-profile">
          <div className="creator-profile-info">
            <span className="creator-profile-name">{user?.name || 'creator1'}</span>
            <span className="creator-profile-email">{user?.email || 'creator1@gmail.com'}</span>
          </div>
          <div className="creator-profile-dropdown" ref={dropdownRef}>
            <div className="creator-profile-avatar" onClick={toggleProfileDropdown}>
              <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'C'}</span>
            </div>
            {isProfileDropdownOpen && (
              <div className="creator-dropdown-menu">
                <div className="creator-dropdown-header">
                  <div className="creator-dropdown-user-info">
                    <strong>{user?.name || 'creator1'}</strong>
                    <span>{user?.email || 'creator1@gmail.com'}</span>
                  </div>
                </div>
                <div className="creator-dropdown-divider"></div>
                <div className="creator-dropdown-item" onClick={() => handleProfileAction('profile')}>
                  <span className="creator-dropdown-icon">👤</span>
                  Profile Settings
                </div>
                <div className="creator-dropdown-item" onClick={() => handleProfileAction('portfolio')}>
                  <span className="creator-dropdown-icon">🎨</span>
                  Portfolio
                </div>
                <div className="creator-dropdown-item" onClick={() => handleProfileAction('earnings')}>
                  <span className="creator-dropdown-icon">💰</span>
                  Earnings
                </div>
                <div className="creator-dropdown-item" onClick={() => handleProfileAction('help')}>
                  <span className="creator-dropdown-icon">❓</span>
                  Help & Support
                </div>
                <div className="creator-dropdown-divider"></div>
                <div className="creator-dropdown-item creator-logout-item" onClick={() => handleProfileAction('logout')}>
                  <span className="creator-dropdown-icon">🚪</span>
                  Sign Out
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default CreatorNavbar;
