import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { APP_NAME } from '../../config/appConfig';
import '../../styles/brand/Campaigns.css';

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
  const { user, logout } = useAuth();
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
  
  // Profile dropdown state
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Navigation functions
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBackToDashboard = () => {
    navigate('/brand/dashboard');
  };

  const handleCreateCampaign = () => {
    navigate('/brand/create-campaign');
  };

  // Profile dropdown handlers
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleProfileAction = (action: string) => {
    setIsProfileDropdownOpen(false);
    // Handle different profile actions
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
      default:
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
      {/* Header */}
      <header className="campaigns-header">
        <div className="header-left">
          <h1 className="brand-name">{APP_NAME}</h1>
          <nav className="main-nav">
            <button 
              className="nav-btn"
              onClick={handleBackToDashboard}
            >
              Dashboard
            </button>
            <button className="nav-btn active">
              Campaigns
            </button>
            <button 
              className="nav-btn"
              onClick={() => console.log('Navigate to applications')}
            >
              Applications
            </button>
          </nav>
        </div>
        <div className="header-right">
          <div className="user-profile">
            <div className="profile-info">
              <span className="profile-name">{user?.name || 'User'}</span>
              <span className="profile-email">{user?.email || 'user@example.com'}</span>
            </div>
            <div className="profile-dropdown" ref={dropdownRef}>
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
                  <div className="dropdown-item logout-item" onClick={handleLogout}>
                    <span className="dropdown-icon">🚪</span>
                    Sign Out
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

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
                <button className="action-btn" onClick={handleBackToDashboard}>
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
