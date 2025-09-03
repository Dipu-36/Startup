import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { 
  Search, 
  Plus, 
  Filter, 
  Calendar, 
  Users, 
  Eye,
  MoreHorizontal,
  FolderOpen,
  Play,
  FileText,
  CheckCircle,
  XCircle,
  BarChart3,
  Settings,
  Clock,
  Circle,
  ChevronLeft,
  ChevronRight,
  Target,
  DollarSign,
  MessageSquare,
  TrendingUp,
  Activity
} from 'lucide-react';
import BrandNavbar from './BrandNavbar';

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

const Campaigns: React.FC = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  
  // State management
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'draft' | 'completed' | 'cancelled'>('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  console.log('Campaigns component rendered, campaigns:', campaigns.length);
  console.log('Loading:', loading, 'Error:', error);
  console.log('Sidebar collapsed:', sidebarCollapsed);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Filter options with icons
  const filterOptions = [
    { 
      key: 'all' as const, 
      label: 'All Campaigns', 
      icon: FolderOpen,
      count: campaigns.length,
      color: 'text-blue-600'
    },
    { 
      key: 'active' as const, 
      label: 'Active', 
      icon: Play,
      count: campaigns.filter(c => c.status === 'active').length,
      color: 'text-green-600'
    },
    { 
      key: 'draft' as const, 
      label: 'Draft', 
      icon: FileText,
      count: campaigns.filter(c => c.status === 'draft').length,
      color: 'text-yellow-600'
    },
    { 
      key: 'completed' as const, 
      label: 'Completed', 
      icon: CheckCircle,
      count: campaigns.filter(c => c.status === 'completed').length,
      color: 'text-purple-600'
    },
    { 
      key: 'cancelled' as const, 
      label: 'Cancelled', 
      icon: XCircle,
      count: campaigns.filter(c => c.status === 'cancelled').length,
      color: 'text-red-600'
    },
  ];

  console.log('Filter options:', filterOptions);

  // Fetch campaigns from API
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = await getToken();
        if (!token) {
          setError('Please log in to view campaigns');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:8080/api/campaigns', {
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

  // Filter and search logic
  useEffect(() => {
    let filtered = campaigns;

    // Apply status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === activeFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(campaign =>
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCampaigns(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [campaigns, activeFilter, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCampaigns = filteredCampaigns.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Filter and search functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'draft': return 'status-draft';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen-dynamic bg-background relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <BrandNavbar activeTab="campaigns" />
        <div className="relative z-10 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading campaigns...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen-dynamic bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <BrandNavbar activeTab="campaigns" />
      
      <div className="relative z-10 flex">
        {/* Left Sidebar */}
        <div className={`bg-card/50 backdrop-blur-sm border-r border-border transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-72'
        }`}>
          <div className="p-4 sm:p-6">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between mb-6">
              {!sidebarCollapsed && (
                <h2 className="text-lg font-display font-bold text-foreground flex items-center">
                  <Target className="w-6 h-6 mr-2 text-primary" />
                  Campaigns
                </h2>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 hover:bg-muted/50 rounded-lg transition-colors duration-200"
              >
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Filter Options */}
            <nav className="space-y-2">
              {filterOptions.map((option) => {
                const IconComponent = option.icon;
                const isActive = activeFilter === option.key;
                
                return (
                  <button
                    key={option.key}
                    onClick={() => setActiveFilter(option.key)}
                    className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                      isActive
                        ? 'bg-primary/10 border border-primary/20 text-primary shadow-md'
                        : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${isActive ? 'text-primary' : option.color} ${
                      sidebarCollapsed ? '' : 'mr-3'
                    }`} />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left font-medium">{option.label}</span>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          isActive
                            ? 'bg-primary/20 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {option.count}
                        </span>
                      </>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Create Campaign Button */}
            <div className="mt-6 pt-6 border-t border-border">
              <button
                onClick={() => navigate('/brand/create-campaign')}
                className={`w-full flex items-center justify-center px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 shadow-md ${
                  sidebarCollapsed ? 'px-3' : ''
                }`}
              >
                <Plus className="w-5 h-5" />
                {!sidebarCollapsed && <span className="ml-2 font-medium">Create Campaign</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="p-4 sm:p-6">
            {/* Header with Search */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight flex items-center">
                    <Target className="w-8 h-8 mr-3 text-primary" />
                    {filterOptions.find(f => f.key === activeFilter)?.label || 'Campaigns'}
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground mt-2">
                    Manage and track your marketing campaigns
                  </p>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-card/50 backdrop-blur-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive flex items-center">
                  <XCircle className="w-4 h-4 mr-2" />
                  {error}
                </p>
              </div>
            )}

            {/* Campaigns Grid */}
            {filteredCampaigns.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">No campaigns found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? `No campaigns match "${searchQuery}"`
                    : `You don't have any ${activeFilter === 'all' ? '' : activeFilter} campaigns yet.`
                  }
                </p>
                {activeFilter === 'all' && (
                  <button
                    onClick={() => navigate('/brand/create-campaign')}
                    className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 shadow-md"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Campaign
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {currentCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="bg-card/50 backdrop-blur-sm rounded-xl border border-border hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 group"
                    onClick={() => navigate(`/brand/campaigns/${campaign.id}/manage`)}
                  >
                    {/* Campaign Card Content */}
                    <div className="p-4 sm:p-6">
                      {/* Campaign Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-display font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                            {campaign.title}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            campaign.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : campaign.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : campaign.status === 'completed'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {campaign.status === 'active' ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : campaign.status === 'draft' ? (
                              <Clock className="w-3 h-3" />
                            ) : campaign.status === 'completed' ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                          </span>
                        </div>
                        <button className="p-1 hover:bg-muted/50 rounded-full transition-colors duration-200">
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>

                      {/* Campaign Description */}
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {campaign.description}
                      </p>

                      {/* Campaign Meta */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="w-4 h-4 mr-2" />
                          <span>{campaign.applicants} applicants</span>
                        </div>
                      </div>

                      {/* Campaign Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-sm font-medium text-foreground flex items-center">
                          <DollarSign className="w-4 h-4 mr-1 text-primary" />
                          {campaign.compensationType === 'paid' ? `$${campaign.paymentAmount}` : 'Product Only'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/brand/campaigns/${campaign.id}/manage`);
                          }}
                          className="flex items-center text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-4 py-2 bg-card/50 backdrop-blur-sm border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-card/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-card/50 backdrop-blur-sm border border-border text-muted-foreground hover:text-foreground hover:bg-card/70'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-4 py-2 bg-card/50 backdrop-blur-sm border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-card/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
