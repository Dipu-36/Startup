import React, { useState, useEffect, useRef } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { APP_NAME } from '../../config/appConfig';
import { 
  Plus, 
  Rocket, 
  Clock, 
  CheckCircle, 
  User, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface Campaign {
  id: string;
  brandId: string;
  brandName: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  campaignType: string;
  targetAudience: {
    location: string;
    ageGroup: string;
    gender: string;
    interests: string;
  };
  platforms: string[];
  minRequirements: {
    followersCount: string;
    engagementRate: string;
    contentStyle: string;
    languages: string[];
  };
  nicheMatch: boolean;
  geographicRestrictions: string;
  contentFormat: string[];
  numberOfPosts: string;
  contentGuidelines: string;
  approvalRequired: boolean;
  compensationType: string;
  paymentAmount: string;
  productDetails: string;
  bannerImageUrl: string;
  referenceLinks: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  applicants: number;
  createdAt: string;
  updatedAt: string;
}

interface Application {
  id: string;
  campaignId?: string;
  creatorId?: string;
  creatorName: string;
  creatorEmail: string;
  followers: string;
  platform: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  campaignName: string;
  createdAt?: string;
  updatedAt?: string;
}

const BrandDashboard = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'campaigns' | 'applications'>('dashboard');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch campaigns from API
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view campaigns');
          return;
        }

        const response = await fetch('http://localhost:8080/api/campaigns', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch campaigns');
        }

        const campaignsData = await response.json();
        setCampaigns(campaignsData || []);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setError('Failed to load campaigns');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Fetch applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view applications');
          return;
        }

        const response = await fetch('http://localhost:8080/api/applications', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }

        const applicationsData = await response.json();
        setApplications(applicationsData || []);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to load applications');
      }
    };

    fetchApplications();
  }, []);

  const handleCreateCampaign = () => {
    navigate('/brand/create-campaign');
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  const handleProfileAction = (action: string) => {
    console.log(`Profile action: ${action}`);
    setIsProfileDropdownOpen(false);
  };

  // Close dropdown and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close profile dropdown if clicking outside of it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      // Close mobile menu if clicking outside of it (but not when clicking mobile nav buttons)
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Header Left */}
            <div className="flex items-center space-x-4">
              <h1 className="text-xl sm:text-2xl font-display font-bold text-primary hover:scale-105 transition-transform duration-300 cursor-default tracking-tight">
                {APP_NAME}
              </h1>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-4">
                {(['dashboard', 'campaigns', 'applications'] as const).map((tab) => (
                  <button
                    key={tab}
                    className={`px-6 py-3 rounded-lg font-medium transform hover:scale-105 transition-all duration-200 ${
                      activeTab === tab
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-md'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
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
                  <X className="w-5 h-5 text-foreground" />
                ) : (
                  <Menu className="w-5 h-5 text-foreground" />
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
                        <span>{item.icon}</span>
                        <span className="text-sm text-foreground">{item.label}</span>
                      </button>
                    ))}
                    
                    <div className="border-t border-border mt-2 pt-2">
                      <button
                        className="w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-destructive/10 text-destructive transition-colors duration-200"
                        onClick={handleLogout}
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
                {(['dashboard', 'campaigns', 'applications'] as const).map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-3 rounded-lg font-medium text-left transition-all duration-200 ${
                      activeTab === tab
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                    onClick={() => {
                      console.log(`Mobile tab clicked: ${tab}`);
                      setActiveTab(tab);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 py-6 sm:py-8">
        {/* Content Based on Active Tab */}
        <div>
          {activeTab === 'dashboard' && (
            <>
              {/* Welcome Section */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2 tracking-tight">
                  Welcome back, {user?.fullName || user?.firstName || 'Brand'}! 👋
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Here's what's happening with your campaigns today.
                </p>
              </div>

              {/* Quick Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
                {[
                  {
                    id: 'create',
                    icon: <Plus className="w-6 h-6" />,
                    title: 'Create',
                    subtitle: 'Campaign',
                    value: 'New',
                    color: 'from-blue-500 to-blue-600',
                    action: handleCreateCampaign
                  },
                  {
                    id: 'active',
                    icon: <Rocket className="w-6 h-6" />,
                    title: 'Active',
                    subtitle: 'Campaigns',
                    value: campaigns.filter(c => c.status === 'active').length,
                    color: 'from-green-500 to-green-600'
                  },
                  {
                    id: 'pending',
                    icon: <Clock className="w-6 h-6" />,
                    title: 'Pending',
                    subtitle: 'Applications',
                    value: applications.filter(a => a.status === 'pending').length,
                    color: 'from-yellow-500 to-yellow-600'
                  },
                  {
                    id: 'approved',
                    icon: <CheckCircle className="w-6 h-6" />,
                    title: 'Approved',
                    subtitle: 'Applications',
                    value: applications.filter(a => a.status === 'approved').length,
                    color: 'from-purple-500 to-purple-600'
                  }
                ].map((stat, index) => (
                  <div
                    key={stat.id}
                    className={`bg-card/50 backdrop-blur-sm border border-border rounded-xl p-3 sm:p-4 md:p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:bg-card/70 group ${
                      hoveredCard === stat.id ? 'ring-2 ring-primary/20' : ''
                    }`}
                    onMouseEnter={() => setHoveredCard(stat.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={stat.action}
                  >
                    {/* Mobile Layout (2x2 grid) */}
                    <div className="md:hidden flex flex-col items-center text-center space-y-2">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 [&>svg]:w-4 [&>svg]:h-4`}>
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          {stat.value}
                        </p>
                        <p className="text-xs text-muted-foreground leading-tight">{stat.title}</p>
                        <p className="text-xs text-muted-foreground leading-tight">{stat.subtitle}</p>
                      </div>
                      <div className={`w-full h-1 bg-gradient-to-r ${stat.color} rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
                    </div>

                    {/* Desktop Layout (horizontal) */}
                    <div className="hidden md:block">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                          {stat.icon}
                        </div>
                        <div className="text-right">
                          <p className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                            {stat.value}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">{stat.title}</p>
                          <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                        </div>
                      </div>
                      <div className={`w-full h-1 bg-gradient-to-r ${stat.color} rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                {/* Recent Campaigns */}
                <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 flex items-center">
                  <span className="mr-2"></span>
                  Recent Campaigns
                </h3>
                <div className="space-y-3">
                  {campaigns.slice(0, 3).map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                      <div>
                        <p className="font-medium text-foreground">{campaign.title}</p>
                        <p className="text-sm text-muted-foreground">{campaign.category}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                  ))}
                  {campaigns.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No campaigns yet</p>
                      <button 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors duration-200"
                        onClick={handleCreateCampaign}
                      >
                        Create Your First Campaign
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Applications */}
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <span className="mr-2">📝</span>
                  Recent Applications
                </h3>
                <div className="space-y-3">
                  {applications.slice(0, 3).map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                      <div>
                        <p className="font-medium text-foreground">{application.creatorName}</p>
                        <p className="text-sm text-muted-foreground">{application.platform} • {application.followers}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        application.status === 'approved' ? 'bg-green-100 text-green-800' :
                        application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {application.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </>
          )}

          {activeTab === 'campaigns' && (
            <>
              {/* Campaigns Header */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2 tracking-tight">
                  📊 Campaign Management
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Manage all your active and past campaigns.
                </p>
              </div>

              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">All Campaigns</h3>
                <button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                  onClick={handleCreateCampaign}
                >
                  Create Campaign
                </button>
              </div>
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading campaigns...</p>
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-muted-foreground mb-4">No campaigns found</p>
                  <button 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg transition-colors duration-200"
                    onClick={handleCreateCampaign}
                  >
                    Create Your First Campaign
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="bg-muted/30 border border-border rounded-lg p-4 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <h4 className="font-semibold text-foreground mb-2">{campaign.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{campaign.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{campaign.category}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                          campaign.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            </>
          )}

          {activeTab === 'applications' && (
            <>
              {/* Applications Header */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2 tracking-tight">
                  📝 Creator Applications
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Review and manage applications from content creators.
                </p>
              </div>

              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">All Applications</h3>
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-all duration-200 hover:scale-[1.02]">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                        {application.creatorName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{application.creatorName}</p>
                        <p className="text-sm text-muted-foreground">{application.platform} • {application.followers}</p>
                        <p className="text-xs text-muted-foreground">{application.campaignName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        application.status === 'approved' ? 'bg-green-100 text-green-800' :
                        application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {application.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">{application.appliedDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default BrandDashboard;
