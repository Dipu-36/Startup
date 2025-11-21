// Campaign service for API calls
import { getAuthHeadersWithToken } from '../utils/auth';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export interface Campaign {
  id: string;
  title: string;
  status: 'draft' | 'active' | 'completed' | 'paused';
  startDate: string;
  endDate: string;
  category: string;
  description: string;
  budget?: number;
  usedBudget?: number;
  applicantsCount?: number;
  approvedCreators?: number;
  deliverablesCount?: number;
  brandId: string;
  brandName: string;
  campaignType: string;
  platforms: string[];
  contentFormat?: string[];
  languages?: string[];
  approvalSteps?: any | null;
  createdAt: string;
  updatedAt: string;
  // Additional fields from the API response
  targetAudience?: {
    location?: string;
    ageGroup?: string;
    gender?: string;
    interests?: string;
    targetAudienceAge?: string | null;
    targetAudienceGender?: string | null;
    targetAudienceRegion?: string | null;
    languagePreference?: string;
    customRegion?: string;
  };
  minRequirements?: {
    followersCount?: string;
    engagementRate?: string;
    contentStyle?: string;
  };
  currency?: string;
  minimumFollowers?: string;
  minimumEngagement?: string;
  creatorTier?: string;
  nicheMatch?: boolean;
  geographicRestrictions?: string;
  numberOfPosts?: string;
  hashtagsToUse?: string;
  mentionsRequired?: string;
  contentGuidelines?: string;
  creativeApprovalNeeded?: boolean;
  approvalRequired?: boolean;
  compensationType?: string;
  paymentAmount?: string;
  commissionPercentage?: string;
  freeProductsOffered?: string;
  deliverables?: string;
  performanceBonus?: boolean;
  bonusCriteria?: string;
  productDetails?: string;
  deadlineReminders?: boolean;
  communicationChannel?: string;
  timeZone?: string;
  bannerImageUrl?: string;
  referenceLinks?: string;
  referenceMedia?: string;
  applicants?: number;
}

export interface Application {
  id: string;
  campaignId: string;
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  followers: string;
  platform: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  campaignName: string;
}

export interface Creator {
  id: string; // This will be the creatorId for display purposes
  applicationId: string; // This is the actual application ID for API calls
  name: string;
  email: string;
  platform: string;
  followers: number;
  engagementRate?: number;
  niche?: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'shortlisted';
  profileImage?: string;
  campaignId: string;
  campaignName: string;
}

export interface Deliverable {
  id: string;
  creatorId: string;
  creatorName: string;
  type: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'approved' | 'revision_needed';
  submissionDate?: string;
  content?: string;
}

export interface PaymentRecord {
  id: string;
  creatorId: string;
  creatorName: string;
  amount: number;
  status: 'pending' | 'paid' | 'processing';
  dueDate: string;
}

class CampaignService {
  // Get all active campaigns for browsing (for creators)
  async getAllCampaigns(token?: string): Promise<Campaign[]> {
    const response = await fetch(`${API_BASE_URL}/campaigns/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeadersWithToken(token),
      },
    });

    if (!response.ok) {
      const error = await response.text();
      
      if (response.status === 503) {
        throw new Error('Authentication service temporarily unavailable. Please try again in a few moments.');
      } else if (response.status === 401) {
        throw new Error('Your session has expired. Please log in again.');
      } else {
        throw new Error(error || 'Failed to fetch campaigns');
      }
    }

    const campaignsData = await response.json();
    
    // Ensure campaigns is an array, fallback to empty array if null/undefined
    const campaignsArray = Array.isArray(campaignsData) ? campaignsData : [];
    
    // Ensure array fields are arrays for each campaign
    return campaignsArray.map(campaign => ({
      ...campaign,
      platforms: Array.isArray(campaign.platforms) ? campaign.platforms : [],
      contentFormat: Array.isArray(campaign.contentFormat) ? campaign.contentFormat : [],
      languages: Array.isArray(campaign.languages) ? campaign.languages : [],
    }));
  }

  // Get campaigns for a brand (for brand dashboard)
  async getBrandCampaigns(token?: string): Promise<Campaign[]> {
    const response = await fetch(`${API_BASE_URL}/campaigns`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeadersWithToken(token),
      },
    });

    if (!response.ok) {
      const error = await response.text();
      
      if (response.status === 503) {
        throw new Error('Authentication service temporarily unavailable. Please try again in a few moments.');
      } else if (response.status === 401) {
        throw new Error('Your session has expired. Please log in again.');
      } else {
        throw new Error(error || 'Failed to fetch campaigns');
      }
    }

    const campaignsData = await response.json();
    
    // Ensure campaigns is an array, fallback to empty array if null/undefined
    const campaignsArray = Array.isArray(campaignsData) ? campaignsData : [];
    
    // Ensure array fields are arrays for each campaign
    return campaignsArray.map(campaign => ({
      ...campaign,
      platforms: Array.isArray(campaign.platforms) ? campaign.platforms : [],
      contentFormat: Array.isArray(campaign.contentFormat) ? campaign.contentFormat : [],
      languages: Array.isArray(campaign.languages) ? campaign.languages : [],
    }));
  }

  // Apply to a campaign (for creators)
  async applyCampaign(campaignId: string, applicationData: { followers: string; platform: string }, token?: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeadersWithToken(token),
      },
      body: JSON.stringify(applicationData),
    });

    if (!response.ok) {
      const error = await response.text();
      
      if (response.status === 503) {
        throw new Error('Authentication service temporarily unavailable. Please try again in a few moments.');
      } else if (response.status === 401) {
        throw new Error('Your session has expired. Please log in again.');
      } else if (response.status === 409) {
        throw new Error('You have already applied to this campaign.');
      } else {
        throw new Error(error || 'Failed to apply to campaign');
      }
    }

    return await response.json();
  }

  // Get creator's applications
  async getCreatorApplications(token?: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/applications/creator`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeadersWithToken(token),
      },
    });

    if (!response.ok) {
      const error = await response.text();
      
      if (response.status === 503) {
        throw new Error('Authentication service temporarily unavailable. Please try again in a few moments.');
      } else if (response.status === 401) {
        throw new Error('Your session has expired. Please log in again.');
      } else {
        throw new Error(error || 'Failed to fetch applications');
      }
    }

    const applicationsData = await response.json();
    
    // Ensure applications is an array, fallback to empty array if null/undefined
    return Array.isArray(applicationsData) ? applicationsData : [];
  }

  async getCampaign(campaignId: string, token?: string): Promise<Campaign> {
    const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeadersWithToken(token),
      },
    });

    if (!response.ok) {
      const error = await response.text();
      
      if (response.status === 503) {
        throw new Error('Authentication service temporarily unavailable. Please try again in a few moments.');
      } else if (response.status === 401) {
        throw new Error('Your session has expired. Please log in again.');
      } else {
        throw new Error(error || 'Failed to fetch campaign');
      }
    }

    const campaignData = await response.json();
    
    // Ensure array fields are arrays, not null
    return {
      ...campaignData,
      platforms: Array.isArray(campaignData.platforms) ? campaignData.platforms : [],
      contentFormat: Array.isArray(campaignData.contentFormat) ? campaignData.contentFormat : [],
      languages: Array.isArray(campaignData.languages) ? campaignData.languages : [],
    };
  }

  async getCampaignApplications(campaignId: string, token?: string): Promise<Creator[]> {
    const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/applications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeadersWithToken(token),
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to fetch applications');
    }

    const applications = await response.json();
    
    // Ensure applications is an array, fallback to empty array if null/undefined
    const applicationsArray = Array.isArray(applications) ? applications : [];
    
    // Transform backend Application model to frontend Creator interface
    return applicationsArray.map((app: any): Creator => ({
      id: app.creatorId,
      applicationId: app.id, // Use the actual application ID
      name: app.creatorName,
      email: app.creatorEmail,
      platform: app.platform,
      followers: typeof app.followers === 'string' ? parseInt(app.followers) || 0 : app.followers,
      engagementRate: app.engagementRate || 0,
      niche: app.niche || 'General',
      applicationDate: app.appliedDate,
      status: app.status,
      profileImage: app.profileImage,
      campaignId: app.campaignId,
      campaignName: app.campaignName,
    }));
  }

  async updateApplicationStatus(applicationId: string, status: 'pending' | 'approved' | 'rejected' | 'shortlisted', token?: string): Promise<Creator> {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeadersWithToken(token),
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to update application status');
    }

    const updatedApp = await response.json();
    
    // Transform backend Application model to frontend Creator interface
    return {
      id: updatedApp.creatorId,
      applicationId: updatedApp.id, // Use the actual application ID
      name: updatedApp.creatorName,
      email: updatedApp.creatorEmail,
      platform: updatedApp.platform,
      followers: typeof updatedApp.followers === 'string' ? parseInt(updatedApp.followers) || 0 : updatedApp.followers,
      engagementRate: updatedApp.engagementRate || 0,
      niche: updatedApp.niche || 'General',
      applicationDate: updatedApp.appliedDate,
      status: updatedApp.status,
      profileImage: updatedApp.profileImage,
      campaignId: updatedApp.campaignId,
      campaignName: updatedApp.campaignName,
    };
  }

  // Mock methods for deliverables and payments (to be implemented later)
  async getCampaignDeliverables(campaignId: string, token?: string): Promise<Deliverable[]> {
    // TODO: Implement when deliverables API is ready
    return [
      {
        id: '1',
        creatorId: '3',
        creatorName: 'Creator',
        type: 'Instagram Post',
        dueDate: '2025-08-20',
        status: 'submitted',
        submissionDate: '2025-08-19'
      },
      {
        id: '2',
        creatorId: '3',
        creatorName: 'Creator',
        type: 'Instagram Story',
        dueDate: '2025-08-25',
        status: 'pending'
      }
    ];
  }

  async getCampaignPayments(campaignId: string, token?: string): Promise<PaymentRecord[]> {
    // TODO: Implement when payments API is ready
    return [
      {
        id: '1',
        creatorId: '3',
        creatorName: 'Creator',
        amount: 2500,
        status: 'pending',
        dueDate: '2025-08-25'
      }
    ];
  }

  async publishCampaign(campaignId: string, token?: string): Promise<Campaign> {
    const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/publish`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeadersWithToken(token),
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to publish campaign');
    }

    const campaignData = await response.json();
    
    // Ensure array fields are arrays, not null
    return {
      ...campaignData,
      platforms: Array.isArray(campaignData.platforms) ? campaignData.platforms : [],
      contentFormat: Array.isArray(campaignData.contentFormat) ? campaignData.contentFormat : [],
      languages: Array.isArray(campaignData.languages) ? campaignData.languages : [],
    };
  }

  async applyToCampaign(campaignId: string, applicationData?: { followers?: string, platform?: string }, token?: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeadersWithToken(token),
      },
      body: JSON.stringify(applicationData || { followers: '', platform: '' }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to apply to campaign');
    }
  }
}

const campaignService = new CampaignService();
export default campaignService;
