import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  
  // State management
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'draft' | 'completed' | 'cancelled'>('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Filter options
  const filterOptions = [
    { key: 'all' as const, label: 'All Campaigns', count: campaigns.length },
    { key: 'active' as const, label: 'Active', count: campaigns.filter(c => c.status === 'active').length },
    { key: 'draft' as const, label: 'Draft', count: campaigns.filter(c => c.status === 'draft').length },
    { key: 'completed' as const, label: 'Completed', count: campaigns.filter(c => c.status === 'completed').length },
    { key: 'cancelled' as const, label: 'Cancelled', count: campaigns.filter(c => c.status === 'cancelled').length },
  ];

  // Fetch campaigns from API
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem('token');
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
    <div className="campaigns-page">
      <BrandNavbar activeTab="campaigns" />

      {/* Main Content */}
      <main className="campaigns-main">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-container">
            <div className="search-bar">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search campaigns by title, description, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>
            <div className="pagination-container">
              <span className="pagination-info">
                {filteredCampaigns.length > 0 
                  ? `Showing ${startIndex + 1}-${Math.min(endIndex, filteredCampaigns.length)} of ${filteredCampaigns.length} campaigns`
                  : 'No campaigns found'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="campaigns-content">
          {/* Sidebar */}
          <aside className="campaigns-sidebar">
            <div className="sidebar-section">
              <h3 className="sidebar-title">Filter Campaigns</h3>
              <div className="filter-options">
                {filterOptions.map((option) => (
                  <button
                    key={option.key}
                    className={`filter-btn ${activeFilter === option.key ? 'active' : ''}`}
                    onClick={() => setActiveFilter(option.key)}
                  >
                    <span className="filter-label">{option.label}</span>
                    <span className="filter-count">{option.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <h3 className="sidebar-title">Quick Actions</h3>
              <div className="quick-actions">
                <button className="action-btn" onClick={() => navigate('/brand/dashboard')}>
                  <span className="action-icon">📊</span>
                  View Dashboard
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="campaigns-list">
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            {filteredCampaigns.length === 0 && !error ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No campaigns found</h3>
                <p>
                  {searchQuery 
                    ? `No campaigns match "${searchQuery}". Try adjusting your search.`
                    : activeFilter === 'all' 
                      ? "You haven't created any campaigns yet."
                      : `No ${activeFilter} campaigns found.`
                  }
                </p>
              </div>
            ) : (
              <>
                <div className="campaigns-grid">
                  {currentCampaigns.map((campaign) => (
                  <div key={campaign.id} className="campaign-card">
                    <div className="campaign-header">
                      <h3 className="campaign-title">{campaign.title}</h3>
                      <span className={`campaign-status ${getStatusClass(campaign.status)}`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="campaign-meta">
                      <div className="campaign-category">{campaign.category}</div>
                      <div className="campaign-dates">
                        {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                      </div>
                    </div>

                    <p className="campaign-description">
                      {campaign.description.length > 120 
                        ? `${campaign.description.substring(0, 120)}...` 
                        : campaign.description
                      }
                    </p>

                    <div className="campaign-details">
                      <div className="campaign-platforms">
                        <strong>Platforms:</strong> {campaign.platforms.join(', ')}
                      </div>
                      <div className="campaign-compensation">
                        <strong>Type:</strong> {campaign.compensationType}
                        {campaign.paymentAmount && (
                          <span className="payment-amount"> - ${campaign.paymentAmount}</span>
                        )}
                      </div>
                    </div>

                    <div className="campaign-stats">
                      <div className="stat-item">
                        <span className="stat-label">Applicants</span>
                        <span className="stat-value">{campaign.applicants || 0}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Posts</span>
                        <span className="stat-value">{campaign.numberOfPosts}</span>
                      </div>
                    </div>

                    <div className="campaign-actions">
                      <button className="action-btn-secondary">
                        View Details
                      </button>
                      <button 
                        className="action-btn-primary"
                        onClick={() => navigate(`/brand/campaigns/${campaign.id}/manage`)}
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination-container">
                    <button 
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ‹
                    </button>
                    
                    {generatePageNumbers().map((page) => (
                      <button
                        key={page}
                        className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button 
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Campaigns;
