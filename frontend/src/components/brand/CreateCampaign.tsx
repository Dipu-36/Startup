import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Rocket, 
  Target, 
  Users, 
  Calendar, 
  Heart, 
  Eye, 
  Globe, 
  DollarSign,
  FileText,
  Image,
  CheckCircle2
} from 'lucide-react';

interface CampaignFormData {
  // Section 1: Basic Information (MANDATORY)
  title: string;
  brandName: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  campaignType: string;
  budget: string;
  currency: string;

  // Section 2: Audience Targeting (Optional)
  targetAudience: {
    location: string;
    ageGroup: string;
    gender: string;
    interests: string;
  };
  targetAudienceAge: string[];
  targetAudienceGender: string[];
  targetAudienceRegion: string[];
  languagePreference: string;
  customRegion: string;

  // Section 3: Content Requirements (Optional)
  platforms: string[];
  contentFormat: string[];
  numberOfPosts: string;
  contentDuration: string;
  hashtagsToUse: string;
  mentionsRequired: string;
  contentGuidelines: string;
  referenceLinks: string;
  creativeApprovalNeeded: boolean;

  // Section 4: Creator Requirements (Optional)
  minRequirements: {
    followersCount: string;
    engagementRate: string;
    contentStyle: string;
    languages: string[];
  };
  minimumFollowers: string;
  minimumEngagement: string;
  creatorTier: string;
  nicheMatch: boolean;
  geographicRestrictions: string;

  // Section 5: Compensation & Deliverables (Optional)
  compensationType: string;
  paymentAmount: string;
  commissionPercentage: string;
  freeProductsOffered: string;
  deliverables: string;
  performanceBonus: boolean;
  bonusCriteria: string;
  productDetails: string;

  // Section 6: Campaign Workflow (Optional)
  approvalRequired: boolean;
  approvalSteps: string[];
  deadlineReminders: boolean;
  communicationChannel: string;
  timeZone: string;
  campaignPriority: string;
  postingSchedule: string;

  // Section 7: Media & Assets (Optional)
  bannerImage: File | null;
  referenceMedia: string;
}

const CreateCampaign = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [lastSavedDataHash, setLastSavedDataHash] = useState<string>('');

  // Initial form data structure
  const initialFormData: CampaignFormData = {
    // Section 1: Basic Information (MANDATORY)
    title: '',
    brandName: user?.name || '',
    description: '',
    category: '',
    startDate: '',
    endDate: '',
    campaignType: '',
    budget: '',
    currency: '',

    // Section 2: Audience Targeting (Optional)
    targetAudience: {
      location: '',
      ageGroup: '',
      gender: '',
      interests: '',
    },
    targetAudienceAge: [],
    targetAudienceGender: [],
    targetAudienceRegion: [],
    languagePreference: '',
    customRegion: '',

    // Section 3: Content Requirements (Optional)
    platforms: [],
    contentFormat: [],
    numberOfPosts: '',
    contentDuration: '',
    hashtagsToUse: '',
    mentionsRequired: '',
    contentGuidelines: '',
    referenceLinks: '',
    creativeApprovalNeeded: false,

    // Section 4: Creator Requirements (Optional)
    minRequirements: {
      followersCount: '',
      engagementRate: '',
      contentStyle: '',
      languages: [],
    },
    minimumFollowers: '',
    minimumEngagement: '',
    creatorTier: '',
    nicheMatch: false,
    geographicRestrictions: '',

    // Section 5: Compensation & Deliverables (Optional)
    compensationType: '',
    paymentAmount: '',
    commissionPercentage: '',
    freeProductsOffered: '',
    deliverables: '',
    performanceBonus: false,
    bonusCriteria: '',
    productDetails: '',

    // Section 6: Campaign Workflow (Optional)
    approvalRequired: false,
    approvalSteps: [],
    deadlineReminders: false,
    communicationChannel: '',
    timeZone: '',
    campaignPriority: '',
    postingSchedule: '',

    // Section 7: Media & Assets (Optional)
    bannerImage: null,
    referenceMedia: '',
  };

  const [formData, setFormData] = useState<CampaignFormData>(initialFormData);

  // Categories
  const categories = [
    'Tech', 'Fashion', 'Gaming', 'Fitness', 'Food', 'Travel', 
    'Beauty', 'Lifestyle', 'Business', 'Education', 'Entertainment'
  ];

  // Campaign Types
  const campaignTypes = [
    'Product Review',
    'Affiliate Partnership', 
    'Event Coverage',
    'Brand Awareness',
    'Social Media Shoutout',
    'Content Collaboration'
  ];

  // Platforms
  const platforms = [
    'YouTube', 'Instagram', 'TikTok', 'Twitch', 'Blog', 
    'Twitter', 'LinkedIn', 'Facebook', 'Pinterest'
  ];

  // Content Formats
  const contentFormats = [
    'Video', 'Reel', 'Story', 'Blog Post', 'Livestream', 
    'Photo Post', 'Tweet', 'Podcast'
  ];

  // Languages
  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 
    'Portuguese', 'Japanese', 'Korean', 'Chinese'
  ];

  // Compensation Types
  const compensationTypes = [
    'Fixed Payment',
    'Commission/Affiliate',
    'Free Product/Service',
    'Event Invitation'
  ];

  // Save draft to localStorage
  const saveDraft = useCallback(() => {
    // Create a hash of the current form data to check if it has changed
    const currentDataHash = JSON.stringify(formData);
    
    // Don't save if data hasn't changed
    if (currentDataHash === lastSavedDataHash) {
      return;
    }
    
    // Don't save if form is essentially empty (only has brand name)
    const hasMeaningfulData = formData.title.trim() || 
                             formData.description.trim() || 
                             formData.category || 
                             formData.campaignType;
    
    if (!hasMeaningfulData) {
      return;
    }
    
    localStorage.setItem('campaignDraft', currentDataHash);
    setLastSavedDataHash(currentDataHash);
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 2000);
  }, [formData, lastSavedDataHash]);

  // Load draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('campaignDraft');
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        // Ensure all required array fields exist
        const safeData = {
          ...initialFormData,
          ...parsedDraft,
          brandName: user?.name || parsedDraft.brandName,
          platforms: parsedDraft.platforms || [],
          contentFormat: parsedDraft.contentFormat || [],
          targetAudienceAge: parsedDraft.targetAudienceAge || [],
          targetAudienceGender: parsedDraft.targetAudienceGender || [],
          targetAudienceRegion: parsedDraft.targetAudienceRegion || [],
          approvalSteps: parsedDraft.approvalSteps || [],
          minRequirements: {
            ...initialFormData.minRequirements,
            ...parsedDraft.minRequirements,
            languages: parsedDraft.minRequirements?.languages || []
          }
        };
        setFormData(safeData);
        // Set the hash to prevent immediate auto-save notification
        setLastSavedDataHash(JSON.stringify(safeData));
      } catch (error) {
        console.error('Error loading draft:', error);
        // Clear corrupted localStorage data
        localStorage.removeItem('campaignDraft');
      }
    }
  }, [user]);

  // Auto-save every 30 seconds (increased from 2 seconds)
  useEffect(() => {
    if (formSubmitted) return; // Don't auto-save after form submission
    
    const interval = setInterval(() => {
      saveDraft();
    }, 30000); // Changed from 2000ms (2s) to 30000ms (30s)

    return () => clearInterval(interval);
  }, [formSubmitted, saveDraft]);

  // Debounced save when user makes changes (after 3 seconds of inactivity)
  useEffect(() => {
    if (formSubmitted) return;
    
    const debounceTimer = setTimeout(() => {
      saveDraft();
    }, 3000); // Save 3 seconds after user stops typing

    return () => clearTimeout(debounceTimer);
  }, [formData, formSubmitted, saveDraft]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = field.split('.');
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = field.split('.');
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      const array = current[keys[keys.length - 1]] as string[] || [];
      if (checked) {
        current[keys[keys.length - 1]] = [...array, value];
      } else {
        current[keys[keys.length - 1]] = array.filter(item => item !== value);
      }
      
      return newData;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, bannerImage: file }));
  };

  const handleClearDraft = () => {
    if (window.confirm('Are you sure you want to clear all form data? This action cannot be undone.')) {
      localStorage.removeItem('campaignDraft');
      setFormData({ ...initialFormData, brandName: user?.name || '' });
      alert('Draft cleared successfully!');
    }
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    try {
      setIsSubmitting(true);

      // Prepare campaign data for submission
      const campaignData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        startDate: formData.startDate,
        endDate: formData.endDate,
        campaignType: formData.campaignType,
        
        targetAudience: formData.targetAudience,
        platforms: formData.platforms,
        minRequirements: formData.minRequirements,
        nicheMatch: formData.nicheMatch,
        geographicRestrictions: formData.geographicRestrictions,
        
        contentFormat: formData.contentFormat,
        numberOfPosts: formData.numberOfPosts,
        contentGuidelines: formData.contentGuidelines,
        approvalRequired: formData.approvalRequired,
        
        compensationType: formData.compensationType,
        paymentAmount: formData.paymentAmount,
        productDetails: formData.productDetails,
        
        bannerImageUrl: '', // TODO: Implement image upload
        referenceLinks: formData.referenceLinks,
        status: isDraft ? 'draft' : 'active'
      };

      // Get auth token
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to create a campaign');
        navigate('/login');
        return;
      }

      // Submit to backend
      const response = await fetch('http://localhost:8080/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(campaignData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `Failed to ${isDraft ? 'save draft' : 'create campaign'}`);
      }

      const result = await response.json();
      console.log(`Campaign ${isDraft ? 'draft saved' : 'created'}:`, result);
      
      // Set flag to prevent auto-save
      setFormSubmitted(true);
      
      if (isDraft) {
        // Clear local draft since it's now saved to database
        localStorage.removeItem('campaignDraft');
        alert('Campaign saved as draft successfully!');
        setIsSubmitting(false);
        return;
      }
      
      // Show loading screen for 2 seconds for dramatic effect
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear draft and saved data first
      localStorage.removeItem('campaignDraft');
      localStorage.removeItem('campaignFormData');
      
      // Clear the form and navigate back
      setFormData({
        // Section 1: Basic Information (MANDATORY)
        title: '',
        brandName: user?.name || '',
        description: '',
        category: '',
        startDate: '',
        endDate: '',
        campaignType: '',
        budget: '',
        currency: '',

        // Section 2: Audience Targeting (Optional)
        targetAudience: {
          location: '',
          ageGroup: '',
          gender: '',
          interests: '',
        },
        targetAudienceAge: [],
        targetAudienceGender: [],
        targetAudienceRegion: [],
        languagePreference: '',
        customRegion: '',

        // Section 3: Content Requirements (Optional)
        platforms: [],
        contentFormat: [],
        numberOfPosts: '',
        contentDuration: '',
        hashtagsToUse: '',
        mentionsRequired: '',
        contentGuidelines: '',
        referenceLinks: '',
        creativeApprovalNeeded: false,

        // Section 4: Creator Requirements (Optional)
        minRequirements: {
          followersCount: '',
          engagementRate: '',
          contentStyle: '',
          languages: [],
        },
        minimumFollowers: '',
        minimumEngagement: '',
        creatorTier: '',
        nicheMatch: false,
        geographicRestrictions: '',

        // Section 5: Compensation & Deliverables (Optional)
        compensationType: '',
        paymentAmount: '',
        commissionPercentage: '',
        freeProductsOffered: '',
        deliverables: '',
        performanceBonus: false,
        bonusCriteria: '',
        productDetails: '',

        // Section 6: Campaign Workflow (Optional)
        approvalRequired: false,
        approvalSteps: [],
        deadlineReminders: false,
        communicationChannel: '',
        timeZone: '',
        campaignPriority: '',
        postingSchedule: '',

        // Section 7: Media & Assets (Optional)
        bannerImage: null,
        referenceMedia: '',
      });
      
      navigate('/brand/dashboard');
      
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert(error instanceof Error ? error.message : 'Failed to create campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen-dynamic bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Save notification */}
      {showSaveNotification && (
        <div className="fixed top-6 right-6 z-[60] bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">Draft saved automatically</span>
        </div>
      )}
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/95 backdrop-blur-lg">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          {/* Mobile Layout (< 640px) */}
          <div className="sm:hidden">
            <div className="flex items-center justify-between mb-2">
              <button 
                onClick={() => navigate('/brand/dashboard')}
                className="flex items-center space-x-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium text-sm">Back</span>
              </button>
              
              <button 
                onClick={() => handleSubmit(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all duration-200 text-sm"
              >
                <Save className="w-4 h-4" />
                <span className="font-medium">Save</span>
              </button>
            </div>
            <h1 className="text-lg font-display font-bold text-foreground tracking-tight text-center">Create Campaign</h1>
          </div>

          {/* Desktop Layout (≥ 640px) */}
          <div className="hidden sm:flex items-center justify-between">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <button 
                onClick={() => navigate('/brand/dashboard')}
                className="flex items-center space-x-2 px-3 lg:px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium text-sm lg:text-base">Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-border"></div>
              <h1 className="text-xl lg:text-2xl font-display font-bold text-foreground tracking-tight">Create New Campaign</h1>
            </div>
            
            <button 
              onClick={() => handleSubmit(true)}
              className="flex items-center space-x-2 px-3 lg:px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span className="font-medium text-sm lg:text-base">Save Draft</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content with proper spacing for fixed header */}
      <main className="relative z-10 pt-24 sm:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex gap-8">
            {/* Form Content - Scrollable Left Side */}
            <div className="flex-1 lg:flex-[2] space-y-8 max-h-screen overflow-y-auto pr-4">
              
              {/* Campaign Basics */}
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                    <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-display font-semibold text-foreground">Campaign Basics</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Campaign Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter a catchy campaign title"
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Brand Name</label>
                      <input
                        type="text"
                        value={formData.brandName}
                        onChange={(e) => handleInputChange('brandName', e.target.value)}
                        placeholder="Your brand name"
                        className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-muted-foreground cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Campaign Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your campaign goals, expectations, and details..."
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Campaign Type *</label>
                      <select
                        value={formData.campaignType}
                        onChange={(e) => handleInputChange('campaignType', e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        required
                      >
                        <option value="">Select type</option>
                        {campaignTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Start Date *</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Application Deadline *</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Target Audience & Requirements */}
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-display font-semibold text-foreground">Target Audience & Requirements</h3>
                </div>

                {/* Target Audience Subsection */}
                <div className="mb-8">
                  <h4 className="text-md font-medium text-foreground mb-4 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Target Audience
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                        <input
                          type="text"
                          value={formData.targetAudience.location}
                          onChange={(e) => handleInputChange('targetAudience.location', e.target.value)}
                          placeholder="e.g., Global, US, Europe"
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Age Group</label>
                        <input
                          type="text"
                          value={formData.targetAudience.ageGroup}
                          onChange={(e) => handleInputChange('targetAudience.ageGroup', e.target.value)}
                          placeholder="e.g., 18-35"
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Gender</label>
                        <select
                          value={formData.targetAudience.gender}
                          onChange={(e) => handleInputChange('targetAudience.gender', e.target.value)}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Any</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Non-binary">Non-binary</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Interests</label>
                        <input
                          type="text"
                          value={formData.targetAudience.interests}
                          onChange={(e) => handleInputChange('targetAudience.interests', e.target.value)}
                          placeholder="e.g., Gaming, Fashion, Tech"
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Platform Requirements */}
                <div className="mb-8">
                  <h4 className="text-md font-medium text-foreground mb-4 flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    Platform Requirements
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {platforms.map(platform => (
                      <label key={platform} className="flex items-center space-x-2 p-3 bg-background border border-border rounded-lg hover:bg-muted/30 transition-all duration-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.platforms?.includes(platform) || false}
                          onChange={(e) => handleArrayChange('platforms', platform, e.target.checked)}
                          className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                        />
                        <span className="text-sm font-medium text-foreground">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Minimum Creator Requirements */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-foreground mb-4 flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Minimum Creator Requirements
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Minimum Followers</label>
                        <input
                          type="text"
                          value={formData.minRequirements.followersCount}
                          onChange={(e) => handleInputChange('minRequirements.followersCount', e.target.value)}
                          placeholder="e.g., 10K, 100K+"
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Minimum Engagement Rate</label>
                        <input
                          type="text"
                          value={formData.minRequirements.engagementRate}
                          onChange={(e) => handleInputChange('minRequirements.engagementRate', e.target.value)}
                          placeholder="e.g., 3%, 5%+"
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Content Style/Tone</label>
                      <input
                        type="text"
                        value={formData.minRequirements.contentStyle}
                        onChange={(e) => handleInputChange('minRequirements.contentStyle', e.target.value)}
                        placeholder="e.g., Professional, Casual, Humorous"
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Language Preferences</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {languages.map(lang => (
                          <label key={lang} className="flex items-center space-x-2 p-2 bg-background border border-border rounded-lg hover:bg-muted/30 transition-all duration-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.minRequirements?.languages?.includes(lang) || false}
                              onChange={(e) => handleArrayChange('minRequirements.languages', lang, e.target.checked)}
                              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                            />
                            <span className="text-sm text-foreground">{lang}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Options */}
                <div className="space-y-4">
                  <label className="flex items-center space-x-2 p-3 bg-background border border-border rounded-lg hover:bg-muted/30 transition-all duration-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.nicheMatch}
                      onChange={(e) => handleInputChange('nicheMatch', e.target.checked)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-foreground">Require niche match (creators must be in relevant category)</span>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Geographic Restrictions</label>
                    <input
                      type="text"
                      value={formData.geographicRestrictions}
                      onChange={(e) => handleInputChange('geographicRestrictions', e.target.value)}
                      placeholder="e.g., US only, English-speaking countries"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Deliverables */}
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-display font-semibold text-foreground">Deliverables</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Content Format *</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {contentFormats.map(format => (
                        <label key={format} className="flex items-center space-x-2 p-3 bg-background border border-border rounded-lg hover:bg-muted/30 transition-all duration-200 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.contentFormat?.includes(format) || false}
                            onChange={(e) => handleArrayChange('contentFormat', format, e.target.checked)}
                            className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                          />
                          <span className="text-sm font-medium text-foreground">{format}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Number of Posts/Videos *</label>
                    <input
                      type="text"
                      value={formData.numberOfPosts}
                      onChange={(e) => handleInputChange('numberOfPosts', e.target.value)}
                      placeholder="e.g., 2 Instagram posts + 1 story"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Content Guidelines</label>
                    <textarea
                      value={formData.contentGuidelines}
                      onChange={(e) => handleInputChange('contentGuidelines', e.target.value)}
                      placeholder="Specific hashtags, mentions, tone, do's & don'ts..."
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                      rows={4}
                    />
                  </div>

                  <label className="flex items-center space-x-2 p-3 bg-background border border-border rounded-lg hover:bg-muted/30 transition-all duration-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.approvalRequired}
                      onChange={(e) => handleInputChange('approvalRequired', e.target.checked)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-foreground">Content requires pre-approval before posting</span>
                  </label>
                </div>
              </div>

              {/* Compensation & Perks */}
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center text-white">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-display font-semibold text-foreground">Compensation & Perks</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Compensation Type *</label>
                    <select
                      value={formData.compensationType}
                      onChange={(e) => handleInputChange('compensationType', e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Select compensation type</option>
                      {compensationTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {(formData.compensationType === 'Fixed Payment' || formData.compensationType === 'Commission/Affiliate') && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Payment Amount/Range</label>
                      <input
                        type="text"
                        value={formData.paymentAmount}
                        onChange={(e) => handleInputChange('paymentAmount', e.target.value)}
                        placeholder="e.g., $500-1000, 5% commission"
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Product/Service Details</label>
                    <textarea
                      value={formData.productDetails}
                      onChange={(e) => handleInputChange('productDetails', e.target.value)}
                      placeholder="Describe products/services being offered, event details, etc."
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Media & Assets */}
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center text-white">
                    <Image className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-display font-semibold text-foreground">Media & Assets</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Campaign Banner Image</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-lg hover:border-primary/50 transition-colors duration-200">
                      <div className="space-y-1 text-center">
                        <div className="flex text-sm text-muted-foreground">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-card rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none">
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Reference Links & Brand Kit</label>
                    <textarea
                      value={formData.referenceLinks}
                      onChange={(e) => handleInputChange('referenceLinks', e.target.value)}
                      placeholder="Links to brand kit, style guides, example posts, website..."
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button 
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmitting}
                  className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Rocket className="w-5 h-5" />
                  <span>{isSubmitting ? 'Creating Campaign...' : 'Create Campaign'}</span>
                </button>
              </div>
            </div>

            {/* Live Preview - Sticky Right Side */}
            <div className="hidden lg:block lg:flex-[1] relative">
              <div className="sticky top-24 h-fit max-h-[calc(100vh-7rem)] overflow-y-auto">
                <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <h3 className="text-base sm:text-lg font-display font-semibold text-foreground">Live Preview</h3>
                  </div>
                  
                  {/* Banner Image */}
                  <div className="relative mb-4 sm:mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                    {formData.bannerImage && formData.bannerImage instanceof File ? (
                      <img src={URL.createObjectURL(formData.bannerImage)} alt="Campaign Banner" className="w-full h-32 object-cover" />
                    ) : (
                      <div className="w-full h-32 flex flex-col items-center justify-center text-muted-foreground">
                        <Image className="w-8 h-8 mb-2" />
                        <p className="text-sm">Upload banner image</p>
                      </div>
                    )}
                    {formData.category && (
                      <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
                        {formData.category}
                      </div>
                    )}
                  </div>

                  {/* Campaign Content */}
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-display font-bold text-foreground line-clamp-2">
                        {formData.title || 'Your Amazing Campaign Title'}
                      </h2>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm font-medium text-foreground">{formData.brandName || 'Brand Name'}</span>
                        {formData.campaignType && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{formData.campaignType}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {formData.description || 'Your compelling campaign description will appear here. Make it engaging to attract the right influencers!'}
                    </p>

                    {/* Quick Stats */}
                    <div className="space-y-3 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Duration</span>
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {formData.startDate && formData.endDate ? 
                            `${new Date(formData.startDate).toLocaleDateString()} - ${new Date(formData.endDate).toLocaleDateString()}` : 
                            'Dates TBD'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Content</span>
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {formData.numberOfPosts || 'TBD'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Min Followers</span>
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {formData.minRequirements?.followersCount || '1K'}+
                        </span>
                      </div>
                    </div>

                    {/* Platforms */}
                    {formData.platforms && formData.platforms.length > 0 && (
                      <div className="pt-4 border-t border-border">
                        <h4 className="text-sm font-medium text-foreground mb-2">Platforms</h4>
                        <div className="flex flex-wrap gap-2">
                          {formData.platforms.slice(0, 3).map((platform, index) => (
                            <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-md">
                              {platform}
                            </span>
                          ))}
                          {formData.platforms.length > 3 && (
                            <span className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs font-medium rounded-md">
                              +{formData.platforms.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Compensation */}
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground">Compensation</h4>
                          <p className="text-lg font-bold text-green-600">
                            {formData.paymentAmount ? `$${formData.paymentAmount}` : '$500'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formData.compensationType || 'Fixed Payment'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <button className="w-full mt-6 px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2">
                      <span>Apply for Campaign</span>
                      <Heart className="w-4 h-4" />
                    </button>
                    <p className="text-center text-xs text-muted-foreground">
                      Join {Math.floor(Math.random() * 50) + 10} other applicants
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card/90 backdrop-blur-sm border border-border rounded-xl p-8 text-center max-w-md mx-4">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-display font-semibold text-foreground mb-2">Creating Your Campaign</h3>
            <p className="text-muted-foreground">Preparing your campaign for influencers...</p>
          </div>
        </div>
      )}
      </main>
    </div>
  );
};

export default CreateCampaign;
