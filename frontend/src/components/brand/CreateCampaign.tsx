import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BrandNavbar from './BrandNavbar';
import '../../styles/brand/CreateCampaign.css';

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

const CreateCampaign: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

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
  const saveDraft = () => {
    localStorage.setItem('campaignDraft', JSON.stringify(formData));
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 2000);
  };

  // Load draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('campaignDraft');
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setFormData({ ...parsedDraft, brandName: user?.name || parsedDraft.brandName });
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, [user]);

  // Auto-save every 2 seconds
  useEffect(() => {
    if (formSubmitted) return; // Don't auto-save after form submission
    
    const interval = setInterval(() => {
      saveDraft();
    }, 2000);

    return () => clearInterval(interval);
  }, [formData, formSubmitted]);

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
      
      const array = current[keys[keys.length - 1]] as string[];
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
      setFormData(initialFormData);
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
      
      // Clear the form
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
      
      // Clear draft and saved data
      localStorage.removeItem('campaignDraft');
      localStorage.removeItem('campaignFormData');
      
      navigate('/brand/dashboard');
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert(`Error creating campaign: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
      setFormSubmitted(false);
    }
  };

  const renderCampaignBasics = () => (
    <div className="createCampaignFormSection">
      <h3>Campaign Basics</h3>
      
      <div className="createCampaignFormGroup">
        <label>Campaign Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter a catchy campaign title"
          className="createCampaignFormInput"
          required
        />
      </div>

      <div className="createCampaignFormGroup">
        <label>Brand Name</label>
        <input
          type="text"
          value={formData.brandName}
          onChange={(e) => handleInputChange('brandName', e.target.value)}
          placeholder="Your brand name"
          className="createCampaignFormInput"
          disabled
        />
      </div>

      <div className="createCampaignFormGroup">
        <label>Campaign Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe your campaign goals, expectations, and details..."
          className="createCampaignFormTextarea"
          rows={4}
          required
        />
      </div>

      <div className="createCampaignFormRow">
        <div className="createCampaignFormGroup">
          <label>Category *</label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="createCampaignFormSelect"
            required
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="createCampaignFormGroup">
          <label>Campaign Type *</label>
          <select
            value={formData.campaignType}
            onChange={(e) => handleInputChange('campaignType', e.target.value)}
            className="createCampaignFormSelect"
            required
          >
            <option value="">Select type</option>
            {campaignTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="createCampaignFormRow">
        <div className="createCampaignFormGroup">
          <label>Start Date *</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className="createCampaignFormInput"
            required
          />
        </div>

        <div className="createCampaignFormGroup">
          <label>Application Deadline *</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            className="createCampaignFormInput"
            required
          />
        </div>
      </div>

      <div className="createCampaignFormRow">
        <div className="createCampaignFormGroup">
          <label>Budget</label>
          <input
            type="number"
            value={formData.budget}
            onChange={(e) => handleInputChange('budget', e.target.value)}
            placeholder="Total campaign budget"
            className="createCampaignFormInput"
          />
        </div>

        <div className="createCampaignFormGroup">
          <label>Currency</label>
          <select
            value={formData.currency}
            onChange={(e) => handleInputChange('currency', e.target.value)}
            className="createCampaignFormSelect"
          >
            <option value="">Select currency</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
            <option value="CAD">CAD ($)</option>
            <option value="AUD">AUD ($)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderTargetRequirements = () => (
    <div className="createCampaignFormSection">
      <h3>Target Audience & Requirements</h3>
      
      <div className="subsection">
        <h4>Target Audience</h4>
        
        <div className="createCampaignFormRow">
          <div className="createCampaignFormGroup">
            <label>Location</label>
            <input
              type="text"
              value={formData.targetAudience.location}
              onChange={(e) => handleInputChange('targetAudience.location', e.target.value)}
              placeholder="e.g., Global, US, Europe"
              className="createCampaignFormInput"
            />
          </div>

          <div className="createCampaignFormGroup">
            <label>Age Group</label>
            <input
              type="text"
              value={formData.targetAudience.ageGroup}
              onChange={(e) => handleInputChange('targetAudience.ageGroup', e.target.value)}
              placeholder="e.g., 18-35"
              className="createCampaignFormInput"
            />
          </div>
        </div>

        <div className="createCampaignFormRow">
          <div className="createCampaignFormGroup">
            <label>Gender</label>
            <select
              value={formData.targetAudience.gender}
              onChange={(e) => handleInputChange('targetAudience.gender', e.target.value)}
              className="createCampaignFormSelect"
            >
              <option value="">Any</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
            </select>
          </div>

          <div className="createCampaignFormGroup">
            <label>Interests</label>
            <input
              type="text"
              value={formData.targetAudience.interests}
              onChange={(e) => handleInputChange('targetAudience.interests', e.target.value)}
              placeholder="e.g., Gaming, Fashion, Tech"
              className="createCampaignFormInput"
            />
          </div>
        </div>

        <div className="createCampaignFormRow">
          <div className="createCampaignFormGroup">
            <label>Language Preference</label>
            <select
              value={formData.languagePreference}
              onChange={(e) => handleInputChange('languagePreference', e.target.value)}
              className="createCampaignFormSelect"
            >
              <option value="">Any Language</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Italian">Italian</option>
              <option value="Portuguese">Portuguese</option>
              <option value="Japanese">Japanese</option>
              <option value="Korean">Korean</option>
              <option value="Chinese">Chinese</option>
            </select>
          </div>

          <div className="createCampaignFormGroup">
            <label>Custom Region</label>
            <input
              type="text"
              value={formData.customRegion}
              onChange={(e) => handleInputChange('customRegion', e.target.value)}
              placeholder="Specific regions or countries"
              className="createCampaignFormInput"
            />
          </div>
        </div>
      </div>

      <div className="subsection">
        <h4>Platform Requirements</h4>
        <div className="createCampaignCheckboxGrid">
          {platforms.map(platform => (
            <label key={platform} className="createCampaignCheckboxItem">
              <input
                type="checkbox"
                checked={formData.platforms.includes(platform)}
                onChange={(e) => handleArrayChange('platforms', platform, e.target.checked)}
              />
              <span>{platform}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="subsection">
        <h4>Minimum Creator Requirements</h4>
        
        <div className="createCampaignFormRow">
          <div className="createCampaignFormGroup">
            <label>Minimum Followers</label>
            <input
              type="text"
              value={formData.minRequirements.followersCount}
              onChange={(e) => handleInputChange('minRequirements.followersCount', e.target.value)}
              placeholder="e.g., 10K, 100K+"
              className="createCampaignFormInput"
            />
          </div>

          <div className="createCampaignFormGroup">
            <label>Minimum Engagement Rate</label>
            <input
              type="text"
              value={formData.minRequirements.engagementRate}
              onChange={(e) => handleInputChange('minRequirements.engagementRate', e.target.value)}
              placeholder="e.g., 3%, 5%+"
              className="createCampaignFormInput"
            />
          </div>
        </div>

        <div className="createCampaignFormRow">
          <div className="createCampaignFormGroup">
            <label>Creator Tier</label>
            <select
              value={formData.creatorTier}
              onChange={(e) => handleInputChange('creatorTier', e.target.value)}
              className="createCampaignFormSelect"
            >
              <option value="">Any Tier</option>
              <option value="Nano (1K-10K)">Nano (1K-10K)</option>
              <option value="Micro (10K-100K)">Micro (10K-100K)</option>
              <option value="Macro (100K-1M)">Macro (100K-1M)</option>
              <option value="Mega (1M+)">Mega (1M+)</option>
            </select>
          </div>

          <div className="createCampaignFormGroup">
            <label>Minimum Followers (Specific)</label>
            <input
              type="number"
              value={formData.minimumFollowers}
              onChange={(e) => handleInputChange('minimumFollowers', e.target.value)}
              placeholder="Exact number"
              className="createCampaignFormInput"
            />
          </div>
        </div>

        <div className="createCampaignFormGroup">
          <label>Content Style/Tone</label>
          <input
            type="text"
            value={formData.minRequirements.contentStyle}
            onChange={(e) => handleInputChange('minRequirements.contentStyle', e.target.value)}
            placeholder="e.g., Professional, Casual, Humorous"
            className="createCampaignFormInput"
          />
        </div>

        <div className="createCampaignFormGroup">
          <label>Language Preferences</label>
          <div className="createCampaignCheckboxGrid">
            {languages.map(lang => (
              <label key={lang} className="createCampaignCheckboxItem">
                <input
                  type="checkbox"
                  checked={formData.minRequirements.languages.includes(lang)}
                  onChange={(e) => handleArrayChange('minRequirements.languages', lang, e.target.checked)}
                />
                <span>{lang}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="createCampaignFormGroup">
        <label className="createCampaignCheckboxItem">
          <input
            type="checkbox"
            checked={formData.nicheMatch}
            onChange={(e) => handleInputChange('nicheMatch', e.target.checked)}
          />
          <span>Require niche match (creators must be in relevant category)</span>
        </label>
      </div>

      <div className="createCampaignFormGroup">
        <label>Geographic Restrictions</label>
        <input
          type="text"
          value={formData.geographicRestrictions}
          onChange={(e) => handleInputChange('geographicRestrictions', e.target.value)}
          placeholder="e.g., US only, English-speaking countries"
          className="createCampaignFormInput"
        />
      </div>
    </div>
  );

  const renderDeliverables = () => (
    <div className="createCampaignFormSection">
      <h3>Deliverables</h3>
      
      <div className="createCampaignFormGroup">
        <label>Content Format *</label>
        <div className="createCampaignCheckboxGrid">
          {contentFormats.map(format => (
            <label key={format} className="createCampaignCheckboxItem">
              <input
                type="checkbox"
                checked={formData.contentFormat.includes(format)}
                onChange={(e) => handleArrayChange('contentFormat', format, e.target.checked)}
              />
              <span>{format}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="createCampaignFormGroup">
        <label>Number of Posts/Videos *</label>
        <input
          type="text"
          value={formData.numberOfPosts}
          onChange={(e) => handleInputChange('numberOfPosts', e.target.value)}
          placeholder="e.g., 2 Instagram posts + 1 story"
          className="createCampaignFormInput"
          required
        />
      </div>

      <div className="createCampaignFormRow">
        <div className="createCampaignFormGroup">
          <label>Hashtags to Use</label>
          <input
            type="text"
            value={formData.hashtagsToUse}
            onChange={(e) => handleInputChange('hashtagsToUse', e.target.value)}
            placeholder="e.g., #brandname #campaign2024"
            className="createCampaignFormInput"
          />
        </div>

        <div className="createCampaignFormGroup">
          <label>Mentions Required</label>
          <input
            type="text"
            value={formData.mentionsRequired}
            onChange={(e) => handleInputChange('mentionsRequired', e.target.value)}
            placeholder="e.g., @brandname @partner"
            className="createCampaignFormInput"
          />
        </div>
      </div>

      <div className="createCampaignFormGroup">
        <label className="createCampaignCheckboxItem">
          <input
            type="checkbox"
            checked={formData.creativeApprovalNeeded}
            onChange={(e) => handleInputChange('creativeApprovalNeeded', e.target.checked)}
          />
          <span>Creative approval needed before posting</span>
        </label>
      </div>

      <div className="createCampaignFormGroup">
        <label>Content Guidelines</label>
        <textarea
          value={formData.contentGuidelines}
          onChange={(e) => handleInputChange('contentGuidelines', e.target.value)}
          placeholder="Specific hashtags, mentions, tone, do's & don'ts..."
          className="createCampaignFormTextarea"
          rows={4}
        />
      </div>

      <div className="createCampaignFormGroup">
        <label className="createCampaignCheckboxItem">
          <input
            type="checkbox"
            checked={formData.approvalRequired}
            onChange={(e) => handleInputChange('approvalRequired', e.target.checked)}
          />
          <span>Content requires pre-approval before posting</span>
        </label>
      </div>
    </div>
  );

  const renderCompensation = () => (
    <div className="createCampaignFormSection">
      <h3>Compensation & Perks</h3>
      
      <div className="createCampaignFormGroup">
        <label>Compensation Type *</label>
        <select
          value={formData.compensationType}
          onChange={(e) => handleInputChange('compensationType', e.target.value)}
          className="createCampaignFormSelect"
          required
        >
          <option value="">Select compensation type</option>
          {compensationTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {(formData.compensationType === 'Fixed Payment' || formData.compensationType === 'Commission/Affiliate') && (
        <div className="createCampaignFormRow">
          <div className="createCampaignFormGroup">
            <label>Payment Amount/Range</label>
            <input
              type="text"
              value={formData.paymentAmount}
              onChange={(e) => handleInputChange('paymentAmount', e.target.value)}
              placeholder="e.g., $500-1000"
              className="createCampaignFormInput"
            />
          </div>

          <div className="createCampaignFormGroup">
            <label>Commission Percentage</label>
            <input
              type="number"
              value={formData.commissionPercentage}
              onChange={(e) => handleInputChange('commissionPercentage', e.target.value)}
              placeholder="e.g., 10"
              className="createCampaignFormInput"
            />
          </div>
        </div>
      )}

      <div className="createCampaignFormGroup">
        <label>Free Products Offered</label>
        <textarea
          value={formData.freeProductsOffered}
          onChange={(e) => handleInputChange('freeProductsOffered', e.target.value)}
          placeholder="List products being offered for free"
          className="createCampaignFormTextarea"
          rows={2}
        />
      </div>

      <div className="createCampaignFormRow">
        <div className="createCampaignFormGroup">
          <label>Deliverables</label>
          <input
            type="text"
            value={formData.deliverables}
            onChange={(e) => handleInputChange('deliverables', e.target.value)}
            placeholder="What creators need to deliver"
            className="createCampaignFormInput"
          />
        </div>

        <div className="createCampaignFormGroup">
          <label className="createCampaignCheckboxItem">
            <input
              type="checkbox"
              checked={formData.performanceBonus}
              onChange={(e) => handleInputChange('performanceBonus', e.target.checked)}
            />
            <span>Performance bonus available</span>
          </label>
        </div>
      </div>

      {formData.performanceBonus && (
        <div className="createCampaignFormGroup">
          <label>Bonus Criteria</label>
          <input
            type="text"
            value={formData.bonusCriteria}
            onChange={(e) => handleInputChange('bonusCriteria', e.target.value)}
            placeholder="e.g., 10K+ views, 100+ sales"
            className="createCampaignFormInput"
          />
        </div>
      )}

      <div className="createCampaignFormGroup">
        <label>Product/Service Details</label>
        <textarea
          value={formData.productDetails}
          onChange={(e) => handleInputChange('productDetails', e.target.value)}
          placeholder="Describe products/services being offered, event details, etc."
          className="createCampaignFormTextarea"
          rows={3}
        />
      </div>
    </div>
  );

  const renderWorkflowSettings = () => (
    <div className="createCampaignFormSection">
      <h3>Campaign Workflow</h3>
      
      <div className="createCampaignFormRow">
        <div className="createCampaignFormGroup">
          <label>Communication Channel</label>
          <select
            value={formData.communicationChannel}
            onChange={(e) => handleInputChange('communicationChannel', e.target.value)}
            className="createCampaignFormSelect"
          >
            <option value="">Select channel</option>
            <option value="Email">Email</option>
            <option value="Platform messaging">Platform messaging</option>
            <option value="Discord">Discord</option>
            <option value="Slack">Slack</option>
            <option value="WhatsApp">WhatsApp</option>
          </select>
        </div>

        <div className="createCampaignFormGroup">
          <label>Time Zone</label>
          <select
            value={formData.timeZone}
            onChange={(e) => handleInputChange('timeZone', e.target.value)}
            className="createCampaignFormSelect"
          >
            <option value="">Select timezone</option>
            <option value="UTC">UTC</option>
            <option value="EST">EST (Eastern)</option>
            <option value="PST">PST (Pacific)</option>
            <option value="GMT">GMT (London)</option>
            <option value="CET">CET (Central Europe)</option>
            <option value="IST">IST (India)</option>
          </select>
        </div>
      </div>

      <div className="createCampaignFormGroup">
        <label className="createCampaignCheckboxItem">
          <input
            type="checkbox"
            checked={formData.deadlineReminders}
            onChange={(e) => handleInputChange('deadlineReminders', e.target.checked)}
          />
          <span>Send deadline reminders to creators</span>
        </label>
      </div>
    </div>
  );

  const renderMediaAssets = () => (
    <div className="createCampaignFormSection">
      <h3>Media & Assets</h3>
      
      <div className="createCampaignFormGroup">
        <label>Campaign Banner Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="form-file"
        />
        <small>Upload a banner image for your campaign listing</small>
      </div>

      <div className="createCampaignFormGroup">
        <label>Reference Links & Brand Kit</label>
        <textarea
          value={formData.referenceLinks}
          onChange={(e) => handleInputChange('referenceLinks', e.target.value)}
          placeholder="Links to brand kit, style guides, example posts, website..."
          className="createCampaignFormTextarea"
          rows={3}
        />
      </div>

      <div className="createCampaignFormGroup">
        <label>Reference Media</label>
        <textarea
          value={formData.referenceMedia}
          onChange={(e) => handleInputChange('referenceMedia', e.target.value)}
          placeholder="Links to example content, inspiration posts, etc."
          className="createCampaignFormTextarea"
          rows={2}
        />
      </div>
    </div>
  );

  return (
    <div className="create-campaign-container">
      {showSaveNotification && (
        <div className="save-notification">
          ✅ Draft saved automatically
        </div>
      )}
      
      <BrandNavbar activeTab="create-campaign" />

      <div className="main-content">
        <div className="createCampaignFormColumn">
          <div className="createCampaignFormWrapper">
          {/* Campaign Basics */}
          <div className="createCampaignFormSection">
          <h3>Campaign Basics</h3>
          
          <div className="createCampaignFormRow">
            <div className="createCampaignFormGroup">
              <label>Campaign Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter a catchy campaign title"
                className="createCampaignFormInput"
                required
              />
            </div>

            <div className="createCampaignFormGroup">
              <label>Brand Name</label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => handleInputChange('brandName', e.target.value)}
                placeholder="Your brand name"
                className="createCampaignFormInput"
                disabled
              />
            </div>
          </div>

          <div className="createCampaignFormGroup">
            <label>Campaign Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your campaign goals, expectations, and details..."
              className="createCampaignFormTextarea"
              rows={4}
              required
            />
          </div>

          <div className="createCampaignFormRow">
            <div className="createCampaignFormGroup">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="createCampaignFormSelect"
                required
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="createCampaignFormGroup">
              <label>Campaign Type *</label>
              <select
                value={formData.campaignType}
                onChange={(e) => handleInputChange('campaignType', e.target.value)}
                className="createCampaignFormSelect"
                required
              >
                <option value="">Select type</option>
                {campaignTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="createCampaignFormRow">
            <div className="createCampaignFormGroup">
              <label>Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="createCampaignFormInput"
                required
              />
            </div>

            <div className="createCampaignFormGroup">
              <label>Application Deadline *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="createCampaignFormInput"
                required
              />
            </div>
          </div>

          <div className="createCampaignFormRow">
            <div className="createCampaignFormGroup">
              <label>Budget *</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                placeholder="Enter budget amount"
                className="createCampaignFormInput"
                required
              />
            </div>

            <div className="createCampaignFormGroup">
              <label>Currency *</label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="createCampaignFormSelect"
                required
              >
                <option value="">Select currency</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="AUD">AUD (A$)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Target Audience & Requirements */}
        <div className="createCampaignFormSection">
          <h3>Target Audience & Requirements</h3>
          
          <div className="subsection">
            <h4>Target Audience</h4>
            
            <div className="createCampaignFormRow">
              <div className="createCampaignFormGroup">
                <label>Location</label>
                <select
                  value={formData.targetAudience.location}
                  onChange={(e) => handleInputChange('targetAudience.location', e.target.value)}
                  className="createCampaignFormSelect"
                  required
                >
                  <option value="">Select location</option>
                  <option value="Global">Global</option>
                  <option value="North America">North America</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="Europe">Europe</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Asia Pacific">Asia Pacific</option>
                  <option value="India">India</option>
                  <option value="Australia">Australia</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="createCampaignFormGroup">
                <label>Age Group</label>
                <select
                  value={formData.targetAudience.ageGroup}
                  onChange={(e) => handleInputChange('targetAudience.ageGroup', e.target.value)}
                  className="createCampaignFormSelect"
                  required
                >
                  <option value="">Select age group</option>
                  <option value="13-17">13-17 (Gen Z)</option>
                  <option value="18-24">18-24 (Gen Z)</option>
                  <option value="25-34">25-34 (Millennials)</option>
                  <option value="35-44">35-44 (Millennials)</option>
                  <option value="45-54">45-54 (Gen X)</option>
                  <option value="55-64">55-64 (Baby Boomers)</option>
                  <option value="65+">65+ (Baby Boomers)</option>
                  <option value="18-35">18-35 (Broad)</option>
                  <option value="25-44">25-44 (Core Adults)</option>
                  <option value="All Ages">All Ages</option>
                </select>
              </div>
            </div>

            <div className="createCampaignFormRow">
              <div className="createCampaignFormGroup">
                <label>Gender</label>
                <select
                  value={formData.targetAudience.gender}
                  onChange={(e) => handleInputChange('targetAudience.gender', e.target.value)}
                  className="createCampaignFormSelect"
                >
                  <option value="">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                </select>
              </div>

              <div className="createCampaignFormGroup">
                <label>Target Interests</label>
                <select
                  value={formData.targetAudience.interests}
                  onChange={(e) => handleInputChange('targetAudience.interests', e.target.value)}
                  className="createCampaignFormSelect"
                  required
                >
                  <option value="">Select primary interest</option>
                  <option value="Fashion & Beauty">Fashion & Beauty</option>
                  <option value="Fitness & Health">Fitness & Health</option>
                  <option value="Gaming & Tech">Gaming & Tech</option>
                  <option value="Food & Cooking">Food & Cooking</option>
                  <option value="Travel & Lifestyle">Travel & Lifestyle</option>
                  <option value="Business & Finance">Business & Finance</option>
                  <option value="Education & Learning">Education & Learning</option>
                  <option value="Entertainment & Movies">Entertainment & Movies</option>
                  <option value="Music & Arts">Music & Arts</option>
                  <option value="Sports & Outdoors">Sports & Outdoors</option>
                  <option value="Parenting & Family">Parenting & Family</option>
                  <option value="Home & Decor">Home & Decor</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Photography">Photography</option>
                  <option value="Pets & Animals">Pets & Animals</option>
                  <option value="General Lifestyle">General Lifestyle</option>
                </select>
              </div>
            </div>
          </div>

          <div className="subsection">
            <h4>Platform Requirements</h4>
            <div className="createCampaignCheckboxGrid">
              {platforms.map(platform => (
                <label key={platform} className="createCampaignCheckboxItem">
                  <input
                    type="checkbox"
                    checked={formData.platforms.includes(platform)}
                    onChange={(e) => handleArrayChange('platforms', platform, e.target.checked)}
                  />
                  <span>{platform}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="subsection">
            <h4>Minimum Creator Requirements</h4>
            
            <div className="createCampaignFormRow">
              <div className="createCampaignFormGroup">
                <label>Minimum Followers</label>
                <select
                  value={formData.minRequirements.followersCount}
                  onChange={(e) => handleInputChange('minRequirements.followersCount', e.target.value)}
                  className="createCampaignFormSelect"
                  required
                >
                  <option value="">Select minimum followers</option>
                  <option value="1K+">1K+ (Nano Influencer)</option>
                  <option value="10K+">10K+ (Micro Influencer)</option>
                  <option value="50K+">50K+</option>
                  <option value="100K+">100K+ (Mid-tier Influencer)</option>
                  <option value="500K+">500K+</option>
                  <option value="1M+">1M+ (Macro Influencer)</option>
                  <option value="5M+">5M+ (Mega Influencer)</option>
                  <option value="No minimum">No minimum requirement</option>
                </select>
              </div>

              <div className="createCampaignFormGroup">
                <label>Minimum Engagement Rate</label>
                <select
                  value={formData.minRequirements.engagementRate}
                  onChange={(e) => handleInputChange('minRequirements.engagementRate', e.target.value)}
                  className="createCampaignFormSelect"
                  required
                >
                  <option value="">Select minimum engagement</option>
                  <option value="1%+">1%+ (Basic)</option>
                  <option value="2%+">2%+ (Good)</option>
                  <option value="3%+">3%+ (Great)</option>
                  <option value="5%+">5%+ (Excellent)</option>
                  <option value="8%+">8%+ (Outstanding)</option>
                  <option value="No minimum">No minimum requirement</option>
                </select>
              </div>
            </div>

            <div className="createCampaignFormGroup">
              <label>Content Style/Tone</label>
              <select
                value={formData.minRequirements.contentStyle}
                onChange={(e) => handleInputChange('minRequirements.contentStyle', e.target.value)}
                className="createCampaignFormSelect"
                required
              >
                <option value="">Select content style</option>
                <option value="Professional">Professional</option>
                <option value="Casual">Casual</option>
                <option value="Humorous">Humorous</option>
                <option value="Educational">Educational</option>
                <option value="Inspirational">Inspirational</option>
                <option value="Storytelling">Storytelling</option>
                <option value="Authentic">Authentic</option>
                <option value="Trendy">Trendy</option>
                <option value="Minimalist">Minimalist</option>
                <option value="Bold & Creative">Bold & Creative</option>
                <option value="Luxury">Luxury</option>
                <option value="Fun & Playful">Fun & Playful</option>
              </select>
            </div>

            <div className="createCampaignFormGroup">
              <label>Language Preferences</label>
              <div className="createCampaignCheckboxGrid">
                {languages.map(lang => (
                  <label key={lang} className="createCampaignCheckboxItem">
                    <input
                      type="checkbox"
                      checked={formData.minRequirements.languages.includes(lang)}
                      onChange={(e) => handleArrayChange('minRequirements.languages', lang, e.target.checked)}
                    />
                    <span>{lang}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="createCampaignFormGroup">
            <label className="createCampaignCheckboxItem">
              <input
                type="checkbox"
                checked={formData.nicheMatch}
                onChange={(e) => handleInputChange('nicheMatch', e.target.checked)}
              />
              <span>Require niche match (creators must be in relevant category)</span>
            </label>
          </div>

          <div className="createCampaignFormGroup">
            <label>Geographic Restrictions</label>
            <input
              type="text"
              value={formData.geographicRestrictions}
              onChange={(e) => handleInputChange('geographicRestrictions', e.target.value)}
              placeholder="e.g., US only, English-speaking countries"
              className="createCampaignFormInput"
            />
          </div>
        </div>

        {/* Deliverables */}
        <div className="createCampaignFormSection">
          <h3>Deliverables</h3>
          
          <div className="createCampaignFormGroup">
            <label>Content Format *</label>
            <div className="createCampaignCheckboxGrid">
              {contentFormats.map(format => (
                <label key={format} className="createCampaignCheckboxItem">
                  <input
                    type="checkbox"
                    checked={formData.contentFormat.includes(format)}
                    onChange={(e) => handleArrayChange('contentFormat', format, e.target.checked)}
                  />
                  <span>{format}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="createCampaignFormRow">
            <div className="createCampaignFormGroup">
              <label>Number of Posts/Videos *</label>
              <select
                value={formData.numberOfPosts}
                onChange={(e) => handleInputChange('numberOfPosts', e.target.value)}
                className="createCampaignFormSelect"
                required
              >
                <option value="">Select quantity</option>
                <option value="1 Post">1 Post</option>
                <option value="2 Posts">2 Posts</option>
                <option value="3 Posts">3 Posts</option>
                <option value="4-5 Posts">4-5 Posts</option>
                <option value="1 Video">1 Video</option>
                <option value="2-3 Videos">2-3 Videos</option>
                <option value="1 Post + 1 Story">1 Post + 1 Story</option>
                <option value="2 Posts + 2 Stories">2 Posts + 2 Stories</option>
                <option value="1 Video + 3 Stories">1 Video + 3 Stories</option>
                <option value="Custom package">Custom package</option>
              </select>
            </div>

            <div className="createCampaignFormGroup">
              <label>Content Duration (for videos)</label>
              <select
                value={formData.contentDuration}
                onChange={(e) => handleInputChange('contentDuration', e.target.value)}
                className="createCampaignFormSelect"
              >
                <option value="">Select duration</option>
                <option value="15-30 seconds">15-30 seconds (Short form)</option>
                <option value="30-60 seconds">30-60 seconds</option>
                <option value="1-2 minutes">1-2 minutes</option>
                <option value="2-5 minutes">2-5 minutes (Long form)</option>
                <option value="5+ minutes">5+ minutes</option>
                <option value="Not applicable">Not applicable</option>
              </select>
            </div>
          </div>

          <div className="createCampaignFormGroup">
            <label>Content Guidelines</label>
            <textarea
              value={formData.contentGuidelines}
              onChange={(e) => handleInputChange('contentGuidelines', e.target.value)}
              placeholder="Specific hashtags, mentions, tone, do's & don'ts..."
              className="createCampaignFormTextarea"
              rows={4}
            />
          </div>

          <div className="createCampaignFormGroup">
            <label className="createCampaignCheckboxItem">
              <input
                type="checkbox"
                checked={formData.approvalRequired}
                onChange={(e) => handleInputChange('approvalRequired', e.target.checked)}
              />
              <span>Content requires pre-approval before posting</span>
            </label>
          </div>
        </div>

        {/* Compensation & Perks */}
        <div className="createCampaignFormSection">
          <h3>Compensation & Perks</h3>
          
          <div className="createCampaignFormGroup">
            <label>Compensation Type *</label>
            <select
              value={formData.compensationType}
              onChange={(e) => handleInputChange('compensationType', e.target.value)}
              className="createCampaignFormSelect"
              required
            >
              <option value="">Select compensation type</option>
              {compensationTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {(formData.compensationType === 'Fixed Payment' || formData.compensationType === 'Commission/Affiliate') && (
            <div className="createCampaignFormGroup">
              <label>Payment Amount/Range</label>
              <input
                type="text"
                value={formData.paymentAmount}
                onChange={(e) => handleInputChange('paymentAmount', e.target.value)}
                placeholder="e.g., $500-1000, 5% commission"
                className="createCampaignFormInput"
              />
            </div>
          )}

          <div className="createCampaignFormGroup">
            <label>Product/Service Details</label>
            <textarea
              value={formData.productDetails}
              onChange={(e) => handleInputChange('productDetails', e.target.value)}
              placeholder="Describe products/services being offered, event details, etc."
              className="createCampaignFormTextarea"
              rows={3}
            />
          </div>
        </div>

        {/* Campaign Workflow */}
        <div className="createCampaignFormSection">
          <h3>Campaign Workflow</h3>
          
          <div className="createCampaignFormRow">
            <div className="createCampaignFormGroup">
              <label>Communication Channel</label>
              <select
                value={formData.communicationChannel}
                onChange={(e) => handleInputChange('communicationChannel', e.target.value)}
                className="createCampaignFormSelect"
              >
                <option value="">Select channel</option>
                <option value="Email">Email</option>
                <option value="Platform messaging">Platform messaging</option>
                <option value="Discord">Discord</option>
                <option value="Slack">Slack</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
            </div>

            <div className="createCampaignFormGroup">
              <label>Campaign Priority</label>
              <select
                value={formData.campaignPriority}
                onChange={(e) => handleInputChange('campaignPriority', e.target.value)}
                className="createCampaignFormSelect"
              >
                <option value="">Select priority</option>
                <option value="Low">Low Priority</option>
                <option value="Normal">Normal Priority</option>
                <option value="High">High Priority</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="createCampaignFormRow">
            <div className="createCampaignFormGroup">
              <label>Time Zone</label>
              <select
                value={formData.timeZone}
                onChange={(e) => handleInputChange('timeZone', e.target.value)}
                className="createCampaignFormSelect"
              >
                <option value="">Select timezone</option>
                <option value="UTC">UTC</option>
                <option value="EST">EST (Eastern)</option>
                <option value="PST">PST (Pacific)</option>
                <option value="GMT">GMT (London)</option>
                <option value="CET">CET (Central Europe)</option>
                <option value="IST">IST (India)</option>
              </select>
            </div>

            <div className="createCampaignFormGroup">
              <label>Preferred Posting Schedule</label>
              <select
                value={formData.postingSchedule}
                onChange={(e) => handleInputChange('postingSchedule', e.target.value)}
                className="createCampaignFormSelect"
              >
                <option value="">Select schedule</option>
                <option value="Flexible">Flexible timing</option>
                <option value="Morning (6-12 PM)">Morning (6-12 PM)</option>
                <option value="Afternoon (12-6 PM)">Afternoon (12-6 PM)</option>
                <option value="Evening (6-12 AM)">Evening (6-12 AM)</option>
                <option value="Peak hours only">Peak hours only</option>
                <option value="Coordinated launch">Coordinated launch</option>
              </select>
            </div>
          </div>

          <div className="createCampaignFormGroup">
            <label className="createCampaignCheckboxItem">
              <input
                type="checkbox"
                checked={formData.deadlineReminders}
                onChange={(e) => handleInputChange('deadlineReminders', e.target.checked)}
              />
              <span>Send deadline reminders to creators</span>
            </label>
          </div>
        </div>

        {/* Media & Assets */}
        <div className="createCampaignFormSection">
          <h3>Media & Assets</h3>
          
          <div className="createCampaignFormGroup">
            <label>Campaign Banner Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="form-file"
            />
            <small>Upload a banner image for your campaign listing</small>
          </div>

          <div className="createCampaignFormGroup">
            <label>Reference Links & Brand Kit</label>
            <textarea
              value={formData.referenceLinks}
              onChange={(e) => handleInputChange('referenceLinks', e.target.value)}
              placeholder="Links to brand kit, style guides, example posts, website..."
              className="createCampaignFormTextarea"
              rows={3}
            />
          </div>

          <div className="createCampaignFormGroup">
            <label>Reference Media</label>
            <textarea
              value={formData.referenceMedia}
              onChange={(e) => handleInputChange('referenceMedia', e.target.value)}
              placeholder="Links to example content, inspiration posts, etc."
              className="createCampaignFormTextarea"
              rows={2}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="createCampaignFormActions">
          <div className="createCampaignButtonGroup">
            <button 
              onClick={() => handleSubmit(true)}
              className="cc-save-draft-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? '⏳ Saving...' : '💾 Save as Draft'}
            </button>
            <button 
              onClick={() => handleSubmit(false)}
              className="cc-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? '⏳ Creating Campaign...' : '🚀 Post Campaign'}
            </button>
          </div>
        </div>

        </div>
        </div>

        {/* Campaign Preview Leaflet */}
        <div className="createCampaignPreviewColumn">
          <div className="createCampaignLeaflet">
            {/* Campaign Banner - Left Half */}
            <div className="createCampaignLeafletBanner">
              {formData.bannerImage && formData.bannerImage instanceof File ? (
                <img src={URL.createObjectURL(formData.bannerImage)} alt="Campaign Banner" />
              ) : (
                <div className="createCampaignBannerPlaceholder">
                  <div className="createCampaignBannerIcon">🖼️</div>
                  <p>Upload banner image</p>
                </div>
              )}
            </div>

            {/* Campaign Details - Right Half */}
            <div className="createCampaignLeafletDetails">
              <h2 className="createCampaignTitle">
                {formData.title || 'Your Amazing Campaign Title'}
              </h2>
              
              <p className="createCampaignDescription">
                {formData.description || 'Add a compelling description to attract the right creators...'}
              </p>

              <div className="createCampaignDetailsGrid">
                <div className="createCampaignDetailItem">
                  <div className="createCampaignDetailLabel">Budget</div>
                  <div className="createCampaignDetailValue">
                    {formData.budget && formData.currency 
                      ? `${formData.currency} ${formData.budget}`
                      : 'TBD'}
                  </div>
                </div>
                
                <div className="createCampaignDetailItem">
                  <div className="createCampaignDetailLabel">Category</div>
                  <div className="createCampaignDetailValue">{formData.category || 'General'}</div>
                </div>
                
                <div className="createCampaignDetailItem">
                  <div className="createCampaignDetailLabel">Type</div>
                  <div className="createCampaignDetailValue">{formData.campaignType || 'Collaboration'}</div>
                </div>
                
                <div className="createCampaignDetailItem">
                  <div className="createCampaignDetailLabel">Platforms</div>
                  <div className="createCampaignDetailValue">
                    {formData.platforms.length > 0 ? formData.platforms.join(', ') : 'Multiple'}
                  </div>
                </div>
              </div>

              <div className="campaign-stats">
                <div className="stat-item">
                  <div className="stat-value">
                    {formData.startDate 
                      ? new Date(formData.startDate).toLocaleDateString() 
                      : 'TBD'}
                  </div>
                  <div className="stat-label">Start Date</div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-value">
                    {formData.endDate 
                      ? new Date(formData.endDate).toLocaleDateString() 
                      : 'TBD'}
                  </div>
                  <div className="stat-label">Deadline</div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-value">
                    {formData.compensationType || 'TBD'}
                  </div>
                  <div className="stat-label">Compensation</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="loading-overlay">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <h3>Creating Your Campaign</h3>
              <p>Preparing your campaign for influencers...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCampaign;
