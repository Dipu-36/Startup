import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { APP_NAME } from '../../config/appConfig';
import '../../styles/brand/ManageCampaign.css';

interface Creator {
  id: string;
  name: string;
  email: string;
  platform: string;
  followers: number;
  engagementRate: number;
  niche: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'shortlisted';
  profileImage?: string;
}

interface Deliverable {
  id: string;
  creatorId: string;
  creatorName: string;
  type: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'approved' | 'revision_needed';
  submissionDate?: string;
  content?: string;
}

interface PaymentRecord {
  id: string;
  creatorId: string;
  creatorName: string;
  amount: number;
  status: 'pending' | 'paid' | 'processing';
  dueDate: string;
}

interface Campaign {
  id: string;
  title: string;
  status: 'draft' | 'active' | 'completed' | 'paused';
  startDate: string;
  endDate: string;
  category: string;
  description: string;
  budget: number;
  usedBudget: number;
  applicantsCount: number;
  approvedCreators: number;
  deliverablesCount: number;
}

const ManageCampaign: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { campaignId } = useParams<{ campaignId: string }>();
  
  // State management
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [activeTab, setActiveTab] = useState<'applications' | 'creators' | 'content' | 'budget'>('applications');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Applications tab state
  const [applications, setApplications] = useState<Creator[]>([]);
  const [applicationSearch, setApplicationSearch] = useState('');
  const [applicationFilter, setApplicationFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'shortlisted'>('all');
  
  // Approved creators state
  const [approvedCreators, setApprovedCreators] = useState<Creator[]>([]);
  
  // Content & deadlines state
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  
  // Budget & payments state
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  
  // Profile dropdown state
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock data (replace with API calls)
  useEffect(() => {
    const loadCampaignData = async () => {
      try {
        // Mock campaign data
        const mockCampaign: Campaign = {
          id: campaignId || '1',
          title: 'Summer Fashion Collection 2025',
          status: 'active',
          startDate: '2025-08-01',
          endDate: '2025-09-30',
          category: 'Fashion',
          description: 'Promote our new summer collection with authentic lifestyle content',
          budget: 50000,
          usedBudget: 32000,
          applicantsCount: 127,
          approvedCreators: 8,
          deliverablesCount: 24
        };

        // Mock applications data
        const mockApplications: Creator[] = [
          {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            platform: 'Instagram',
            followers: 125000,
            engagementRate: 3.2,
            niche: 'Fashion',
            applicationDate: '2025-08-10',
            status: 'pending'
          },
          {
            id: '2',
            name: 'Mike Chen',
            email: 'mike@example.com',
            platform: 'TikTok',
            followers: 89000,
            engagementRate: 4.8,
            niche: 'Lifestyle',
            applicationDate: '2025-08-09',
            status: 'shortlisted'
          },
          {
            id: '3',
            name: 'Emma Davis',
            email: 'emma@example.com',
            platform: 'YouTube',
            followers: 256000,
            engagementRate: 2.9,
            niche: 'Fashion',
            applicationDate: '2025-08-08',
            status: 'approved'
          }
        ];

        // Mock approved creators
        const mockApprovedCreators = mockApplications.filter(app => app.status === 'approved');

        // Mock deliverables
        const mockDeliverables: Deliverable[] = [
          {
            id: '1',
            creatorId: '3',
            creatorName: 'Emma Davis',
            type: 'Instagram Post',
            dueDate: '2025-08-20',
            status: 'submitted',
            submissionDate: '2025-08-19'
          },
          {
            id: '2',
            creatorId: '3',
            creatorName: 'Emma Davis',
            type: 'Instagram Story',
            dueDate: '2025-08-25',
            status: 'pending'
          }
        ];

        // Mock payments
        const mockPayments: PaymentRecord[] = [
          {
            id: '1',
            creatorId: '3',
            creatorName: 'Emma Davis',
            amount: 2500,
            status: 'pending',
            dueDate: '2025-08-25'
          }
        ];

        setCampaign(mockCampaign);
        setApplications(mockApplications);
        setApprovedCreators(mockApprovedCreators);
        setDeliverables(mockDeliverables);
        setPayments(mockPayments);
        setLoading(false);
      } catch (error) {
        console.error('Error loading campaign data:', error);
        setError('Failed to load campaign data');
        setLoading(false);
      }
    };

    loadCampaignData();
  }, [campaignId]);

  // Profile dropdown handlers
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
      default:
        break;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Navigation handlers
  const handleBackToCampaigns = () => {
    navigate('/brand/campaigns');
  };

  const handleBackToDashboard = () => {
    navigate('/brand/dashboard');
  };

  // Campaign action handlers
  const handlePauseCampaign = () => {
    console.log('Pause campaign');
  };

  const handleEndCampaign = () => {
    console.log('End campaign');
  };

  const handleEditCampaign = () => {
    console.log('Edit campaign');
  };

  // Application handlers
  const handleApplicationAction = (creatorId: string, action: 'approve' | 'reject' | 'shortlist' | 'pending') => {
    setApplications(prev =>
      prev.map(app =>
        app.id === creatorId
          ? { 
              ...app, 
              status: action === 'approve' ? 'approved' : 
                     action === 'reject' ? 'rejected' : 
                     action === 'shortlist' ? 'shortlisted' : 
                     'pending' 
            }
          : app
      )
    );
    
    if (action === 'approve') {
      const approvedCreator = applications.find(app => app.id === creatorId);
      if (approvedCreator) {
        setApprovedCreators(prev => [...prev, { ...approvedCreator, status: 'approved' }]);
      }
    } else if (action === 'pending' || action === 'reject' || action === 'shortlist') {
      // Remove from approved creators if moved back to pending/rejected/shortlisted
      setApprovedCreators(prev => prev.filter(creator => creator.id !== creatorId));
    }
  };

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesFilter = applicationFilter === 'all' || app.status === applicationFilter;
    const matchesSearch = applicationSearch === '' || 
      app.name.toLowerCase().includes(applicationSearch.toLowerCase()) ||
      app.platform.toLowerCase().includes(applicationSearch.toLowerCase()) ||
      app.niche.toLowerCase().includes(applicationSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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

  if (loading) {
    return (
      <div className="manage-campaign-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="manage-campaign-page">
        <div className="error-container">
          <h2>Campaign Not Found</h2>
          <p>{error || 'The requested campaign could not be found.'}</p>
          <button onClick={handleBackToCampaigns} className="back-btn">
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'draft': return 'status-draft';
      case 'completed': return 'status-completed';
      case 'paused': return 'status-paused';
      default: return '';
    }
  };

  return (
    <div className="manage-campaign-page">
      {/* Header */}
      <header className="manage-header">
        <div className="header-left">
          <h1 className="brand-name">{APP_NAME}</h1>
          <nav className="main-nav">
            <button className="nav-btn" onClick={handleBackToDashboard}>
              Dashboard
            </button>
            <button className="nav-btn active" onClick={handleBackToCampaigns}>
              Campaigns
            </button>
            <button className="nav-btn">
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

      {/* Campaign Summary Section */}
      <div className="manage-campaign-summary">
        <div className="summary-header">
          <div className="manage-campaign-info">
            <h2 className="manage-campaign-title">{campaign.title}</h2>
            <div className="manage-campaign-meta">
              <span className={`manage-campaign-status ${getStatusClass(campaign.status)}`}>
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </span>
              <span className="manage-campaign-dates">
                {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
              </span>
              <span className="manage-campaign-category">{campaign.category}</span>
            </div>
          </div>
          <div className="manage-campaign-actions">
            {campaign.status === 'active' && (
              <>
                <button className="action-btn secondary" onClick={handlePauseCampaign}>
                  Pause Campaign
                </button>
                <button className="action-btn secondary" onClick={handleEndCampaign}>
                  End Campaign
                </button>
              </>
            )}
            <button className="action-btn primary" onClick={handleEditCampaign}>
              Edit Campaign
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <span className="stat-number">{campaign.applicantsCount}</span>
              <span className="stat-label">Total Applicants</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <span className="stat-number">{campaign.approvedCreators}</span>
              <span className="stat-label">Approved Creators</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <span className="stat-number">{campaign.deliverablesCount}</span>
              <span className="stat-label">Deliverables</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <span className="stat-number">${campaign.usedBudget.toLocaleString()}</span>
              <span className="stat-label">Budget Used</span>
              <div className="budget-bar">
                <div 
                  className="budget-progress" 
                  style={{ width: `${(campaign.usedBudget / campaign.budget) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="main-content">
        <div className="content-wrapper">
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button 
              className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('applications')}
            >
              Applications ({applications.filter(app => app.status === 'pending').length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'creators' ? 'active' : ''}`}
              onClick={() => setActiveTab('creators')}
            >
              Approved Creators ({approvedCreators.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              Content & Deadlines
            </button>
            <button 
              className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
              onClick={() => setActiveTab('budget')}
            >
              Budget & Payments
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'applications' && (
              <div className="applications-tab">
                <div className="tab-header">
                  <div className="search-filter-container">
                    <div className="search-bar">
                      <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="M21 21l-4.35-4.35"></path>
                      </svg>
                      <input
                        type="text"
                        placeholder="Search applicants..."
                        value={applicationSearch}
                        onChange={(e) => setApplicationSearch(e.target.value)}
                        className="search-input"
                      />
                    </div>
                    <select 
                      value={applicationFilter} 
                      onChange={(e) => setApplicationFilter(e.target.value as any)}
                      className="filter-select"
                    >
                      <option value="all">All Applications</option>
                      <option value="pending">Pending</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="applications-grid">
                  {filteredApplications.map((applicant) => (
                    <div key={applicant.id} className="applicant-card">
                      <div className="applicant-header">
                        <div className="applicant-avatar">
                          {applicant.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="applicant-info">
                          <h4 className="applicant-name">{applicant.name}</h4>
                          <p className="applicant-email">{applicant.email}</p>
                        </div>
                        <span className={`applicant-status ${applicant.status}`}>
                          {applicant.status}
                        </span>
                      </div>
                      
                      <div className="applicant-stats">
                        <div className="stat-row">
                          <span className="stat-label">Platform:</span>
                          <span className="stat-value">{applicant.platform}</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Followers:</span>
                          <span className="stat-value">{applicant.followers.toLocaleString()}</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Engagement:</span>
                          <span className="stat-value">{applicant.engagementRate}%</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Niche:</span>
                          <span className="stat-value">{applicant.niche}</span>
                        </div>
                        <div className="stat-row">
                          <span className="stat-label">Applied:</span>
                          <span className="stat-value">{new Date(applicant.applicationDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {applicant.status === 'pending' && (
                        <div className="applicant-actions">
                          <button 
                            className="action-btn-modern approve"
                            onClick={() => handleApplicationAction(applicant.id, 'approve')}
                            title="Approve Application"
                          >
                            <span className="btn-icon">✓</span>
                            <span className="btn-text">Approve</span>
                          </button>
                          <button 
                            className="action-btn-modern shortlist"
                            onClick={() => handleApplicationAction(applicant.id, 'shortlist')}
                            title="Add to Shortlist"
                          >
                            <span className="btn-icon">⭐</span>
                            <span className="btn-text">Shortlist</span>
                          </button>
                          <button 
                            className="action-btn-modern reject"
                            onClick={() => handleApplicationAction(applicant.id, 'reject')}
                            title="Reject Application"
                          >
                            <span className="btn-icon">✗</span>
                            <span className="btn-text">Reject</span>
                          </button>
                        </div>
                      )}

                      {applicant.status === 'shortlisted' && (
                        <div className="applicant-actions">
                          <button 
                            className="action-btn-modern approve primary"
                            onClick={() => handleApplicationAction(applicant.id, 'approve')}
                            title="Approve Shortlisted Candidate"
                          >
                            <span className="btn-icon">✓</span>
                            <span className="btn-text">Approve</span>
                          </button>
                          <button 
                            className="action-btn-modern neutral"
                            onClick={() => handleApplicationAction(applicant.id, 'pending')}
                            title="Move Back to Pending"
                          >
                            <span className="btn-icon">↶</span>
                            <span className="btn-text">Pending</span>
                          </button>
                          <button 
                            className="action-btn-modern reject"
                            onClick={() => handleApplicationAction(applicant.id, 'reject')}
                            title="Reject Candidate"
                          >
                            <span className="btn-icon">✗</span>
                            <span className="btn-text">Reject</span>
                          </button>
                        </div>
                      )}

                      {applicant.status === 'approved' && (
                        <div className="applicant-actions">
                            <button 
                            className="action-btn-modern reject"
                            onClick={() => handleApplicationAction(applicant.id, 'reject')}
                            title="Reject Candidate"
                          >
                            <span className="btn-icon">✗</span>
                            <span className="btn-text">Reject</span>
                          </button>
                          <button 
                            className="action-btn-modern message"
                            onClick={() => console.log('Send message to', applicant.name)}
                            title="Send Message"
                          >
                            <span className="btn-icon">💬</span>
                            <span className="btn-text">Message</span>
                          </button>
                        </div>
                      )}

                      {applicant.status === 'rejected' && (
                        <div className="applicant-actions">
                          <div className="status-badge-modern rejected">
                            <span className="badge-icon">✗</span>
                            <span className="badge-text">Rejected</span>
                          </div>
                          <button 
                            className="action-btn-modern neutral"
                            onClick={() => handleApplicationAction(applicant.id, 'pending')}
                            title="Reconsider Application"
                          >
                            <span className="btn-icon">↶</span>
                            <span className="btn-text">Reconsider</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'creators' && (
              <div className="creators-tab">
                <div className="creators-grid">
                  {approvedCreators.map((creator) => (
                    <div key={creator.id} className="creator-card">
                      <div className="creator-header">
                        <div className="creator-avatar">
                          {creator.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="creator-info">
                          <h4 className="creator-name">{creator.name}</h4>
                          <p className="creator-platform">{creator.platform} • {creator.followers.toLocaleString()} followers</p>
                        </div>
                        <button className="message-btn">
                          💬 Message
                        </button>
                      </div>
                      
                      <div className="deliverables-status">
                        <h5>Assigned Deliverables</h5>
                        {deliverables
                          .filter(d => d.creatorId === creator.id)
                          .map((deliverable) => (
                            <div key={deliverable.id} className="deliverable-item">
                              <span className="deliverable-type">{deliverable.type}</span>
                              <span className={`deliverable-status ${deliverable.status}`}>
                                {deliverable.status.replace('_', ' ')}
                              </span>
                              <span className="deliverable-due">Due: {new Date(deliverable.dueDate).toLocaleDateString()}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="content-tab">
                <div className="timeline-view">
                  <h3>Content Timeline</h3>
                  <div className="timeline-list">
                    {deliverables.map((deliverable) => (
                      <div key={deliverable.id} className="timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                          <div className="timeline-header">
                            <h4>{deliverable.type}</h4>
                            <span className={`timeline-status ${deliverable.status}`}>
                              {deliverable.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="timeline-creator">By {deliverable.creatorName}</p>
                          <p className="timeline-due">Due: {new Date(deliverable.dueDate).toLocaleDateString()}</p>
                          {deliverable.submissionDate && (
                            <p className="timeline-submitted">
                              Submitted: {new Date(deliverable.submissionDate).toLocaleDateString()}
                            </p>
                          )}
                          <div className="timeline-actions">
                            {deliverable.status === 'submitted' && (
                              <>
                                <button 
                                  className="action-btn-modern approve"
                                  title="Approve Submission"
                                >
                                  <span className="btn-icon">✓</span>
                                  <span className="btn-text">Approve</span>
                                </button>
                                <button 
                                  className="action-btn-modern revision"
                                  title="Request Revision"
                                >
                                  <span className="btn-icon">↻</span>
                                  <span className="btn-text">Revision</span>
                                </button>
                              </>
                            )}
                            {deliverable.status === 'pending' && (
                              <div className="timeline-status-info">
                                <span className="info-text">Awaiting submission</span>
                              </div>
                            )}
                            {deliverable.status === 'approved' && (
                              <div className="status-badge-modern approved">
                                <span className="badge-icon">✓</span>
                                <span className="badge-text">Approved</span>
                              </div>
                            )}
                            {deliverable.status === 'revision_needed' && (
                              <div className="status-badge-modern revision-needed">
                                <span className="badge-icon">↻</span>
                                <span className="badge-text">Revision Needed</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'budget' && (
              <div className="budget-tab">
                <div className="budget-overview">
                  <div className="budget-summary">
                    <div className="budget-card">
                      <h3>Total Budget</h3>
                      <span className="budget-amount">${campaign.budget.toLocaleString()}</span>
                    </div>
                    <div className="budget-card">
                      <h3>Used Budget</h3>
                      <span className="budget-amount used">${campaign.usedBudget.toLocaleString()}</span>
                    </div>
                    <div className="budget-card">
                      <h3>Remaining</h3>
                      <span className="budget-amount remaining">${(campaign.budget - campaign.usedBudget).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="payments-section">
                  <h3>Creator Payments</h3>
                  <div className="payments-list">
                    {payments.map((payment) => (
                      <div key={payment.id} className="payment-item">
                        <div className="payment-info">
                          <h4>{payment.creatorName}</h4>
                          <p className="payment-amount">${payment.amount.toLocaleString()}</p>
                          <p className="payment-due">Due: {new Date(payment.dueDate).toLocaleDateString()}</p>
                        </div>
                        <div className="payment-status">
                          {payment.status === 'pending' && (
                            <>
                              <div className="status-badge-modern pending">
                                <span className="badge-icon">⏳</span>
                                <span className="badge-text">Pending</span>
                              </div>
                              <button 
                                className="action-btn-modern payment"
                                title="Mark Payment as Paid"
                              >
                                <span className="btn-icon">💰</span>
                                <span className="btn-text">Mark Paid</span>
                              </button>
                            </>
                          )}
                          {payment.status === 'paid' && (
                            <div className="status-badge-modern paid">
                              <span className="badge-icon">✓</span>
                              <span className="badge-text">Paid</span>
                            </div>
                          )}
                          {payment.status === 'processing' && (
                            <div className="status-badge-modern processing">
                              <span className="badge-icon">⚡</span>
                              <span className="badge-text">Processing</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <div className="manage-sidebar-section">
            <h3>Notifications</h3>
            <div className="notification-item">
              <span className="notification-icon">🔔</span>
              <div className="notification-content">
                <p>3 new applications received</p>
                <span className="notification-time">2 hours ago</span>
              </div>
            </div>
            <div className="notification-item">
              <span className="notification-icon">📋</span>
              <div className="notification-content">
                <p>Emma Davis submitted content</p>
                <span className="notification-time">5 hours ago</span>
              </div>
            </div>
          </div>

          <div className="manage-sidebar-section">
            <h3>Quick Actions</h3>
            <button className="sidebar-action-btn">
              📢 Send Reminder to All
            </button>
            <button className="sidebar-action-btn">
              💬 Message Approved Creators
            </button>
            <button className="sidebar-action-btn">
              📊 Export Campaign Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCampaign;
