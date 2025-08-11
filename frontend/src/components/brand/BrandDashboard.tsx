import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/brand/BrandDashboard.css';

interface Campaign {
  id: string;
  title: string;
  status: 'active' | 'pending' | 'completed';
  applicants: number;
  budget: string;
  deadline: string;
}

interface Application {
  id: string;
  creatorName: string;
  creatorEmail: string;
  followers: string;
  platform: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  campaignName: string;
}

const BrandDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'campaigns' | 'applications'>('dashboard');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [campaigns] = useState<Campaign[]>([
    {
      id: '1',
      title: 'Summer Fashion Campaign',
      status: 'active',
      applicants: 24,
      budget: '$5,000',
      deadline: '2025-09-15'
    },
    {
      id: '2',
      title: 'Tech Product Launch',
      status: 'pending',
      applicants: 12,
      budget: '$3,000',
      deadline: '2025-08-30'
    },
    {
      id: '3',
      title: 'Fitness Equipment Promo',
      status: 'active',
      applicants: 18,
      budget: '$4,500',
      deadline: '2025-09-20'
    },
    {
      id: '4',
      title: 'Beauty Brand Collaboration',
      status: 'completed',
      applicants: 35,
      budget: '$8,000',
      deadline: '2025-08-15'
    },
    {
      id: '5',
      title: 'Gaming Gear Showcase',
      status: 'active',
      applicants: 28,
      budget: '$6,500',
      deadline: '2025-10-01'
    },
    {
      id: '6',
      title: 'Eco-Friendly Products',
      status: 'pending',
      applicants: 15,
      budget: '$3,500',
      deadline: '2025-09-10'
    },
    {
      id: '7',
      title: 'Holiday Collection Launch',
      status: 'active',
      applicants: 42,
      budget: '$12,000',
      deadline: '2025-11-15'
    }
  ]);

  const [applications] = useState<Application[]>([
    {
      id: '1',
      creatorName: 'Sarah Johnson',
      creatorEmail: 'sarah@example.com',
      followers: '50K',
      platform: 'Instagram',
      status: 'pending',
      appliedDate: '2025-08-10',
      campaignName: 'Summer Fashion Campaign'
    },
    {
      id: '2',
      creatorName: 'Mike Chen',
      creatorEmail: 'mike@example.com',
      followers: '75K',
      platform: 'TikTok',
      status: 'pending',
      appliedDate: '2025-08-09',
      campaignName: 'Tech Product Launch'
    },
    {
      id: '3',
      creatorName: 'Emma Rodriguez',
      creatorEmail: 'emma@example.com',
      followers: '120K',
      platform: 'YouTube',
      status: 'approved',
      appliedDate: '2025-08-08',
      campaignName: 'Fitness Equipment Promo'
    },
    {
      id: '4',
      creatorName: 'Alex Kim',
      creatorEmail: 'alex@example.com',
      followers: '85K',
      platform: 'Instagram',
      status: 'rejected',
      appliedDate: '2025-08-07',
      campaignName: 'Beauty Brand Collaboration'
    },
    {
      id: '5',
      creatorName: 'Jessica Brown',
      creatorEmail: 'jessica@example.com',
      followers: '95K',
      platform: 'TikTok',
      status: 'approved',
      appliedDate: '2025-08-06',
      campaignName: 'Gaming Gear Showcase'
    },
    {
      id: '6',
      creatorName: 'David Wilson',
      creatorEmail: 'david@example.com',
      followers: '65K',
      platform: 'YouTube',
      status: 'pending',
      appliedDate: '2025-08-05',
      campaignName: 'Eco-Friendly Products'
    },
    {
      id: '7',
      creatorName: 'Lisa Martinez',
      creatorEmail: 'lisa@example.com',
      followers: '110K',
      platform: 'Instagram',
      status: 'pending',
      appliedDate: '2025-08-04',
      campaignName: 'Holiday Collection Launch'
    },
    {
      id: '8',
      creatorName: 'Ryan Taylor',
      creatorEmail: 'ryan@example.com',
      followers: '45K',
      platform: 'TikTok',
      status: 'approved',
      appliedDate: '2025-08-03',
      campaignName: 'Summer Fashion Campaign'
    },
    {
      id: '9',
      creatorName: 'Sophie Anderson',
      creatorEmail: 'sophie@example.com',
      followers: '78K',
      platform: 'YouTube',
      status: 'pending',
      appliedDate: '2025-08-02',
      campaignName: 'Tech Product Launch'
    },
    {
      id: '10',
      creatorName: 'Carlos Garcia',
      creatorEmail: 'carlos@example.com',
      followers: '92K',
      platform: 'Instagram',
      status: 'rejected',
      appliedDate: '2025-08-01',
      campaignName: 'Fitness Equipment Promo'
    },
    {
      id: '11',
      creatorName: 'Maya Patel',
      creatorEmail: 'maya@example.com',
      followers: '135K',
      platform: 'TikTok',
      status: 'approved',
      appliedDate: '2025-07-31',
      campaignName: 'Beauty Brand Collaboration'
    },
    {
      id: '12',
      creatorName: 'Tom Lewis',
      creatorEmail: 'tom@example.com',
      followers: '58K',
      platform: 'YouTube',
      status: 'pending',
      appliedDate: '2025-07-30',
      campaignName: 'Gaming Gear Showcase'
    }
  ]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCreateCampaign = () => {
    // Handle create campaign logic
    console.log('Creating new campaign...');
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
    <div className="brand-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="brand-name">SponsorConnect</h1>
          <nav className="main-nav">
            <button 
              className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`nav-btn ${activeTab === 'campaigns' ? 'active' : ''}`}
              onClick={() => setActiveTab('campaigns')}
            >
              Campaigns
            </button>
            <button 
              className={`nav-btn ${activeTab === 'applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('applications')}
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
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Welcome Section */}
          <div className="welcome-section">
            <h2>Welcome back, Brand Name</h2>
          </div>

          {/* Quick Stats - Single Row */}
          <div className="quick-stats">
            <div className="stat-card" onClick={handleCreateCampaign}>
              <div className="stat-icon">📝</div>
              <div className="stat-info">
                <span className="stat-number">Create</span>
                <span className="stat-label">Campaign</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🚀</div>
              <div className="stat-info">
                <span className="stat-number">{campaigns.filter(c => c.status === 'active').length}</span>
                <span className="stat-label">Active Campaigns</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <span className="stat-number">{applications.filter(a => a.status === 'pending').length}</span>
                <span className="stat-label">Pending Applications</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <span className="stat-number">{applications.filter(a => a.status === 'approved').length}</span>
                <span className="stat-label">Approved Applications</span>
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
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="campaign-card">
                    <div className="campaign-header">
                      <h3>{campaign.title}</h3>
                      <span className={`campaign-status ${campaign.status}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <div className="campaign-details">
                      <p><strong>Budget:</strong> {campaign.budget}</p>
                      <p><strong>Applicants:</strong> {campaign.applicants}</p>
                      <p><strong>Deadline:</strong> {campaign.deadline}</p>
                    </div>
                    <div className="campaign-actions">
                      <button className="btn-secondary">Edit</button>
                      <button className="btn-primary">View Applications</button>
                    </div>
                  </div>
                ))}    
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
                          <span className="applied-date">{application.appliedDate}</span>
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
