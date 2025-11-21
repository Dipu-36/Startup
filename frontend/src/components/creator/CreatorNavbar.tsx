import React, { useState, useEffect, useRef } from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, Palette, DollarSign, HelpCircle, LogOut } from 'lucide-react';
import { APP_NAME } from '../../config/appConfig';

interface CreatorNavbarProps {
  activeTab?: 'dashboard' | 'campaigns' | 'applications' | 'content';
}

const CreatorNavbar: React.FC<CreatorNavbarProps> = ({ activeTab }) => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavigation = (tab: string) => {
    setIsMobileMenuOpen(false);
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

  // Close dropdown and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Header Left */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-default tracking-tight">
              {APP_NAME}
            </h1>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4">
              <button
                onClick={() => handleNavigation('dashboard')}
                className={`px-6 py-3 rounded-lg font-medium transform hover:scale-105 transition-all duration-200 ${
                  currentTab === 'dashboard'
                    ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 hover:shadow-md'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavigation('campaigns')}
                className={`px-6 py-3 rounded-lg font-medium transform hover:scale-105 transition-all duration-200 ${
                  currentTab === 'campaigns'
                    ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 hover:shadow-md'
                }`}
              >
                Campaigns
              </button>
              <button
                onClick={() => handleNavigation('applications')}
                className={`px-6 py-3 rounded-lg font-medium transform hover:scale-105 transition-all duration-200 ${
                  currentTab === 'applications'
                    ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 hover:shadow-md'
                }`}
              >
                Applications
              </button>
              <button
                onClick={() => handleNavigation('content')}
                className={`px-6 py-3 rounded-lg font-medium transform hover:scale-105 transition-all duration-200 ${
                  currentTab === 'content'
                    ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 hover:shadow-md'
                }`}
              >
                Content
              </button>
            </nav>
          </div>

          {/* Header Right */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100/50 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-900" />
              ) : (
                <Menu className="w-5 h-5 text-gray-900" />
              )}
            </button>

            {/* User Profile */}
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.fullName || user?.firstName || 'Creator'}</p>
                  <p className="text-xs text-gray-600">{user?.primaryEmailAddress?.emailAddress || 'creator@example.com'}</p>
                </div>
                <button
                  onClick={toggleProfileDropdown}
                  className="w-10 h-10 bg-gradient-to-br from-purple-600 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'C'}
                </button>
              </div>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl py-2 animate-in slide-in-from-top-5 duration-200">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="font-medium text-gray-900">{user?.fullName || user?.firstName || 'Creator'}</p>
                    <p className="text-sm text-gray-600">{user?.primaryEmailAddress?.emailAddress || 'creator@example.com'}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => handleProfileAction('profile')}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile Settings
                    </button>
                    <button
                      onClick={() => handleProfileAction('portfolio')}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                    >
                      <Palette className="w-4 h-4 mr-3" />
                      Portfolio
                    </button>
                    <button
                      onClick={() => handleProfileAction('earnings')}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                    >
                      <DollarSign className="w-4 h-4 mr-3" />
                      Earnings
                    </button>
                    <button
                      onClick={() => handleProfileAction('help')}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                    >
                      <HelpCircle className="w-4 h-4 mr-3" />
                      Help & Support
                    </button>
                  </div>
                  <div className="border-t border-gray-200 mt-1 pt-1">
                    <button
                      onClick={() => handleProfileAction('logout')}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4" ref={mobileMenuRef}>
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-lg animate-in slide-in-from-top-5 duration-200">
              <nav className="space-y-2">
                <button
                  onClick={() => handleNavigation('dashboard')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    currentTab === 'dashboard'
                      ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavigation('campaigns')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    currentTab === 'campaigns'
                      ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  Campaigns
                </button>
                <button
                  onClick={() => handleNavigation('applications')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    currentTab === 'applications'
                      ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  Applications
                </button>
                <button
                  onClick={() => handleNavigation('content')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    currentTab === 'content'
                      ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  Content
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default CreatorNavbar;
