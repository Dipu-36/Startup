import React, { useState, useEffect, useRef } from 'react';
import { useUser, useClerk, useAuth } from '@clerk/clerk-react';
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
  X,
  Users,
  FileText,
  Calendar,
  Star,
  Eye,
  MessageSquare,
  Filter,
  Search,
  BarChart3,
  Activity,
  Circle,
  XCircle,
  Target,
  DollarSign,
  TrendingUp,
  Mail,
  ExternalLink,
  ChevronRight,
  Award,
  Tag
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
  const { getToken } = useAuth();
  const navigate = useNavigate();
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
        console.log('Fetching campaigns - User:', user?.id, 'Email:', user?.primaryEmailAddress?.emailAddress); // Debug log
        const token = await getToken();
        console.log('Token status:', token ? 'Available' : 'Not available'); // Debug log
        
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

        console.log('Campaigns response status:', response.status); // Debug log
        if (!response.ok) {
          throw new Error(`Failed to fetch campaigns: ${response.status} ${response.statusText}`);
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

    const fetchApplications = async () => {
      try {
        console.log('Fetching applications - User:', user?.id); // Debug log
        const token = await getToken();
        if (!token) {
          console.log('No token available for applications'); // Debug log
          return;
        }

        console.log('Making applications request with token'); // Debug log
        const response = await fetch('http://localhost:8080/api/applications', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Applications response status:', response.status); // Debug log
        if (response.ok) {
          const applicationsData = await response.json();
          console.log('Applications data:', applicationsData); // Debug log
          setApplications(applicationsData || []);
        } else {
          console.error('Applications fetch failed:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
        // Don't set error for applications as it's not critical
      }
    };

    fetchCampaigns();
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
    <div className="min-h-screen-dynamic bg-background relative overflow-hidden">
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
                <button
                  className="px-6 py-3 rounded-lg font-medium transform hover:scale-105 transition-all duration-200 bg-primary text-primary-foreground shadow-lg"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/brand/campaigns')}
                  className="px-6 py-3 rounded-lg font-medium transform hover:scale-105 transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-md"
                >
                  Campaigns
                </button>
                <button
                  onClick={() => navigate('/brand/applications')}
                  className="px-6 py-3 rounded-lg font-medium transform hover:scale-105 transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-md"
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
                <button
                  className="px-4 py-3 rounded-lg font-medium text-left transition-all duration-200 bg-primary text-primary-foreground shadow-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    navigate('/brand/campaigns');
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 rounded-lg font-medium text-left transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  Campaigns
                </button>
                <button
                  onClick={() => {
                    navigate('/brand/applications');
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 rounded-lg font-medium text-left transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  Applications
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 py-6 sm:py-8">
        {/* Dashboard Content */}
        <div>
              {/* Welcome Section */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2 tracking-tight flex items-center">
                  <Users className="w-8 h-8 mr-3 text-primary" />
                  Welcome back, {user?.fullName || user?.firstName || 'Brand'}!
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2 text-muted-foreground" />
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
                    title: 'Draft',
                    subtitle: 'Campaigns',
                    value: campaigns.filter(c => c.status === 'draft').length,
                    color: 'from-yellow-500 to-yellow-600'
                  },
                  {
                    id: 'approved',
                    icon: <CheckCircle className="w-6 h-6" />,
                    title: 'Completed',
                    subtitle: 'Campaigns',
                    value: campaigns.filter(c => c.status === 'completed').length,
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
                  <Rocket className="w-5 h-5 mr-2 text-primary" />
                  Recent Campaigns
                </h3>
                <div className="space-y-3">
                  {campaigns.slice(0, 3).map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-200 cursor-pointer"
                         onClick={() => navigate(`/brand/campaigns/manage/${campaign.id}`)}>
                      <div className="flex-1">
                        <p className="font-medium text-foreground mb-1">{campaign.title}</p>
                        <p className="text-sm text-muted-foreground mb-2 flex items-center">
                          <Tag className="w-3 h-3 mr-1" />
                          {campaign.category} • {campaign.platforms.join(', ')}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {campaign.paymentAmount}
                          </span>
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {campaign.applicants} applicants
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(campaign.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                          campaign.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          campaign.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {campaign.status === 'active' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : campaign.status === 'draft' ? (
                            <Clock className="w-3 h-3" />
                          ) : campaign.status === 'completed' ? (
                            <Award className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {campaign.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {campaigns.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
                        <Rocket className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground mb-4">No campaigns yet</p>
                      <button 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
                        onClick={handleCreateCampaign}
                      >
                        <Plus className="w-4 h-4" />
                        Create Your First Campaign
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Applications */}
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-primary" />
                  Recent Applications
                </h3>
                <div className="space-y-3">
                  {applications.slice(0, 3).map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-200 cursor-pointer">
                      <div className="flex-1">
                        <p className="font-medium text-foreground mb-1">{application.creatorName}</p>
                        <p className="text-sm text-muted-foreground mb-2 flex items-center">
                          <Target className="w-3 h-3 mr-1" />
                          {application.campaignName}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {application.creatorEmail}
                          </span>
                          <span className="flex items-center">
                            <Activity className="w-3 h-3 mr-1" />
                            {application.platform}
                          </span>
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {application.followers} followers
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(application.appliedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          application.status === 'approved' ? 'bg-green-100 text-green-800' :
                          application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {application.status === 'approved' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : application.status === 'pending' ? (
                            <Clock className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {application.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {applications.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground mb-4">No applications yet</p>
                      <button 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
                        onClick={() => navigate('/brand/campaigns')}
                      >
                        <Eye className="w-4 h-4" />
                        View Your Campaigns
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default BrandDashboard;
