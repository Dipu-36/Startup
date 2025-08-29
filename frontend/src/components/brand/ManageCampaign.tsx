import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import campaignService, { Campaign, Creator, Deliverable, PaymentRecord } from '../../services/campaignService';
import BrandNavbar from './BrandNavbar';

const ManageCampaign: React.FC = () => {
  const navigate = useNavigate();
  const { campaignId } = useParams<{ campaignId: string }>();
  
  // State management
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [activeTab, setActiveTab] = useState<'applications' | 'creators' | 'content' | 'budget'>('applications');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Applications tab state
  const [applications, setApplications] = useState<Creator[]>([]);
  const [applicationSearch, setApplicationSearch] = useState('');
  const [applicationFilter, setApplicationFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'shortlisted'>('all');
  const [updatingApplicationId, setUpdatingApplicationId] = useState<string | null>(null);
  
  // Approved creators state
  const [approvedCreators, setApprovedCreators] = useState<Creator[]>([]);
  
  // Content & deadlines state
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  
  // Budget & payments state
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  
  // Load campaign data from API
  useEffect(() => {
    const loadCampaignData = async () => {
      if (!campaignId) {
        setError('Campaign ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch real campaign data
        const campaignData = await campaignService.getCampaign(campaignId);
        setCampaign(campaignData);

        // Fetch real applications data
        const applicationsData = await campaignService.getCampaignApplications(campaignId);
        setApplications(Array.isArray(applicationsData) ? applicationsData : []);
        
        // Filter approved creators
        const safeApplicationsData = Array.isArray(applicationsData) ? applicationsData : [];
        const approvedCreatorsData = safeApplicationsData.filter((app: Creator) => app.status === 'approved');
        setApprovedCreators(approvedCreatorsData);

        // Fetch deliverables (using mock data for now)
        const deliverablesData = await campaignService.getCampaignDeliverables(campaignId);
        setDeliverables(Array.isArray(deliverablesData) ? deliverablesData : []);

        // Fetch payments (using mock data for now)
        const paymentsData = await campaignService.getCampaignPayments(campaignId);
        setPayments(Array.isArray(paymentsData) ? paymentsData : []);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading campaign data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load campaign data');
        setLoading(false);
      }
    };

    loadCampaignData();
  }, [campaignId]);

  // Navigation handlers
  const handleBackToCampaigns = () => {
    navigate('/brand/campaigns');
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

  const handlePublishCampaign = async () => {
    if (!campaignId) return;
    
    try {
      setLoading(true);
      const updatedCampaign = await campaignService.publishCampaign(campaignId);
      setCampaign(updatedCampaign);
      setSuccessMessage('Campaign published successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error publishing campaign:', error);
      setError(error instanceof Error ? error.message : 'Failed to publish campaign');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Application handlers
  const handleApplicationAction = async (creatorId: string, action: 'approve' | 'reject' | 'shortlist' | 'pending') => {
    try {
      // Find the application to get the applicationId
      const application = applications.find(app => app.id === creatorId);
      if (!application) {
        console.error('Application not found');
        return;
      }

      // Set loading state for this specific application
      setUpdatingApplicationId(application.applicationId);

      // Use the actual application ID from the application data
      const applicationId = application.applicationId;

      // Map action to API status
      const apiStatus = action === 'approve' ? 'approved' : 
                       action === 'reject' ? 'rejected' : 
                       action === 'shortlist' ? 'shortlisted' : 
                       'pending';

      // Call API to update status
      await campaignService.updateApplicationStatus(applicationId, apiStatus);

      // Update local state after successful API call
      setApplications(prev =>
        prev.map(app =>
          app.id === creatorId
            ? { 
                ...app, 
                status: apiStatus
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

      // Clear loading state and show success message
      setUpdatingApplicationId(null);
      const actionText = action === 'approve' ? 'approved' : 
                        action === 'reject' ? 'rejected' : 
                        action === 'shortlist' ? 'shortlisted' : 
                        'moved to pending';
      setSuccessMessage(`Application ${actionText} successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error('Error updating application status:', error);
      setError(error instanceof Error ? error.message : 'Failed to update application status');
      setUpdatingApplicationId(null);
      setTimeout(() => setError(''), 5000); // Clear error after 5 seconds
    }
  };

  // Filter applications
  const filteredApplications = (Array.isArray(applications) ? applications : []).filter(app => {
    const matchesFilter = applicationFilter === 'all' || app.status === applicationFilter;
    const matchesSearch = applicationSearch === '' || 
      app.name.toLowerCase().includes(applicationSearch.toLowerCase()) ||
      app.platform.toLowerCase().includes(applicationSearch.toLowerCase()) ||
      (app.niche && app.niche.toLowerCase().includes(applicationSearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Dynamic viewport height handling
  useEffect(() => {
    const setDynamicViewportHeight = () => {
      // Set CSS custom property for 1% of actual viewport height
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // Handle different viewport height ranges
      const viewportHeight = window.innerHeight;
      
      if (viewportHeight <= 500) {
        document.documentElement.classList.add('vh-very-small');
        document.documentElement.classList.remove('vh-small', 'vh-medium');
      } else if (viewportHeight <= 600) {
        document.documentElement.classList.add('vh-small');
        document.documentElement.classList.remove('vh-very-small', 'vh-medium');
      } else if (viewportHeight <= 700) {
        document.documentElement.classList.add('vh-medium');
        document.documentElement.classList.remove('vh-very-small', 'vh-small');
      } else {
        document.documentElement.classList.remove('vh-very-small', 'vh-small', 'vh-medium');
      }
    };

    // Set on component mount
    setDynamicViewportHeight();

    // Update on window resize
    const handleResize = () => {
      setDynamicViewportHeight();
    };

    window.addEventListener('resize', handleResize);
    
    // Also listen for orientation change on mobile devices
    window.addEventListener('orientationchange', () => {
      // Small delay to ensure the viewport has updated
      setTimeout(setDynamicViewportHeight, 100);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', setDynamicViewportHeight);
      // Clean up classes on unmount
      document.documentElement.classList.remove('vh-very-small', 'vh-small', 'vh-medium');
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
      <BrandNavbar activeTab="manage-campaign" />

      {/* Notifications */}
      {successMessage && (
        <div className="notification success">
          <span className="notification-icon">✅</span>
          {successMessage}
        </div>
      )}
      {error && (
        <div className="notification error">
          <span className="notification-icon">❌</span>
          {error}
        </div>
      )}

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
                <button className="manage-campaign-action-btn manage-campaign-action-btn-secondary" onClick={handlePauseCampaign}>
                  Pause Campaign
                </button>
                <button className="manage-campaign-action-btn manage-campaign-action-btn-secondary" onClick={handleEndCampaign}>
                  End Campaign
                </button>
              </>
            )}
            {campaign.status === 'draft' && (
              <button className="manage-campaign-action-btn manage-campaign-action-btn-primary publish-campaign" onClick={handlePublishCampaign}>
                Publish Campaign
              </button>
            )}
            <button className="manage-campaign-action-btn manage-campaign-action-btn-primary" onClick={handleEditCampaign}>
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
              <span className="stat-number">${(campaign.usedBudget || 0).toLocaleString()}</span>
              <span className="stat-label">Budget Used</span>
              <div className="budget-bar">
                <div 
                  className="budget-progress" 
                  style={{ width: `${((campaign.usedBudget || 0) / (campaign.budget || 1)) * 100}%` }}
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
            {/* Draft Campaign Banner - Show only for draft campaigns */}
            {campaign.status === 'draft' ? (
              <div className="manage-campaign-draft-banner">
                <div className="manage-campaign-draft-banner-content">
                  <div className="manage-campaign-draft-banner-icon">📝</div>
                  <div className="manage-campaign-draft-banner-text">
                    <h3>Campaign is in Draft</h3>
                    <p>This campaign is not yet published. Publish it to start receiving applications from creators.</p>
                  </div>
                  <button className="manage-campaign-draft-banner-btn" onClick={handlePublishCampaign}>
                    Publish Campaign
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Show normal tab content only for non-draft campaigns */}
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
                  {Array.isArray(filteredApplications) && filteredApplications.map((applicant) => (
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
                            disabled={updatingApplicationId === applicant.applicationId}
                            title="Approve Application"
                          >
                            <span className="btn-icon">{updatingApplicationId === applicant.applicationId ? '⏳' : '✓'}</span>
                            <span className="btn-text">{updatingApplicationId === applicant.applicationId ? 'Processing...' : 'Approve'}</span>
                          </button>
                          <button 
                            className="action-btn-modern shortlist"
                            onClick={() => handleApplicationAction(applicant.id, 'shortlist')}
                            disabled={updatingApplicationId === applicant.applicationId}
                            title="Add to Shortlist"
                          >
                            <span className="btn-icon">{updatingApplicationId === applicant.applicationId ? '⏳' : '⭐'}</span>
                            <span className="btn-text">{updatingApplicationId === applicant.applicationId ? 'Processing...' : 'Shortlist'}</span>
                          </button>
                          <button 
                            className="action-btn-modern reject"
                            onClick={() => handleApplicationAction(applicant.id, 'reject')}
                            disabled={updatingApplicationId === applicant.applicationId}
                            title="Reject Application"
                          >
                            <span className="btn-icon">{updatingApplicationId === applicant.applicationId ? '⏳' : '✗'}</span>
                            <span className="btn-text">{updatingApplicationId === applicant.applicationId ? 'Processing...' : 'Reject'}</span>
                          </button>
                        </div>
                      )}

                      {applicant.status === 'shortlisted' && (
                        <div className="applicant-actions">
                          <button 
                            className="action-btn-modern approve primary"
                            onClick={() => handleApplicationAction(applicant.id, 'approve')}
                            disabled={updatingApplicationId === applicant.applicationId}
                            title="Approve Shortlisted Candidate"
                          >
                            <span className="btn-icon">{updatingApplicationId === applicant.applicationId ? '⏳' : '✓'}</span>
                            <span className="btn-text">{updatingApplicationId === applicant.applicationId ? 'Processing...' : 'Approve'}</span>
                          </button>
                          <button 
                            className="action-btn-modern neutral"
                            onClick={() => handleApplicationAction(applicant.id, 'pending')}
                            disabled={updatingApplicationId === applicant.applicationId}
                            title="Move Back to Pending"
                          >
                            <span className="btn-icon">{updatingApplicationId === applicant.applicationId ? '⏳' : '↶'}</span>
                            <span className="btn-text">{updatingApplicationId === applicant.applicationId ? 'Processing...' : 'Pending'}</span>
                          </button>
                          <button 
                            className="action-btn-modern reject"
                            onClick={() => handleApplicationAction(applicant.id, 'reject')}
                            disabled={updatingApplicationId === applicant.applicationId}
                            title="Reject Candidate"
                          >
                            <span className="btn-icon">{updatingApplicationId === applicant.applicationId ? '⏳' : '✗'}</span>
                            <span className="btn-text">{updatingApplicationId === applicant.applicationId ? 'Processing...' : 'Reject'}</span>
                          </button>
                        </div>
                      )}

                      {applicant.status === 'approved' && (
                        <div className="applicant-actions">
                            <button 
                            className="action-btn-modern reject"
                            onClick={() => handleApplicationAction(applicant.id, 'reject')}
                            disabled={updatingApplicationId === applicant.applicationId}
                            title="Reject Candidate"
                          >
                            <span className="btn-icon">{updatingApplicationId === applicant.applicationId ? '⏳' : '✗'}</span>
                            <span className="btn-text">{updatingApplicationId === applicant.applicationId ? 'Processing...' : 'Reject'}</span>
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
                            disabled={updatingApplicationId === applicant.applicationId}
                            title="Reconsider Application"
                          >
                            <span className="btn-icon">{updatingApplicationId === applicant.applicationId ? '⏳' : '↶'}</span>
                            <span className="btn-text">{updatingApplicationId === applicant.applicationId ? 'Processing...' : 'Reconsider'}</span>
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
                  {Array.isArray(approvedCreators) && approvedCreators.map((creator) => (
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
                        {(Array.isArray(deliverables) ? deliverables : [])
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
                    {Array.isArray(deliverables) && deliverables.map((deliverable) => (
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
                      <span className="budget-amount">${(campaign.budget || 0).toLocaleString()}</span>
                    </div>
                    <div className="budget-card">
                      <h3>Used Budget</h3>
                      <span className="budget-amount used">${(campaign.usedBudget || 0).toLocaleString()}</span>
                    </div>
                    <div className="budget-card">
                      <h3>Remaining</h3>
                      <span className="budget-amount remaining">${((campaign.budget || 0) - (campaign.usedBudget || 0)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="payments-section">
                  <h3>Creator Payments</h3>
                  <div className="payments-list">
                    {Array.isArray(payments) && payments.map((payment) => (
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
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <div className="manage-sidebar-section notifications-section">
            <h3>Notifications</h3>
            <div className="notifications-container">
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
              <div className="notification-item">
                <span className="notification-icon">👍</span>
                <div className="notification-content">
                  <p>Mike Chen's content approved</p>
                  <span className="notification-time">1 day ago</span>
                </div>
              </div>
              <div className="notification-item">
                <span className="notification-icon">💰</span>
                <div className="notification-content">
                  <p>Payment processed for Sarah Johnson</p>
                  <span className="notification-time">2 days ago</span>
                </div>
              </div>
              <div className="notification-item">
                <span className="notification-icon">📸</span>
                <div className="notification-content">
                  <p>New submission from Alex Rodriguez</p>
                  <span className="notification-time">3 days ago</span>
                </div>
              </div>
              <div className="notification-item">
                <span className="notification-icon">⏰</span>
                <div className="notification-content">
                  <p>Deadline reminder: Instagram posts due tomorrow</p>
                  <span className="notification-time">3 days ago</span>
                </div>
              </div>
              <div className="notification-item">
                <span className="notification-icon">✉️</span>
                <div className="notification-content">
                  <p>Message from campaign manager</p>
                  <span className="notification-time">4 days ago</span>
                </div>
              </div>
              <div className="notification-item">
                <span className="notification-icon">📊</span>
                <div className="notification-content">
                  <p>Weekly performance report available</p>
                  <span className="notification-time">1 week ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCampaign;
