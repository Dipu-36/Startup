import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import BrandNavbar from './BrandNavbar';
import { Users, Clock, CheckCircle, XCircle, FileText, Mail, Calendar } from 'lucide-react';

interface Application {
  id: string;
  campaignId: string;
  campaignTitle: string;
  creatorName: string;
  creatorEmail: string;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  metrics: {
    followers: number;
    engagement: number;
    reach?: number;
  };
}

const Applications: React.FC = () => {
  const { getToken } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const response = await fetch('http://localhost:8080/api/applications/brand', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setApplications(data || []);
        } else {
          // Mock data for development
          const mockApplications: Application[] = [
            {
              id: '1',
              campaignId: 'camp1',
              campaignTitle: 'Summer Fashion Collection',
              creatorName: 'Sarah Johnson',
              creatorEmail: 'sarah@example.com',
              appliedAt: '2024-01-15T10:30:00Z',
              status: 'pending',
              message: 'I love your brand and would be excited to showcase your summer collection to my fashion-focused audience.',
              metrics: {
                followers: 25000,
                engagement: 4.2,
                reach: 50000
              }
            },
            {
              id: '2',
              campaignId: 'camp1',
              campaignTitle: 'Summer Fashion Collection',
              creatorName: 'Mike Chen',
              creatorEmail: 'mike@example.com',
              appliedAt: '2024-01-14T15:45:00Z',
              status: 'approved',
              message: 'Your brand aligns perfectly with my lifestyle content. Looking forward to collaboration!',
              metrics: {
                followers: 45000,
                engagement: 3.8,
                reach: 80000
              }
            },
            {
              id: '3',
              campaignId: 'camp2',
              campaignTitle: 'Tech Product Launch',
              creatorName: 'Alex Rivera',
              creatorEmail: 'alex@example.com',
              appliedAt: '2024-01-13T09:20:00Z',
              status: 'rejected',
              message: 'I specialize in tech reviews and would love to feature your new product.',
              metrics: {
                followers: 15000,
                engagement: 5.1,
                reach: 30000
              }
            }
          ];
          setApplications(mockApplications);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [getToken]);

  const handleStatusUpdate = async (applicationId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:8080/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setApplications(prev => 
          prev.map(app => 
            app.id === applicationId 
              ? { ...app, status: newStatus }
              : app
          )
        );
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const filteredApplications = applications.filter(app => 
    filter === 'all' || app.status === filter
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <BrandNavbar activeTab="applications" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
              <p className="text-gray-600">Manage creator applications for your campaigns</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {applications.filter(app => app.status === 'pending').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {applications.filter(app => app.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {applications.filter(app => app.status === 'rejected').length}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
            {['all', 'pending', 'approved', 'rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  filter === tab
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "You haven't received any applications yet."
                : `No ${filter} applications found.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div key={application.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{application.creatorName}</h3>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-1">Campaign: <span className="font-medium">{application.campaignTitle}</span></p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {application.creatorEmail}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(application.appliedAt)}
                        </div>
                      </div>
                      
                      {/* Metrics */}
                      <div className="flex items-center gap-6 mb-4">
                        <div className="text-sm">
                          <span className="text-gray-500">Followers:</span>
                          <span className="font-medium text-gray-900 ml-1">
                            {application.metrics.followers.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Engagement:</span>
                          <span className="font-medium text-gray-900 ml-1">
                            {application.metrics.engagement}%
                          </span>
                        </div>
                        {application.metrics.reach && (
                          <div className="text-sm">
                            <span className="text-gray-500">Reach:</span>
                            <span className="font-medium text-gray-900 ml-1">
                              {application.metrics.reach.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Message */}
                      {application.message && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <p className="text-sm text-gray-700">{application.message}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {application.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleStatusUpdate(application.id, 'approved')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(application.id, 'rejected')}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
