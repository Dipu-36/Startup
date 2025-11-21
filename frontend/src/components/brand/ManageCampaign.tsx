import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser, useClerk, useAuth } from '@clerk/clerk-react';
import campaignService, { Campaign, Creator, Deliverable, PaymentRecord } from '../../services/campaignService';
import BrandNavbar from './BrandNavbar';
import { 
  ArrowLeft,
  Play,
  Pause,
  Square,
  Edit,
  Search,
  Filter,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  RotateCcw,
  DollarSign,
  Users,
  FileText,
  TrendingUp
} from 'lucide-react';

const ManageCampaign: React.FC = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
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
  // Load campaign data function
  const loadCampaignData = async () => {
    if (!campaignId) {
      setError('Campaign ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const token = await getToken();
      if (!token) {
        setError('Please log in to view campaign');
        setLoading(false);
        return;
      }
      
      // Fetch real campaign data
      const campaignData = await campaignService.getCampaign(campaignId, token);
      setCampaign(campaignData);

      // Fetch real applications data
      const applicationsData = await campaignService.getCampaignApplications(campaignId, token);
      setApplications(Array.isArray(applicationsData) ? applicationsData : []);
      
      // Filter approved creators
      const safeApplicationsData = Array.isArray(applicationsData) ? applicationsData : [];
      const approvedCreatorsData = safeApplicationsData.filter((app: Creator) => app.status === 'approved');
      setApprovedCreators(approvedCreatorsData);

      // Fetch deliverables (using mock data for now)
      const deliverablesData = await campaignService.getCampaignDeliverables(campaignId, token);
      setDeliverables(Array.isArray(deliverablesData) ? deliverablesData : []);

      // Fetch payments (using mock data for now)
      const paymentsData = await campaignService.getCampaignPayments(campaignId, token);
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading campaign data:', error);
      
      // Handle authentication service timeout
      if (error instanceof Error && 
          (error.message.includes('Authentication service temporarily unavailable') ||
           error.message.includes('503'))) {
        setError('Authentication service is temporarily unavailable. Please try refreshing the page in a few moments.');
      } else if (error instanceof Error && error.message.includes('401')) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError(error instanceof Error ? error.message : 'Failed to load campaign data');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaignData();
  }, [campaignId]);

  // Navigation handlers
  const handleBackToCampaigns = () => {
    navigate('/brand/campaigns');
  };

  // Campaign action handlers
  const handlePauseCampaign = async () => {
    if (!campaignId || !campaign) return;
    
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        setError('Please log in to pause campaign');
        return;
      }
      
      const response = await fetch(`http://localhost:8080/api/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...campaign,
          status: 'paused'
        })
      });
      
      if (response.ok) {
        const updatedCampaign = await response.json();
        setCampaign(updatedCampaign);
        setSuccessMessage('Campaign paused successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error pausing campaign:', error);
      setError(error instanceof Error ? error.message : 'Failed to pause campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleEndCampaign = async () => {
    if (!campaignId || !campaign) return;
    
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        setError('Please log in to end campaign');
        return;
      }
      
      const response = await fetch(`http://localhost:8080/api/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...campaign,
          status: 'completed'
        })
      });
      
      if (response.ok) {
        const updatedCampaign = await response.json();
        setCampaign(updatedCampaign);
        setSuccessMessage('Campaign ended successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error ending campaign:', error);
      setError(error instanceof Error ? error.message : 'Failed to end campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCampaign = () => {
    navigate(`/brand/campaigns/edit/${campaignId}`);
  };

  const handlePublishCampaign = async () => {
    if (!campaignId) return;
    
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        setError('Please log in to publish campaign');
        return;
      }
      
      const updatedCampaign = await campaignService.publishCampaign(campaignId, token);
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

  const handleResumeCampaign = async () => {
    if (!campaignId || !campaign) return;
    
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        setError('Please log in to resume campaign');
        return;
      }
      
      const response = await fetch(`http://localhost:8080/api/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...campaign,
          status: 'active'
        })
      });
      
      if (response.ok) {
        const updatedCampaign = await response.json();
        setCampaign(updatedCampaign);
        setSuccessMessage('Campaign resumed successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error resuming campaign:', error);
      setError(error instanceof Error ? error.message : 'Failed to resume campaign');
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

      // Get token for authenticated API call
      const token = await getToken();
      if (!token) {
        setError('Please log in to update application status');
        return;
      }

      // Use the actual application ID from the application data
      const applicationId = application.applicationId;

      // Map action to API status
      const apiStatus = action === 'approve' ? 'approved' : 
                       action === 'reject' ? 'rejected' : 
                       action === 'shortlist' ? 'shortlisted' : 
                       'pending';

      // Call API to update status
      await campaignService.updateApplicationStatus(applicationId, apiStatus, token);

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
      <div className="min-h-screen bg-background relative overflow-hidden">
        <BrandNavbar activeTab="campaigns" />
        <div className="relative z-10 px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading campaign...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <BrandNavbar activeTab="campaigns" />
        <div className="relative z-10 px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Campaign Not Found</h2>
              <p className="text-muted-foreground mb-6">{error || 'The requested campaign could not be found.'}</p>
              <button 
                onClick={handleBackToCampaigns} 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Campaigns</span>
              </button>
            </div>
          </div>
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <BrandNavbar activeTab="campaigns" />

      {/* Notifications */}
      {successMessage && (
        <div className="fixed top-20 right-4 z-50 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}
      {error && (
        <div className="fixed top-20 right-4 z-50 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-300 max-w-md">
          <div className="flex items-start space-x-2">
            <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <span className="block text-sm">{error}</span>
              {(error.includes('Authentication service temporarily unavailable') || 
                error.includes('service timeout')) && (
                <button 
                  onClick={() => {
                    setError('');
                    loadCampaignData();
                  }}
                  className="mt-2 text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded transition-colors duration-200"
                >
                  Try Again
                </button>
              )}
            </div>
            <button 
              onClick={() => setError('')}
              className="text-red-600 hover:text-red-800 transition-colors duration-200"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 py-8 sm:py-2">
        {/* Campaign Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={handleBackToCampaigns}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-all duration-200 group"
            >
              <div className="p-2 rounded-xl bg-muted/50 group-hover:bg-muted transition-colors duration-200">
          <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="font-medium">Back to Campaigns</span>
            </button>
          </div>

          <div className="bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-4 mb-6 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
              <div className="mb-3 lg:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-2">{campaign.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${getStatusBadgeClass(campaign.status)}`}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </span>
            <span className="flex items-center space-x-2 text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</span>
            </span>
            <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg font-medium text-sm">{campaign.category}</span>
          </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
          {campaign.status === 'active' && (
            <>
              <button 
                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-sm"
                onClick={handlePauseCampaign}
              >
                <Pause className="w-4 h-4" />
                <span className="text-sm">Pause</span>
              </button>
              <button 
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-sm"
                onClick={handleEndCampaign}
              >
                <Square className="w-4 h-4" />
                <span className="text-sm">End</span>
              </button>
            </>
          )}
          {campaign.status === 'paused' && (
            <>
              <button 
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-sm"
                onClick={handleResumeCampaign}
              >
                <Play className="w-4 h-4" />
                <span className="text-sm">Resume</span>
              </button>
              <button 
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-sm"
                onClick={handleEndCampaign}
              >
                <Square className="w-4 h-4" />
                <span className="text-sm">End</span>
              </button>
            </>
          )}
          {campaign.status === 'draft' && (
            <button 
              className="px-4 py-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-sm"
              onClick={handlePublishCampaign}
            >
              <Play className="w-4 h-4" />
              <span className="text-sm">Publish</span>
            </button>
          )}
          <button 
            className="px-4 py-2 bg-muted/10 hover:bg-muted/20 text-foreground rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-sm"
            onClick={handleEditCampaign}
          >
            <Edit className="w-4 h-4" />
            <span className="text-sm">Edit</span>
          </button>
              </div>
            </div>

            {/* Quick Stats (icon right, data on left) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50 rounded-2xl px-3 py-3 hover:shadow-md transition-all duration-200 flex items-center min-h-[64px]">
          <div className="flex flex-col items-start justify-center flex-1">
            <div className="text-lg sm:text-xl font-bold text-blue-600 leading-tight">
              {applications.length}
            </div>
            <div className="text-xs font-medium text-blue-700/80 mt-1">Total Applicants</div>
          </div>
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
            <Users className="w-5 h-5 text-blue-500" />
          </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200/50 rounded-2xl px-3 py-3 hover:shadow-md transition-all duration-200 flex items-center min-h-[64px]">
          <div className="flex flex-col items-start justify-center flex-1">
            <div className="text-lg sm:text-xl font-bold text-green-600 leading-tight">
              {approvedCreators.length}
            </div>
            <div className="text-xs font-medium text-green-700/80 mt-1">Approved Creators</div>
          </div>
          <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/50 rounded-2xl px-3 py-3 hover:shadow-md transition-all duration-200 flex items-center min-h-[64px]">
          <div className="flex flex-col items-start justify-center flex-1">
            <div className="text-lg sm:text-xl font-bold text-purple-600 leading-tight">
              {deliverables.length}
            </div>
            <div className="text-xs font-medium text-purple-700/80 mt-1">Deliverables</div>
          </div>
          <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
            <FileText className="w-5 h-5 text-purple-500" />
          </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 border border-yellow-200/50 rounded-2xl px-3 py-3 hover:shadow-md transition-all duration-200 flex items-center min-h-[64px]">
          <div className="flex flex-col items-start justify-center flex-1">
            <div className="text-lg sm:text-xl font-bold text-yellow-600 leading-tight">
              ${(campaign.budget || 0).toLocaleString()}
            </div>
            <div className="text-xs font-medium text-yellow-700/80 mt-1">Total Budget</div>
          </div>
          <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
            <DollarSign className="w-5 h-5 text-yellow-500" />
          </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-md border border-border/50 rounded-2xl overflow-hidden shadow-lg">
          {/* Tab Navigation */}
          <div className="border-b border-border/50 bg-gradient-to-r from-muted/30 to-muted/20">
            <nav className="flex space-x-0">
              <button 
                className={`px-6 py-5 text-sm font-semibold transition-all duration-300 border-b-3 flex items-center space-x-2 ${
                  activeTab === 'applications' 
                    ? 'border-primary text-primary bg-primary/5 shadow-sm' 
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
                onClick={() => setActiveTab('applications')}
              >
                <Users className="w-4 h-4" />
                <span>Applications ({applications.filter(app => app.status === 'pending').length})</span>
              </button>
              <button 
                className={`px-6 py-5 text-sm font-semibold transition-all duration-300 border-b-3 flex items-center space-x-2 ${
                  activeTab === 'creators' 
                    ? 'border-primary text-primary bg-primary/5 shadow-sm' 
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
                onClick={() => setActiveTab('creators')}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approved Creators ({approvedCreators.length})</span>
              </button>
              <button 
                className={`px-6 py-5 text-sm font-semibold transition-all duration-300 border-b-3 flex items-center space-x-2 ${
                  activeTab === 'content' 
                    ? 'border-primary text-primary bg-primary/5 shadow-sm' 
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
                onClick={() => setActiveTab('content')}
              >
                <FileText className="w-4 h-4" />
                <span>Content & Deadlines</span>
              </button>
              <button 
                className={`px-6 py-5 text-sm font-semibold transition-all duration-300 border-b-3 flex items-center space-x-2 ${
                  activeTab === 'budget' 
                    ? 'border-primary text-primary bg-primary/5 shadow-sm' 
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
                onClick={() => setActiveTab('budget')}
              >
                <DollarSign className="w-4 h-4" />
                <span>Budget & Payments</span>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Draft Campaign Banner - Show only for draft campaigns */}
            {campaign.status === 'draft' ? (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200/50 rounded-2xl p-8 text-center shadow-lg">
                <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                  <div className="p-4 bg-yellow-100 rounded-2xl">
                    <FileText className="w-12 h-12 text-yellow-600" />
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h3 className="text-2xl font-bold text-yellow-800 mb-2">Campaign is in Draft</h3>
                    <p className="text-yellow-700 text-lg">This campaign is not yet published. Publish it to start receiving applications from creators.</p>
                  </div>
                  <button 
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground px-8 py-4 rounded-2xl transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    onClick={handlePublishCampaign}
                  >
                    <Play className="w-5 h-5" />
                    <span className="font-semibold">Publish Campaign</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Applications Tab */}
                {activeTab === 'applications' && (
                  <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search applicants by name, platform, or niche..."
                          value={applicationSearch}
                          onChange={(e) => setApplicationSearch(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-background border-2 border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-base"
                        />
                      </div>
                      <select 
                        value={applicationFilter} 
                        onChange={(e) => setApplicationFilter(e.target.value as any)}
                        className="px-4 py-3 bg-background border-2 border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-base font-medium"
                      >
                        <option value="all">All Applications</option>
                        <option value="pending">Pending</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <div className="grid gap-4">
                      {Array.isArray(filteredApplications) && filteredApplications.map((applicant) => (
                        <div key={applicant.id} className="bg-muted/30 border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors duration-200">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                            <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                                {applicant.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-foreground">{applicant.name}</h4>
                                <p className="text-muted-foreground">{applicant.email}</p>
                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                                  <span>📱 {applicant.platform}</span>
                                  <span>👥 {applicant.followers.toLocaleString()} followers</span>
                                  <span>📈 {applicant.engagementRate}% engagement</span>
                                  <span>🎯 {applicant.niche}</span>
                                  <span>📅 Applied {new Date(applicant.applicationDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                applicant.status === 'approved' ? 'bg-green-100 text-green-800' :
                                applicant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                applicant.status === 'shortlisted' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {applicant.status}
                              </span>
                              
                              {applicant.status === 'pending' && (
                                <div className="flex space-x-2">
                                  <button 
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition-colors duration-200 flex items-center space-x-1 text-sm"
                                    onClick={() => handleApplicationAction(applicant.id, 'approve')}
                                    disabled={updatingApplicationId === applicant.applicationId}
                                  >
                                    {updatingApplicationId === applicant.applicationId ? (
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                    ) : (
                                      <CheckCircle className="w-3 h-3" />
                                    )}
                                    <span>Approve</span>
                                  </button>
                                  <button 
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors duration-200 flex items-center space-x-1 text-sm"
                                    onClick={() => handleApplicationAction(applicant.id, 'shortlist')}
                                    disabled={updatingApplicationId === applicant.applicationId}
                                  >
                                    {updatingApplicationId === applicant.applicationId ? (
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                    ) : (
                                      <Star className="w-3 h-3" />
                                    )}
                                    <span>Shortlist</span>
                                  </button>
                                  <button 
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors duration-200 flex items-center space-x-1 text-sm"
                                    onClick={() => handleApplicationAction(applicant.id, 'reject')}
                                    disabled={updatingApplicationId === applicant.applicationId}
                                  >
                                    {updatingApplicationId === applicant.applicationId ? (
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                    ) : (
                                      <XCircle className="w-3 h-3" />
                                    )}
                                    <span>Reject</span>
                                  </button>
                                </div>
                              )}

                              {applicant.status === 'shortlisted' && (
                                <div className="flex space-x-2">
                                  <button 
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition-colors duration-200 flex items-center space-x-1 text-sm"
                                    onClick={() => handleApplicationAction(applicant.id, 'approve')}
                                    disabled={updatingApplicationId === applicant.applicationId}
                                  >
                                    {updatingApplicationId === applicant.applicationId ? (
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                    ) : (
                                      <CheckCircle className="w-3 h-3" />
                                    )}
                                    <span>Approve</span>
                                  </button>
                                  <button 
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg transition-colors duration-200 flex items-center space-x-1 text-sm"
                                    onClick={() => handleApplicationAction(applicant.id, 'pending')}
                                    disabled={updatingApplicationId === applicant.applicationId}
                                  >
                                    {updatingApplicationId === applicant.applicationId ? (
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                    ) : (
                                      <RotateCcw className="w-3 h-3" />
                                    )}
                                    <span>Pending</span>
                                  </button>
                                  <button 
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors duration-200 flex items-center space-x-1 text-sm"
                                    onClick={() => handleApplicationAction(applicant.id, 'reject')}
                                    disabled={updatingApplicationId === applicant.applicationId}
                                  >
                                    {updatingApplicationId === applicant.applicationId ? (
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                    ) : (
                                      <XCircle className="w-3 h-3" />
                                    )}
                                    <span>Reject</span>
                                  </button>
                                </div>
                              )}

                              {applicant.status === 'approved' && (
                                <div className="flex space-x-2">
                                  <button 
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors duration-200 flex items-center space-x-1 text-sm"
                                    onClick={() => console.log('Send message to', applicant.name)}
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                    <span>Message</span>
                                  </button>
                                  <button 
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors duration-200 flex items-center space-x-1 text-sm"
                                    onClick={() => handleApplicationAction(applicant.id, 'reject')}
                                    disabled={updatingApplicationId === applicant.applicationId}
                                  >
                                    {updatingApplicationId === applicant.applicationId ? (
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                    ) : (
                                      <XCircle className="w-3 h-3" />
                                    )}
                                    <span>Reject</span>
                                  </button>
                                </div>
                              )}

                              {applicant.status === 'rejected' && (
                                <button 
                                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg transition-colors duration-200 flex items-center space-x-1 text-sm"
                                  onClick={() => handleApplicationAction(applicant.id, 'pending')}
                                  disabled={updatingApplicationId === applicant.applicationId}
                                >
                                  {updatingApplicationId === applicant.applicationId ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                  ) : (
                                    <RotateCcw className="w-3 h-3" />
                                  )}
                                  <span>Reconsider</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other tabs content would go here */}
                {activeTab === 'creators' && (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-3xl p-12 max-w-md mx-auto">
                      <div className="p-4 bg-blue-100 rounded-2xl w-fit mx-auto mb-6">
                        <Users className="w-16 h-16 text-blue-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-blue-800 mb-3">Approved Creators</h3>
                      <p className="text-blue-600 text-lg">Manage your approved creators and track their deliverables here.</p>
                      <p className="text-blue-500 text-sm mt-2">Coming soon...</p>
                    </div>
                  </div>
                )}

                {activeTab === 'content' && (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-3xl p-12 max-w-md mx-auto">
                      <div className="p-4 bg-purple-100 rounded-2xl w-fit mx-auto mb-6">
                        <FileText className="w-16 h-16 text-purple-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-purple-800 mb-3">Content & Deliverables</h3>
                      <p className="text-purple-600 text-lg">Track content submissions and manage deadlines.</p>
                      <p className="text-purple-500 text-sm mt-2">Coming soon...</p>
                    </div>
                  </div>
                )}

                {activeTab === 'budget' && (
                  <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-3xl p-12 max-w-md mx-auto">
                      <div className="p-4 bg-yellow-100 rounded-2xl w-fit mx-auto mb-6">
                        <DollarSign className="w-16 h-16 text-yellow-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-yellow-800 mb-3">Budget & Payments</h3>
                      <p className="text-yellow-600 text-lg">Manage payments and track budget utilization.</p>
                      <p className="text-yellow-500 text-sm mt-2">Coming soon...</p>
                    </div>
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

export default ManageCampaign;
