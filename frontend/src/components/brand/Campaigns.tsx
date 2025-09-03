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
  BarChart3
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
      <div className="campaigns-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BrandNavbar activeTab="campaigns" />
      
      <div className="flex">
        {/* Left Sidebar */}
        <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-72'
        }`}>
          <div className="p-4">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between mb-6">
              {!sidebarCollapsed && (
                <h2 className="text-lg font-semibold text-gray-900">Campaigns</h2>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <BarChart3 className="w-5 h-5 text-gray-600" />
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
                    className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 border border-blue-200 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${isActive ? 'text-blue-600' : option.color} ${
                      sidebarCollapsed ? '' : 'mr-3'
                    }`} />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left font-medium">{option.label}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          isActive
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600'
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
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate('/brand/create-campaign')}
                className={`w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
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
          <div className="p-6">
            {/* Header with Search */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {filterOptions.find(f => f.key === activeFilter)?.label || 'Campaigns'}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage and track your marketing campaigns
                  </p>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Campaigns Grid */}
            {filteredCampaigns.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery 
                    ? `No campaigns match "${searchQuery}"`
                    : `You don't have any ${activeFilter === 'all' ? '' : activeFilter} campaigns yet.`
                  }
                </p>
                {activeFilter === 'all' && (
                  <button
                    onClick={() => navigate('/brand/create-campaign')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Campaign
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/brand/campaigns/${campaign.id}/manage`)}
                  >
                    {/* Campaign Card Content */}
                    <div className="p-6">
                      {/* Campaign Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                            {campaign.title}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            campaign.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : campaign.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : campaign.status === 'completed'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                          </span>
                        </div>
                        <button className="p-1 hover:bg-gray-100 rounded-full">
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>

                      {/* Campaign Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {campaign.description}
                      </p>

                      {/* Campaign Meta */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="w-4 h-4 mr-2" />
                          <span>{campaign.applicants} applicants</span>
                        </div>
                      </div>

                      {/* Campaign Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-sm font-medium text-gray-900">
                          {campaign.compensationType === 'paid' ? `$${campaign.paymentAmount}` : 'Product Only'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/brand/campaigns/${campaign.id}/manage`);
                          }}
                          className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
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
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 border text-sm rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
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
