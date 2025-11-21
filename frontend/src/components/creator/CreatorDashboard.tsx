import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, Clock, DollarSign, Users, TrendingUp, Calendar, MapPin, Target, Eye } from 'lucide-react';
import CreatorNavbar from './CreatorNavbar';
import campaignService, { Campaign, Application } from '../../services/campaignService';

const CreatorDashboard = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [availableCampaigns, setAvailableCampaigns] = useState<Campaign[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userName = user?.firstName || user?.fullName || 'Creator';
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || '';

  useEffect(() => {
    fetchData();
  }, [user, getToken]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the authentication token
      const token = await getToken();
      
      // Fetch campaigns and applications in parallel
      const [campaignsData, applicationsData] = await Promise.all([
        campaignService.getAllCampaigns(token || undefined),
        campaignService.getCreatorApplications(token || undefined)
      ]);
      
      setAvailableCampaigns(campaignsData);
      setApplications(applicationsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again later.');
      
      // Set empty arrays on error
      setAvailableCampaigns([]);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter campaigns to exclude ones the user has already applied to
  const getFilteredCampaigns = () => {
    const appliedCampaignIds = applications.map(app => app.campaignId);
    return availableCampaigns.filter(campaign => !appliedCampaignIds.includes(campaign.id));
  };

  const handleApplyToCampaign = async (campaignId: string) => {
    try {
      if (!user?.id) {
        alert('Please log in to apply to campaigns');
        return;
      }

      const token = await getToken();
      await campaignService.applyToCampaign(campaignId, undefined, token || undefined);
      alert('Application submitted successfully!');
      
      // Refresh applications to update the filtered campaign list
      const updatedApplications = await campaignService.getCreatorApplications(token || undefined);
      setApplications(updatedApplications);
    } catch (error) {
      console.error('Error applying to campaign:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  const handleBrowseCampaigns = () => {
    // For now, we'll scroll to the campaigns section
    // In the future, this could navigate to a dedicated campaigns page
    const campaignsSection = document.getElementById('campaigns-section');
    if (campaignsSection) {
      campaignsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CreatorNavbar activeTab="dashboard" />
      
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-teal-600 rounded-lg flex items-center justify-center mr-3">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {userName}!
            </h1>
          </div>
          <p className="text-gray-600 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Here's what's happening with your campaigns today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {/* Browse Campaigns Card */}
          <div 
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer group"
            onClick={handleBrowseCampaigns}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">New</div>
              <div className="text-sm text-gray-600">Browse Campaigns</div>
            </div>
          </div>

          {/* Available Campaigns */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{getFilteredCampaigns().length}</div>
              <div className="text-sm text-gray-600">Available Campaigns</div>
            </div>
          </div>

          {/* Pending Applications */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{applications.filter(a => a.status === 'pending').length}</div>
              <div className="text-sm text-gray-600">Pending Applications</div>
            </div>
          </div>

          {/* Approved Applications */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{applications.filter(a => a.status === 'approved').length}</div>
              <div className="text-sm text-gray-600">Approved Applications</div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Available Campaigns Section */}
          <div className="xl:col-span-2" id="campaigns-section">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-fit">
              <div className="flex items-center mb-6">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-teal-600 rounded mr-3">
                  <Search className="w-6 h-6 text-white p-1" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Recent Campaigns</h2>
              </div>
              
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-red-600" />
                    </div>
                    <p className="text-gray-600">{error}</p>
                  </div>
                ) : getFilteredCampaigns().length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No new campaigns available</h3>
                    <p className="text-gray-600">You've applied to all available campaigns or check back later for new opportunities!</p>
                  </div>
                ) : (
                  getFilteredCampaigns().slice(0, 3).map((campaign) => (
                    <div key={campaign.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{campaign.title}</h3>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Target className="w-4 h-4 mr-1" />
                            <span className="mr-4">{campaign.brandName}</span>
                            <Users className="w-4 h-4 mr-1" />
                            <span className="mr-4">{campaign.platforms.join(', ')}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <DollarSign className="w-4 h-4 mr-1" />
                            <span className="mr-4">{campaign.paymentAmount}</span>
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{new Date(campaign.endDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            active
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                          View Details
                        </button>
                        <button 
                          className="px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-md hover:from-purple-700 hover:to-teal-700 transition-all duration-200"
                          onClick={() => handleApplyToCampaign(campaign.id)}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))
                )}   
              </div>
            </div>
          </div>

          {/* Applications Section */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-fit">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-teal-600 rounded mr-3">
                    <Eye className="w-6 h-6 text-white p-1" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
                </div>
              </div>
              
              <div className="space-y-4">
                {applications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Eye className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-center">No applications yet</p>
                    <button
                      onClick={handleBrowseCampaigns}
                      className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-lg hover:from-purple-700 hover:to-teal-700 transition-all duration-200"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Browse Campaigns
                    </button>
                  </div>
                ) : (
                  applications.slice(0, 5).map((application) => (
                    <div key={application.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{application.campaignName}</h4>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Users className="w-4 h-4 mr-1" />
                            <span className="mr-3">{application.platform}</span>
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span>{application.followers}</span>
                          </div>
                          <p className="text-xs text-gray-500">
                            Applied {new Date(application.appliedDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="ml-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            application.status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : application.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {application.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatorDashboard;
