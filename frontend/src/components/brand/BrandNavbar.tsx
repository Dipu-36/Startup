import React, { useState, useEffect, useRef } from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { APP_NAME } from '../../config/appConfig';

interface BrandNavbarProps {
  activeTab?: 'dashboard' | 'campaigns' | 'create-campaign' | 'manage-campaign';
}

const BrandNavbar: React.FC<BrandNavbarProps> = ({ activeTab }) => {
  const { signOut } = useClerk();
  const { user } = useUser();
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
      await signOut();
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
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold text-gray-900">{APP_NAME}</h1>
          <nav className="flex space-x-1">
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentTab === 'dashboard' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => handleNavigation('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentTab === 'campaigns' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => handleNavigation('campaigns')}
            >
              Campaigns
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentTab === 'create-campaign' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => handleNavigation('create-campaign')}
            >
              Create Campaign
            </button>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900">{user?.fullName || user?.firstName || 'User'}</span>
            <span className="text-xs text-gray-500">{user?.emailAddresses?.[0]?.emailAddress || 'user@example.com'}</span>
          </div>
          <div className="relative" ref={dropdownRef}>
            <div 
              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium cursor-pointer hover:bg-blue-700 transition-colors"
              onClick={toggleProfileDropdown}
            >
              <span>{user?.fullName ? user.fullName.charAt(0).toUpperCase() : user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}</span>
            </div>
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex flex-col">
                    <strong className="text-sm font-medium text-gray-900">{user?.fullName || user?.firstName || 'User'}</strong>
                    <span className="text-xs text-gray-500">{user?.emailAddresses?.[0]?.emailAddress || 'user@example.com'}</span>
                  </div>
                </div>
                <div className="py-1">
                  <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-3" onClick={() => handleProfileAction('profile')}>
                    <span className="text-lg">👤</span>
                    <span className="text-sm text-gray-700">Profile Settings</span>
                  </div>
                  <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-3" onClick={() => handleProfileAction('billing')}>
                    <span className="text-lg">💳</span>
                    <span className="text-sm text-gray-700">Billing & Plans</span>
                  </div>
                  <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-3" onClick={() => handleProfileAction('notifications')}>
                    <span className="text-lg">🔔</span>
                    <span className="text-sm text-gray-700">Notifications</span>
                  </div>
                  <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-3" onClick={() => handleProfileAction('help')}>
                    <span className="text-lg">❓</span>
                    <span className="text-sm text-gray-700">Help & Support</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 py-1">
                  <div className="px-4 py-2 hover:bg-red-50 cursor-pointer flex items-center space-x-3 text-red-600" onClick={() => handleProfileAction('logout')}>
                    <span className="text-lg">🚪</span>
                    <span className="text-sm">Sign Out</span>
                  </div>
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
