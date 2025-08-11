import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/brand/CreateCampaign.css';

interface CampaignFormData {
  // Campaign Basics
  title: string;
  brandName: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  campaignType: string;

  // Target & Requirements
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

  // Deliverables
  contentFormat: string[];
  numberOfPosts: string;
  contentGuidelines: string;
  approvalRequired: boolean;

  // Compensation & Perks
  compensationType: string;
  paymentAmount: string;
  productDetails: string;

  // Media & Assets
  bannerImage: File | null;
  referenceLinks: string;
}

const CreateCampaign: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState<CampaignFormData>({
    title: '',
    brandName: user?.name || '',
    description: '',
    category: '',
    startDate: '',
    endDate: '',
    campaignType: '',
    targetAudience: {
      location: '',
      ageGroup: '',
      gender: '',
      interests: '',
    },
    platforms: [],
    minRequirements: {
      followersCount: '',
      engagementRate: '',
      contentStyle: '',
      languages: [],
    },
    nicheMatch: false,
    geographicRestrictions: '',
    contentFormat: [],
    numberOfPosts: '',
    contentGuidelines: '',
    approvalRequired: false,
    compensationType: '',
    paymentAmount: '',
    productDetails: '',
    bannerImage: null,
    referenceLinks: '',
  });

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

  const handleSubmit = async (isDraft: boolean = false) => {
    try {
      if (isDraft) {
        saveDraft();
        alert('Draft saved successfully!');
        return;
      }

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
        status: 'active'
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
        throw new Error(errorData || 'Failed to create campaign');
      }

      const result = await response.json();
      console.log('Campaign created:', result);
      
      // Set flag to prevent auto-save
      setFormSubmitted(true);
      
      // Show loading screen for 2 seconds for dramatic effect
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear draft and saved data first
      localStorage.removeItem('campaignDraft');
      localStorage.removeItem('campaignFormData');
      
      // Clear the form
      setFormData({
        title: '',
        brandName: user?.name || '',
        description: '',
        category: '',
        startDate: '',
        endDate: '',
        campaignType: 'brand-partnership',
        
        targetAudience: {
          location: '',
          ageGroup: '',
          gender: '',
          interests: '',
        },
        platforms: [],
        minRequirements: {
          followersCount: '',
          engagementRate: '',
          contentStyle: '',
          languages: [],
        },
        nicheMatch: false,
        geographicRestrictions: '',
        
        contentFormat: [],
        numberOfPosts: '',
        contentGuidelines: '',
        approvalRequired: false,
        
        compensationType: 'monetary',
        paymentAmount: '',
        productDetails: '',
        
        bannerImage: null,
        referenceLinks: ''
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
    <div className="form-section">
      <h3>Campaign Basics</h3>
      
      <div className="form-group">
        <label>Campaign Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter a catchy campaign title"
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label>Brand Name</label>
        <input
          type="text"
          value={formData.brandName}
          onChange={(e) => handleInputChange('brandName', e.target.value)}
          placeholder="Your brand name"
          className="form-input"
          disabled
        />
      </div>

      <div className="form-group">
        <label>Campaign Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe your campaign goals, expectations, and details..."
          className="form-textarea"
          rows={4}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Category *</label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="form-select"
            required
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Campaign Type *</label>
          <select
            value={formData.campaignType}
            onChange={(e) => handleInputChange('campaignType', e.target.value)}
            className="form-select"
            required
          >
            <option value="">Select type</option>
            {campaignTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Start Date *</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label>Application Deadline *</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            className="form-input"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderTargetRequirements = () => (
    <div className="form-section">
      <h3>Target Audience & Requirements</h3>
      
      <div className="subsection">
        <h4>Target Audience</h4>
        
        <div className="form-row">
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={formData.targetAudience.location}
              onChange={(e) => handleInputChange('targetAudience.location', e.target.value)}
              placeholder="e.g., Global, US, Europe"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Age Group</label>
            <input
              type="text"
              value={formData.targetAudience.ageGroup}
              onChange={(e) => handleInputChange('targetAudience.ageGroup', e.target.value)}
              placeholder="e.g., 18-35"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Gender</label>
            <select
              value={formData.targetAudience.gender}
              onChange={(e) => handleInputChange('targetAudience.gender', e.target.value)}
              className="form-select"
            >
              <option value="">Any</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
            </select>
          </div>

          <div className="form-group">
            <label>Interests</label>
            <input
              type="text"
              value={formData.targetAudience.interests}
              onChange={(e) => handleInputChange('targetAudience.interests', e.target.value)}
              placeholder="e.g., Gaming, Fashion, Tech"
              className="form-input"
            />
          </div>
        </div>
      </div>

      <div className="subsection">
        <h4>Platform Requirements</h4>
        <div className="checkbox-grid">
          {platforms.map(platform => (
            <label key={platform} className="checkbox-item">
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
        
        <div className="form-row">
          <div className="form-group">
            <label>Minimum Followers</label>
            <input
              type="text"
              value={formData.minRequirements.followersCount}
              onChange={(e) => handleInputChange('minRequirements.followersCount', e.target.value)}
              placeholder="e.g., 10K, 100K+"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Minimum Engagement Rate</label>
            <input
              type="text"
              value={formData.minRequirements.engagementRate}
              onChange={(e) => handleInputChange('minRequirements.engagementRate', e.target.value)}
              placeholder="e.g., 3%, 5%+"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Content Style/Tone</label>
          <input
            type="text"
            value={formData.minRequirements.contentStyle}
            onChange={(e) => handleInputChange('minRequirements.contentStyle', e.target.value)}
            placeholder="e.g., Professional, Casual, Humorous"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Language Preferences</label>
          <div className="checkbox-grid">
            {languages.map(lang => (
              <label key={lang} className="checkbox-item">
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

      <div className="form-group">
        <label className="checkbox-item">
          <input
            type="checkbox"
            checked={formData.nicheMatch}
            onChange={(e) => handleInputChange('nicheMatch', e.target.checked)}
          />
          <span>Require niche match (creators must be in relevant category)</span>
        </label>
      </div>

      <div className="form-group">
        <label>Geographic Restrictions</label>
        <input
          type="text"
          value={formData.geographicRestrictions}
          onChange={(e) => handleInputChange('geographicRestrictions', e.target.value)}
          placeholder="e.g., US only, English-speaking countries"
          className="form-input"
        />
      </div>
    </div>
  );

  const renderDeliverables = () => (
    <div className="form-section">
      <h3>Deliverables</h3>
      
      <div className="form-group">
        <label>Content Format *</label>
        <div className="checkbox-grid">
          {contentFormats.map(format => (
            <label key={format} className="checkbox-item">
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

      <div className="form-group">
        <label>Number of Posts/Videos *</label>
        <input
          type="text"
          value={formData.numberOfPosts}
          onChange={(e) => handleInputChange('numberOfPosts', e.target.value)}
          placeholder="e.g., 2 Instagram posts + 1 story"
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label>Content Guidelines</label>
        <textarea
          value={formData.contentGuidelines}
          onChange={(e) => handleInputChange('contentGuidelines', e.target.value)}
          placeholder="Specific hashtags, mentions, tone, do's & don'ts..."
          className="form-textarea"
          rows={4}
        />
      </div>

      <div className="form-group">
        <label className="checkbox-item">
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
    <div className="form-section">
      <h3>Compensation & Perks</h3>
      
      <div className="form-group">
        <label>Compensation Type *</label>
        <select
          value={formData.compensationType}
          onChange={(e) => handleInputChange('compensationType', e.target.value)}
          className="form-select"
          required
        >
          <option value="">Select compensation type</option>
          {compensationTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {(formData.compensationType === 'Fixed Payment' || formData.compensationType === 'Commission/Affiliate') && (
        <div className="form-group">
          <label>Payment Amount/Range</label>
          <input
            type="text"
            value={formData.paymentAmount}
            onChange={(e) => handleInputChange('paymentAmount', e.target.value)}
            placeholder="e.g., $500-1000, 5% commission"
            className="form-input"
          />
        </div>
      )}

      <div className="form-group">
        <label>Product/Service Details</label>
        <textarea
          value={formData.productDetails}
          onChange={(e) => handleInputChange('productDetails', e.target.value)}
          placeholder="Describe products/services being offered, event details, etc."
          className="form-textarea"
          rows={3}
        />
      </div>
    </div>
  );

  const renderMediaAssets = () => (
    <div className="form-section">
      <h3>Media & Assets</h3>
      
      <div className="form-group">
        <label>Campaign Banner Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="form-file"
        />
        <small>Upload a banner image for your campaign listing</small>
      </div>

      <div className="form-group">
        <label>Reference Links & Brand Kit</label>
        <textarea
          value={formData.referenceLinks}
          onChange={(e) => handleInputChange('referenceLinks', e.target.value)}
          placeholder="Links to brand kit, style guides, example posts, website..."
          className="form-textarea"
          rows={3}
        />
      </div>
    </div>
  );

  return (
    <div className="create-campaign-page">
      {showSaveNotification && (
        <div className="save-notification">
          ✅ Draft saved automatically
        </div>
      )}
      
      <div className="campaign-header">
        <button 
          onClick={() => navigate('/brand/dashboard')}
          className="back-btn"
        >
          ← Back to Dashboard
        </button>
        <h1>Create New Campaign</h1>
        <button 
          onClick={() => handleSubmit(true)}
          className="save-draft-btn"
        >
          💾 Save Draft
        </button>
      </div>

      <div className="campaign-form">
        <div className="form-content">
          {/* Campaign Basics */}
          <div className="form-section">
          <h3>Campaign Basics</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Campaign Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter a catchy campaign title"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Brand Name</label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => handleInputChange('brandName', e.target.value)}
                placeholder="Your brand name"
                className="form-input"
                disabled
              />
            </div>
          </div>

          <div className="form-group">
            <label>Campaign Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your campaign goals, expectations, and details..."
              className="form-textarea"
              rows={4}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="form-select"
                required
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Campaign Type *</label>
              <select
                value={formData.campaignType}
                onChange={(e) => handleInputChange('campaignType', e.target.value)}
                className="form-select"
                required
              >
                <option value="">Select type</option>
                {campaignTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Application Deadline *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Target Audience & Requirements */}
        <div className="form-section">
          <h3>Target Audience & Requirements</h3>
          
          <div className="subsection">
            <h4>Target Audience</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={formData.targetAudience.location}
                  onChange={(e) => handleInputChange('targetAudience.location', e.target.value)}
                  placeholder="e.g., Global, US, Europe"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Age Group</label>
                <input
                  type="text"
                  value={formData.targetAudience.ageGroup}
                  onChange={(e) => handleInputChange('targetAudience.ageGroup', e.target.value)}
                  placeholder="e.g., 18-35"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Gender</label>
                <select
                  value={formData.targetAudience.gender}
                  onChange={(e) => handleInputChange('targetAudience.gender', e.target.value)}
                  className="form-select"
                >
                  <option value="">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                </select>
              </div>

              <div className="form-group">
                <label>Interests</label>
                <input
                  type="text"
                  value={formData.targetAudience.interests}
                  onChange={(e) => handleInputChange('targetAudience.interests', e.target.value)}
                  placeholder="e.g., Gaming, Fashion, Tech"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="subsection">
            <h4>Platform Requirements</h4>
            <div className="checkbox-grid">
              {platforms.map(platform => (
                <label key={platform} className="checkbox-item">
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
            
            <div className="form-row">
              <div className="form-group">
                <label>Minimum Followers</label>
                <input
                  type="text"
                  value={formData.minRequirements.followersCount}
                  onChange={(e) => handleInputChange('minRequirements.followersCount', e.target.value)}
                  placeholder="e.g., 10K, 100K+"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Minimum Engagement Rate</label>
                <input
                  type="text"
                  value={formData.minRequirements.engagementRate}
                  onChange={(e) => handleInputChange('minRequirements.engagementRate', e.target.value)}
                  placeholder="e.g., 3%, 5%+"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Content Style/Tone</label>
              <input
                type="text"
                value={formData.minRequirements.contentStyle}
                onChange={(e) => handleInputChange('minRequirements.contentStyle', e.target.value)}
                placeholder="e.g., Professional, Casual, Humorous"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Language Preferences</label>
              <div className="checkbox-grid">
                {languages.map(lang => (
                  <label key={lang} className="checkbox-item">
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

          <div className="form-group">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={formData.nicheMatch}
                onChange={(e) => handleInputChange('nicheMatch', e.target.checked)}
              />
              <span>Require niche match (creators must be in relevant category)</span>
            </label>
          </div>

          <div className="form-group">
            <label>Geographic Restrictions</label>
            <input
              type="text"
              value={formData.geographicRestrictions}
              onChange={(e) => handleInputChange('geographicRestrictions', e.target.value)}
              placeholder="e.g., US only, English-speaking countries"
              className="form-input"
            />
          </div>
        </div>

        {/* Deliverables */}
        <div className="form-section">
          <h3>Deliverables</h3>
          
          <div className="form-group">
            <label>Content Format *</label>
            <div className="checkbox-grid">
              {contentFormats.map(format => (
                <label key={format} className="checkbox-item">
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

          <div className="form-group">
            <label>Number of Posts/Videos *</label>
            <input
              type="text"
              value={formData.numberOfPosts}
              onChange={(e) => handleInputChange('numberOfPosts', e.target.value)}
              placeholder="e.g., 2 Instagram posts + 1 story"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Content Guidelines</label>
            <textarea
              value={formData.contentGuidelines}
              onChange={(e) => handleInputChange('contentGuidelines', e.target.value)}
              placeholder="Specific hashtags, mentions, tone, do's & don'ts..."
              className="form-textarea"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label className="checkbox-item">
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
        <div className="form-section">
          <h3>Compensation & Perks</h3>
          
          <div className="form-group">
            <label>Compensation Type *</label>
            <select
              value={formData.compensationType}
              onChange={(e) => handleInputChange('compensationType', e.target.value)}
              className="form-select"
              required
            >
              <option value="">Select compensation type</option>
              {compensationTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {(formData.compensationType === 'Fixed Payment' || formData.compensationType === 'Commission/Affiliate') && (
            <div className="form-group">
              <label>Payment Amount/Range</label>
              <input
                type="text"
                value={formData.paymentAmount}
                onChange={(e) => handleInputChange('paymentAmount', e.target.value)}
                placeholder="e.g., $500-1000, 5% commission"
                className="form-input"
              />
            </div>
          )}

          <div className="form-group">
            <label>Product/Service Details</label>
            <textarea
              value={formData.productDetails}
              onChange={(e) => handleInputChange('productDetails', e.target.value)}
              placeholder="Describe products/services being offered, event details, etc."
              className="form-textarea"
              rows={3}
            />
          </div>
        </div>

        {/* Media & Assets */}
        <div className="form-section">
          <h3>Media & Assets</h3>
          
          <div className="form-group">
            <label>Campaign Banner Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="form-file"
            />
            <small>Upload a banner image for your campaign listing</small>
          </div>

          <div className="form-group">
            <label>Reference Links & Brand Kit</label>
            <textarea
              value={formData.referenceLinks}
              onChange={(e) => handleInputChange('referenceLinks', e.target.value)}
              placeholder="Links to brand kit, style guides, example posts, website..."
              className="form-textarea"
              rows={3}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button 
            onClick={() => handleSubmit(false)}
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? '⏳ Creating Campaign...' : '🚀 Create Campaign'}
          </button>
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

        {/* Live Preview Section */}
        <div className="preview-section">
          <div className="preview-card">
            <div className="preview-header">
              <span className="live-indicator">�</span>
              <h3>Live Preview</h3>
            </div>
            
            {/* Banner Image */}
            <div className="preview-banner">
              {formData.bannerImage && formData.bannerImage instanceof File ? (
                <img src={URL.createObjectURL(formData.bannerImage)} alt="Campaign Banner" />
              ) : (
                <div className="banner-placeholder">
                  <div className="banner-icon">🖼️</div>
                  <p>Upload a banner image to see it here</p>
                </div>
              )}
              <div className="banner-overlay">
                <div className="campaign-badge">{formData.category || 'Campaign'}</div>
              </div>
            </div>

            {/* Campaign Content */}
            <div className="preview-content">
              <div className="campaign-header-preview">
                <h2 className="campaign-title">{formData.title || 'Your Amazing Campaign Title'}</h2>
                <p className="brand-info">
                  <span className="brand-name">{formData.brandName || 'Brand Name'}</span>
                  <span className="campaign-type">{formData.campaignType || 'Campaign Type'}</span>
                </p>
              </div>

              <div className="campaign-description">
                <p>{formData.description || 'Your compelling campaign description will appear here. Make it engaging to attract the right influencers!'}</p>
              </div>

              {/* Campaign Stats */}
              <div className="campaign-stats">
                <div className="stat-item">
                  <div className="stat-icon">📅</div>
                  <div className="stat-content">
                    <span className="stat-label">Duration</span>
                    <span className="stat-value">
                      {formData.startDate && formData.endDate ? 
                        `${new Date(formData.startDate).toLocaleDateString()} - ${new Date(formData.endDate).toLocaleDateString()}` : 
                        'Dates TBD'}
                    </span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-icon">📱</div>
                  <div className="stat-content">
                    <span className="stat-label">Content</span>
                    <span className="stat-value">
                      {formData.numberOfPosts ? 
                        `${formData.numberOfPosts} posts` : 
                        'TBD'}
                    </span>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <span className="stat-label">Min Followers</span>
                    <span className="stat-value">{formData.minRequirements?.followersCount || '1K'}+</span>
                  </div>
                </div>
              </div>

              {/* Platform Tags */}
              {formData.platforms && formData.platforms.length > 0 && (
                <div className="platform-tags">
                  <h4>Platforms</h4>
                  <div className="tags-container">
                    {formData.platforms.map((platform, index) => (
                      <span key={index} className="platform-tag">{platform}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Format Tags */}
              {formData.contentFormat && formData.contentFormat.length > 0 && (
                <div className="content-tags">
                  <h4>Content Types</h4>
                  <div className="tags-container">
                    {formData.contentFormat.map((format, index) => (
                      <span key={index} className="content-tag">{format}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Compensation */}
              <div className="compensation-section">
                <div className="compensation-card">
                  <div className="compensation-icon">💰</div>
                  <div className="compensation-content">
                    <h4>Compensation</h4>
                    <p className="compensation-amount">
                      {formData.paymentAmount ? `$${formData.paymentAmount}` : '$500'}
                    </p>
                    <p className="compensation-type">
                      {formData.compensationType || 'Fixed Payment'}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="cta-section">
                <button className="apply-btn">
                  <span>Apply for Campaign</span>
                  <span className="btn-arrow">→</span>
                </button>
                <p className="apply-note">Join {Math.floor(Math.random() * 50) + 10} other applicants</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
