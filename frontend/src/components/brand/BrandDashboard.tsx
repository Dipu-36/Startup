import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { APP_NAME } from '../../config/appConfig';
import BrandNavbar from './BrandNavbar';
import '../../styles/brand/BrandDashboard.css';

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

const BrandDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'campaigns' | 'applications'>('dashboard');
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

  return (
    <div className="brand-dashboard">
      <BrandNavbar activeTab="dashboard" />

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Welcome Section */}
          <div className="welcome-section">
            <h2>Welcome back, Brand Name</h2>
          </div>

          {/* Quick Stats - Single Row */}
          <div className="brand-quick-stats">
            <div className="brand-stat-card" onClick={handleCreateCampaign}>
              <div className="brand-stat-icon">📝</div>
              <div className="brand-stat-info">
                <span className="brand-stat-number">Create</span>
                <span className="brand-stat-label">Campaign</span>
              </div>
            </div>
            <div className="brand-stat-card">
              <div className="brand-stat-icon">🚀</div>
              <div className="brand-stat-info">
                <span className="brand-stat-number">{campaigns.filter(c => c.status === 'active').length}</span>
                <span className="brand-stat-label">Active Campaigns</span>
              </div>
            </div>
            <div className="brand-stat-card">
              <div className="brand-stat-icon">⏳</div>
              <div className="brand-stat-info">
                <span className="brand-stat-number">{applications.filter(a => a.status === 'pending').length}</span>
                <span className="brand-stat-label">Pending Applications</span>
              </div>
            </div>
            <div className="brand-stat-card">
              <div className="brand-stat-icon">✅</div>
              <div className="brand-stat-info">
                <span className="brand-stat-number">{applications.filter(a => a.status === 'approved').length}</span>
                <span className="brand-stat-label">Approved Applications</span>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="content-grid">
            {/* Campaigns Section */}
            <section className="campaigns-section">
              <div className="section-header">
                <h2>Campaigns</h2>
              </div>
              <div className="campaigns-grid">
                {loading ? (
                  <div className="loading-state">
                    <p>Loading campaigns...</p>
                  </div>
                ) : error ? (
                  <div className="error-state">
                    <p>{error}</p>
                  </div>
                ) : campaigns.length === 0 ? (
                  <div className="empty-state">
                    <p>No campaigns found. Create your first campaign to get started!</p>
                    <button 
                      className="btn-primary"
                      onClick={() => navigate('/brand/create-campaign')}
                    >
                      Create Campaign
                    </button>
                  </div>
                ) : (
                  campaigns.map((campaign) => (
                    <div key={campaign.id} className="campaign-card">
                      <div className="campaign-header">
                        <h3>{campaign.title}</h3>
                        <span className={`campaign-status ${campaign.status}`}>
                          {campaign.status}
                        </span>
                      </div>
                      <div className="campaign-details">
                        <p><strong>Budget:</strong> ${campaign.paymentAmount}</p>
                        <p><strong>Applicants:</strong> {campaign.applicants}</p>
                        <p><strong>End Date:</strong> {campaign.endDate}</p>
                      </div>
                      <div className="campaign-actions">
                        <button className="btn-secondary">Edit</button>
                        <button className="btn-primary">View Applications</button>
                      </div>
                    </div>
                  ))
                )}   
              </div>
            </section>

            {/* Applications Section */}
            <section className="applications-section">
              <div className="section-header">
                <h2>Recent Applications</h2>
              </div>
              <div className="applications-container">
                <div className="applications-list">
                  {applications.map((application) => (
                    <div key={application.id} className="application-item">
                      <div className="application-info">
                        <div className="creator-details">
                          <h4>{application.creatorName}</h4>
                          <p className="platform-info">{application.platform} • {application.followers}</p>
                          <p className="campaign-info">Applied for: <strong>{application.campaignName}</strong></p>
                        </div>
                        <div className="application-meta">
                          <span className={`status ${application.status}`}>
                            {application.status}
                          </span>
                          <span className="applied-date">
                            {new Date(application.appliedDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
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

export default BrandDashboard;
