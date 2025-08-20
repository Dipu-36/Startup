import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { APP_NAME } from '../../config/appConfig';
import '../../styles/brand/BrandNavbar.css';

interface BrandNavbarProps {
  activeTab?: 'dashboard' | 'campaigns' | 'create-campaign' | 'manage-campaign';
}

const BrandNavbar: React.FC<BrandNavbarProps> = ({ activeTab }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-detect active tab based on current route if not provided
  const getCurrentTab = () => {
    if (activeTab) return activeTab;
    
    const path = location.pathname;
    if (path.includes('/brand/campaigns/create')) return 'create-campaign';
    if (path.includes('/brand/campaigns/manage')) return 'manage-campaign';
    if (path.includes('/brand/campaigns')) return 'campaigns';
    if (path.includes('/brand/dashboard')) return 'dashboard';
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
      case 'billing':
        console.log('Navigate to billing');
        break;
      case 'notifications':
        console.log('Navigate to notifications');
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
        navigate('/brand/dashboard');
        break;
      case 'campaigns':
        navigate('/brand/campaigns');
        break;
      case 'create-campaign':
        navigate('/brand/campaigns/create');
        break;
      case 'manage-campaign':
        // This would typically need a campaign ID
        console.log('Navigate to manage campaign');
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
    <header className="brand-dashboard-header">
      <div className="brand-header-left">
        <h1 className="brand-brand-name">{APP_NAME}</h1>
        <nav className="brand-main-nav">
          <button
            className={`brand-nav-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigation('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`brand-nav-btn ${currentTab === 'campaigns' ? 'active' : ''}`}
            onClick={() => handleNavigation('campaigns')}
          >
            Campaigns
          </button>
          <button
            className={`brand-nav-btn ${currentTab === 'create-campaign' ? 'active' : ''}`}
            onClick={() => handleNavigation('create-campaign')}
          >
            Create Campaign
          </button>
        </nav>
      </div>
      <div className="brand-header-right">
        <div className="brand-user-profile">
          <div className="brand-profile-info">
            <span className="brand-profile-name">{user?.name || 'User'}</span>
            <span className="brand-profile-email">{user?.email || 'user@example.com'}</span>
          </div>
          <div className="brand-profile-dropdown" ref={dropdownRef}>
            <div className="profile-avatar" onClick={toggleProfileDropdown}>
              <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
            </div>
            {isProfileDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <div className="dropdown-user-info">
                    <strong>{user?.name || 'User'}</strong>
                    <span>{user?.email || 'user@example.com'}</span>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item" onClick={() => handleProfileAction('profile')}>
                  <span className="dropdown-icon">👤</span>
                  Profile Settings
                </div>
                <div className="dropdown-item" onClick={() => handleProfileAction('billing')}>
                  <span className="dropdown-icon">💳</span>
                  Billing & Plans
                </div>
                <div className="dropdown-item" onClick={() => handleProfileAction('notifications')}>
                  <span className="dropdown-icon">🔔</span>
                  Notifications
                </div>
                <div className="dropdown-item" onClick={() => handleProfileAction('help')}>
                  <span className="dropdown-icon">❓</span>
                  Help & Support
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item logout-item" onClick={() => handleProfileAction('logout')}>
                  <span className="dropdown-icon">🚪</span>
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

export default BrandNavbar;
