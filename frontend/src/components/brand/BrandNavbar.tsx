import React, { useState, useEffect, useRef } from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { APP_NAME } from '../../config/appConfig';

interface BrandNavbarProps {
  activeTab?: 'dashboard' | 'campaigns' | 'applications';
}

const BrandNavbar: React.FC<BrandNavbarProps> = ({ activeTab }) => {
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
    if (path.includes('/brand/applications')) return 'applications';
    if (path.includes('/manage')) return 'campaigns'; // Manage campaign pages highlight campaigns tab
    if (path.includes('/brand/campaigns')) return 'campaigns';
    if (path.includes('/brand/dashboard')) return 'dashboard';
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
    setIsMobileMenuOpen(false); // Close mobile menu when navigating
    switch (tab) {
      case 'dashboard':
        navigate('/brand/dashboard');
        break;
      case 'campaigns':
        navigate('/brand/campaigns');
        break;
      case 'applications':
        navigate('/brand/applications');
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close profile dropdown if clicking outside of it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      // Close mobile menu if clicking outside of it
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
      if (window.innerWidth >= 768) { // md breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Header Left */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl sm:text-2xl font-bold text-primary hover:scale-105 transition-transform duration-300 cursor-default tracking-tight">
              {APP_NAME}
            </h1>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4">
              <button
                onClick={() => handleNavigation('dashboard')}
                className={`px-6 py-3 rounded-lg font-medium transform hover:scale-105 transition-all duration-200 ${
                  currentTab === 'dashboard'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-md'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavigation('campaigns')}
                className={`px-6 py-3 rounded-lg font-medium transform hover:scale-105 transition-all duration-200 ${
                  currentTab === 'campaigns'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-md'
                }`}
              >
                Campaigns
              </button>
              <button
                onClick={() => handleNavigation('applications')}
                className={`px-6 py-3 rounded-lg font-medium transform hover:scale-105 transition-all duration-200 ${
                  currentTab === 'applications'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-md'
                }`}
              >
                Applications
              </button>
            </nav>
          </div>

          {/* Header Right */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted/50 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {/* User Profile */}
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground">{user?.fullName || user?.firstName || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress || 'user@example.com'}</p>
                </div>
                <button
                  onClick={toggleProfileDropdown}
                  className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground font-semibold hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                </button>
              </div>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-xl py-2 animate-dropdown">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="font-medium text-foreground">{user?.fullName || user?.firstName || 'User'}</p>
                    <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress || 'user@example.com'}</p>
                  </div>
                  
                  {[
                    { icon: <User className="w-4 h-4" />, label: 'Profile Settings', action: 'profile' },
                    { icon: <CreditCard className="w-4 h-4" />, label: 'Billing & Plans', action: 'billing' },
                    { icon: <Bell className="w-4 h-4" />, label: 'Notifications', action: 'notifications' },
                    { icon: <HelpCircle className="w-4 h-4" />, label: 'Help & Support', action: 'help' },
                  ].map((item) => (
                    <button
                      key={item.action}
                      className="w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-muted/50 transition-colors duration-200"
                      onClick={() => handleProfileAction(item.action)}
                    >
                      <span className="text-muted-foreground">{item.icon}</span>
                      <span className="text-sm text-foreground">{item.label}</span>
                    </button>
                  ))}
                  
                  <div className="border-t border-border mt-2 pt-2">
                    <button
                      className="w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-destructive/10 text-destructive transition-colors duration-200"
                      onClick={() => handleProfileAction('logout')}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div ref={mobileMenuRef} className="md:hidden mt-4 pb-4 border-t border-border pt-4 animate-dropdown">
            <nav className="flex flex-col space-y-2">
              <button
                onClick={() => handleNavigation('dashboard')}
                className={`px-4 py-3 rounded-lg font-medium text-left transition-all duration-200 ${
                  currentTab === 'dashboard'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavigation('campaigns')}
                className={`px-4 py-3 rounded-lg font-medium text-left transition-all duration-200 ${
                  currentTab === 'campaigns'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                Campaigns
              </button>
              <button
                onClick={() => handleNavigation('applications')}
                className={`px-4 py-3 rounded-lg font-medium text-left transition-all duration-200 ${
                  currentTab === 'applications'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                Applications
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default BrandNavbar;
