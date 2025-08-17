import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { APP_NAME } from '../../config/appConfig';
import '../../styles/creator/CreatorDashboard.css';

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

const CreatorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'campaigns' | 'applications' | 'content'>('dashboard');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

        const response = await fetch('http://localhost:8080/api/campaigns/all', {
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
          console.log('No token found, using mock data');
          return;
        }

        const response = await fetch('http://localhost:8080/api/applications/creator', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const applicationsData = await response.json();
          setApplications(applicationsData || []);
        } else {
          console.log('Failed to fetch applications, using mock data');
          // Fall back to mock data if API fails
          const mockApplications: Application[] = [
            {
              id: '1',
              campaignId: '1',
              creatorId: user?.id || '',
              creatorName: user?.name || 'Creator',
              creatorEmail: user?.email || 'creator@example.com',
              followers: '10.5K',
              platform: 'Instagram',
              status: 'pending',
              appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              campaignName: 'Summer Fashion Collection 2025'
            },
            {
              id: '2',
              campaignId: '2',
              creatorId: user?.id || '',
              creatorName: user?.name || 'Creator',
              creatorEmail: user?.email || 'creator@example.com',
              followers: '25.3K',
              platform: 'YouTube',
              status: 'approved',
              appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              campaignName: 'Tech Gadget Review Campaign'
            },
            {
              id: '3',
              campaignId: '3',
              creatorId: user?.id || '',
              creatorName: user?.name || 'Creator',
              creatorEmail: user?.email || 'creator@example.com',
              followers: '8.7K',
              platform: 'TikTok',
              status: 'rejected',
              appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              campaignName: 'Fitness Equipment Promotion'
            }
          ];
          setApplications(mockApplications);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
        // Fall back to mock data on error
        const mockApplications: Application[] = [
          {
            id: '1',
            campaignId: '1',
            creatorId: user?.id || '',
            creatorName: user?.name || 'Creator',
            creatorEmail: user?.email || 'creator@example.com',
            followers: '10.5K',
            platform: 'Instagram',
            status: 'pending',
            appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            campaignName: 'Summer Fashion Collection 2025'
          },
          {
            id: '2',
            campaignId: '2',
            creatorId: user?.id || '',
            creatorName: user?.name || 'Creator',
            creatorEmail: user?.email || 'creator@example.com',
            followers: '25.3K',
            platform: 'YouTube',
            status: 'approved',
            appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            campaignName: 'Tech Gadget Review Campaign'
          },
          {
            id: '3',
            campaignId: '3',
            creatorId: user?.id || '',
            creatorName: user?.name || 'Creator',
            creatorEmail: user?.email || 'creator@example.com',
            followers: '8.7K',
            platform: 'TikTok',
            status: 'rejected',
            appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            campaignName: 'Fitness Equipment Promotion'
          }
        ];
        setApplications(mockApplications);
      }
    };

    fetchApplications();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBrowseCampaigns = () => {
    navigate('/creator/campaigns');
  };

  const handleApplyToCampaign = async (campaignId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to apply to campaigns');
        return;
      }

      const response = await fetch('http://localhost:8080/api/applications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId: campaignId,
          followers: '10.5K', // You might want to get this from user profile
          platform: 'Instagram' // You might want to get this from user profile
        }),
      });

      if (response.ok) {
        const newApplication = await response.json();
        alert('Application submitted successfully!');
        // Refresh applications list
        setApplications(prev => [newApplication, ...prev]);
      } else {
        const errorData = await response.json();
        alert(`Failed to submit application: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error applying to campaign:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleProfileAction = (action: string) => {
    console.log(`Profile action: ${action}`);
    setIsProfileDropdownOpen(false);
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
    <div className="creator-dashboard">
      {/* Header */}
      <header className="creator-dashboard-header">
        <div className="creator-header-left">
          <h1 className="creator-brand-name">{APP_NAME}</h1>
          <nav className="creator-main-nav">
            <button 
              className={`creator-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`creator-nav-btn ${activeTab === 'campaigns' ? 'active' : ''}`}
              onClick={() => navigate('/creator/campaigns')}
            >
              Campaigns
            </button>
            <button 
              className={`creator-nav-btn ${activeTab === 'applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('applications')}
            >
              Applications
            </button>
            <button 
              className={`creator-nav-btn ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              Content
            </button>
          </nav>
        </div>
        <div className="creator-header-right">
          <div className="creator-user-profile">
            <div className="creator-profile-info">
              <span className="creator-profile-name">{user?.name || 'creator1'}</span>
              <span className="creator-profile-email">{user?.email || 'creator1@gmail.com'}</span>
            </div>
            <div className="creator-profile-dropdown" ref={dropdownRef}>
              <div className="creator-profile-avatar" onClick={toggleProfileDropdown}>
                <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'C'}</span>
              </div>
              {isProfileDropdownOpen && (
                <div className="creator-dropdown-menu">
                  <div className="creator-dropdown-header">
                    <div className="creator-dropdown-user-info">
                      <strong>{user?.name || 'creator1'}</strong>
                      <span>{user?.email || 'creator1@gmail.com'}</span>
                    </div>
                  </div>
                  <div className="creator-dropdown-divider"></div>
                  <div className="creator-dropdown-item" onClick={() => handleProfileAction('profile')}>
                    <span className="creator-dropdown-icon">👤</span>
                    Profile Settings
                  </div>
                  <div className="creator-dropdown-item" onClick={() => handleProfileAction('portfolio')}>
                    <span className="creator-dropdown-icon">🎨</span>
                    Portfolio
                  </div>
                  <div className="creator-dropdown-item" onClick={() => handleProfileAction('earnings')}>
                    <span className="creator-dropdown-icon">💰</span>
                    Earnings
                  </div>
                  <div className="creator-dropdown-item" onClick={() => handleProfileAction('help')}>
                    <span className="creator-dropdown-icon">❓</span>
                    Help & Support
                  </div>
                  <div className="creator-dropdown-divider"></div>
                  <div className="creator-dropdown-item creator-logout-item" onClick={handleLogout}>
                    <span className="creator-dropdown-icon">🚪</span>
                    Sign Out
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="creator-dashboard-main">
        <div className="creator-dashboard-content">
          {/* Welcome Section */}
          <div className="creator-welcome-section">
            <h2>Welcome back, {user?.name || 'creator1'}!</h2>
          </div>

          {/* Quick Stats - Single Row */}
          <div className="creator-quick-stats">
            <div className="creator-stat-card" onClick={handleBrowseCampaigns}>
              <div className="creator-stat-icon">🔎</div>
              <div className="creator-stat-info">
                <span className="creator-stat-number">Browse</span>
                <span className="creator-stat-label">Campaigns</span>
              </div>
            </div>
            <div className="creator-stat-card">
              <div className="creator-stat-icon">🚀</div>
              <div className="creator-stat-info">
                <span className="creator-stat-number">{applications.filter(a => a.status === 'approved').length}</span>
                <span className="creator-stat-label">Approved Campaigns</span>
              </div>
            </div>
            <div className="creator-stat-card">
              <div className="creator-stat-icon">⏳</div>
              <div className="creator-stat-info">
                <span className="creator-stat-number">{applications.filter(a => a.status === 'pending').length}</span>
                <span className="creator-stat-label">Pending Applications</span>
              </div>
            </div>
            <div className="creator-stat-card">
              <div className="creator-stat-icon">💰</div>
              <div className="creator-stat-info">
                <span className="creator-stat-number">$2,450</span>
                <span className="creator-stat-label">Total Earnings</span>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="creator-content-grid">
            {/* Available Campaigns Section */}
            <section className="creator-campaigns-section">
              <div className="creator-section-header">
                <h2>Available Campaigns</h2>
              </div>
              <div className="creator-campaigns-grid">
                {loading ? (
                  <div className="creator-loading-state">
                    <p>Loading campaigns...</p>
                  </div>
                ) : error ? (
                  <div className="creator-error-state">
                    <p>{error}</p>
                  </div>
                ) : campaigns.length === 0 ? (
                  <div className="creator-empty-state">
                    <p>No campaigns available at the moment. Check back later!</p>
                  </div>
                ) : (
                  campaigns.map((campaign) => (
                    <div key={campaign.id} className="creator-campaign-card">
                      <div className="creator-campaign-header">
                        <h3>{campaign.title}</h3>
                        <span className="creator-campaign-brand">by {campaign.brandName}</span>
                      </div>
                      <div className="creator-campaign-details">
                        <p><strong>Budget:</strong> {campaign.paymentAmount}</p>
                        <p><strong>Platform:</strong> {campaign.platforms.join(', ')}</p>
                        <p><strong>Deadline:</strong> {new Date(campaign.endDate).toLocaleDateString()}</p>
                      </div>
                      <div className="creator-campaign-actions">
                        <button className="creator-btn-secondary">View Details</button>
                        <button 
                          className="creator-btn-primary"
                          onClick={() => handleApplyToCampaign(campaign.id)}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))
                )}   
              </div>
            </section>

            {/* Applications Section */}
            <section className="creator-applications-section">
              <div className="creator-section-header">
                <h2>Recent Applications</h2>
              </div>
              <div className="creator-applications-container">
                <div className="creator-applications-list">
                  {applications.map((application) => (
                    <div key={application.id} className="creator-application-item">
                      <div className="creator-application-info">
                        <div className="creator-campaign-details">
                          <h4>{application.campaignName}</h4>
                          <p className="creator-platform-info">{application.platform} • {application.followers}</p>
                          <p className="creator-applied-info">Applied {new Date(application.appliedDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}</p>
                        </div>
                        <div className="creator-application-meta">
                          <span className={`creator-status ${application.status}`}>
                            {application.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatorDashboard;
