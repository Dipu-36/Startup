package main

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	ClerkID   string             `bson:"clerkId" json:"clerkId"` // Clerk user ID for linking
	Email     string             `bson:"email" json:"email"`
	Name      string             `bson:"name" json:"name"`
	UserType  string             `bson:"userType" json:"userType"` // "brand" or "creator"
	CreatedAt time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time          `bson:"updatedAt" json:"updatedAt"`
}

type Campaign struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	BrandID      string             `bson:"brandId" json:"brandId"` // Now using Clerk ID instead of ObjectID
	BrandName    string             `bson:"brandName" json:"brandName"`
	Title        string             `bson:"title" json:"title"`
	Description  string             `bson:"description" json:"description"`
	Category     string             `bson:"category" json:"category"`
	StartDate    string             `bson:"startDate" json:"startDate"`
	EndDate      string             `bson:"endDate" json:"endDate"`
	CampaignType string             `bson:"campaignType" json:"campaignType"`
	Budget       string             `bson:"budget" json:"budget"`
	Currency     string             `bson:"currency" json:"currency"`

	// Target & Requirements
	TargetAudience struct {
		Location  string `bson:"location" json:"location"`
		AgeGroup  string `bson:"ageGroup" json:"ageGroup"`
		Gender    string `bson:"gender" json:"gender"`
		Interests string `bson:"interests" json:"interests"`
	} `bson:"targetAudience" json:"targetAudience"`

	TargetAudienceAge    []string `bson:"targetAudienceAge" json:"targetAudienceAge"`
	TargetAudienceGender []string `bson:"targetAudienceGender" json:"targetAudienceGender"`
	TargetAudienceRegion []string `bson:"targetAudienceRegion" json:"targetAudienceRegion"`
	LanguagePreference   string   `bson:"languagePreference" json:"languagePreference"`
	CustomRegion         string   `bson:"customRegion" json:"customRegion"`

	Platforms []string `bson:"platforms" json:"platforms"`

	MinRequirements struct {
		FollowersCount string   `bson:"followersCount" json:"followersCount"`
		EngagementRate string   `bson:"engagementRate" json:"engagementRate"`
		ContentStyle   string   `bson:"contentStyle" json:"contentStyle"`
		Languages      []string `bson:"languages" json:"languages"`
	} `bson:"minRequirements" json:"minRequirements"`

	MinimumFollowers  string `bson:"minimumFollowers" json:"minimumFollowers"`
	MinimumEngagement string `bson:"minimumEngagement" json:"minimumEngagement"`
	CreatorTier       string `bson:"creatorTier" json:"creatorTier"`

	NicheMatch             bool   `bson:"nicheMatch" json:"nicheMatch"`
	GeographicRestrictions string `bson:"geographicRestrictions" json:"geographicRestrictions"`

	// Deliverables
	ContentFormat          []string `bson:"contentFormat" json:"contentFormat"`
	NumberOfPosts          string   `bson:"numberOfPosts" json:"numberOfPosts"`
	HashtagsToUse          string   `bson:"hashtagsToUse" json:"hashtagsToUse"`
	MentionsRequired       string   `bson:"mentionsRequired" json:"mentionsRequired"`
	ContentGuidelines      string   `bson:"contentGuidelines" json:"contentGuidelines"`
	CreativeApprovalNeeded bool     `bson:"creativeApprovalNeeded" json:"creativeApprovalNeeded"`
	ApprovalRequired       bool     `bson:"approvalRequired" json:"approvalRequired"`

	// Compensation & Perks
	CompensationType     string `bson:"compensationType" json:"compensationType"`
	PaymentAmount        string `bson:"paymentAmount" json:"paymentAmount"`
	CommissionPercentage string `bson:"commissionPercentage" json:"commissionPercentage"`
	FreeProductsOffered  string `bson:"freeProductsOffered" json:"freeProductsOffered"`
	Deliverables         string `bson:"deliverables" json:"deliverables"`
	PerformanceBonus     bool   `bson:"performanceBonus" json:"performanceBonus"`
	BonusCriteria        string `bson:"bonusCriteria" json:"bonusCriteria"`
	ProductDetails       string `bson:"productDetails" json:"productDetails"`

	// Campaign Workflow
	ApprovalSteps        []string `bson:"approvalSteps" json:"approvalSteps"`
	DeadlineReminders    bool     `bson:"deadlineReminders" json:"deadlineReminders"`
	CommunicationChannel string   `bson:"communicationChannel" json:"communicationChannel"`
	TimeZone             string   `bson:"timeZone" json:"timeZone"`

	// Media & Assets
	BannerImageURL string `bson:"bannerImageUrl" json:"bannerImageUrl"`
	ReferenceLinks string `bson:"referenceLinks" json:"referenceLinks"`
	ReferenceMedia string `bson:"referenceMedia" json:"referenceMedia"`

	// Status and Metadata
	Status     string    `bson:"status" json:"status"` // "draft", "active", "completed", "cancelled"
	Applicants int       `bson:"applicants" json:"applicants"`
	CreatedAt  time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt  time.Time `bson:"updatedAt" json:"updatedAt"`
}

type Application struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	CampaignID   primitive.ObjectID `bson:"campaignId" json:"campaignId"`
	CreatorID    string             `bson:"creatorId" json:"creatorId"` // Now using Clerk ID instead of ObjectID
	CreatorName  string             `bson:"creatorName" json:"creatorName"`
	CreatorEmail string             `bson:"creatorEmail" json:"creatorEmail"`
	Followers    string             `bson:"followers" json:"followers"`
	Platform     string             `bson:"platform" json:"platform"`
	Status       string             `bson:"status" json:"status"` // "pending", "approved", "rejected"
	AppliedDate  time.Time          `bson:"appliedDate" json:"appliedDate"`
	CampaignName string             `bson:"campaignName" json:"campaignName"`
	CreatedAt    time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt    time.Time          `bson:"updatedAt" json:"updatedAt"`
}

// CampaignRequest represents the request payload for creating a campaign
type CampaignRequest struct {
	Title        string `json:"title"`
	Description  string `json:"description"`
	Category     string `json:"category"`
	StartDate    string `json:"startDate"`
	EndDate      string `json:"endDate"`
	CampaignType string `json:"campaignType"`
	Budget       string `json:"budget"`
	Currency     string `json:"currency"`

	TargetAudience struct {
		Location  string `json:"location"`
		AgeGroup  string `json:"ageGroup"`
		Gender    string `json:"gender"`
		Interests string `json:"interests"`
	} `json:"targetAudience"`

	TargetAudienceAge    []string `json:"targetAudienceAge"`
	TargetAudienceGender []string `json:"targetAudienceGender"`
	TargetAudienceRegion []string `json:"targetAudienceRegion"`
	LanguagePreference   string   `json:"languagePreference"`
	CustomRegion         string   `json:"customRegion"`

	Platforms []string `json:"platforms"`

	MinRequirements struct {
		FollowersCount string   `json:"followersCount"`
		EngagementRate string   `json:"engagementRate"`
		ContentStyle   string   `json:"contentStyle"`
		Languages      []string `json:"languages"`
	} `json:"minRequirements"`

	MinimumFollowers       string `json:"minimumFollowers"`
	MinimumEngagement      string `json:"minimumEngagement"`
	CreatorTier            string `json:"creatorTier"`
	NicheMatch             bool   `json:"nicheMatch"`
	GeographicRestrictions string `json:"geographicRestrictions"`

	ContentFormat          []string `json:"contentFormat"`
	NumberOfPosts          string   `json:"numberOfPosts"`
	HashtagsToUse          string   `json:"hashtagsToUse"`
	MentionsRequired       string   `json:"mentionsRequired"`
	ContentGuidelines      string   `json:"contentGuidelines"`
	CreativeApprovalNeeded bool     `json:"creativeApprovalNeeded"`
	ApprovalRequired       bool     `json:"approvalRequired"`

	CompensationType     string `json:"compensationType"`
	PaymentAmount        string `json:"paymentAmount"`
	CommissionPercentage string `json:"commissionPercentage"`
	FreeProductsOffered  string `json:"freeProductsOffered"`
	Deliverables         string `json:"deliverables"`
	PerformanceBonus     bool   `json:"performanceBonus"`
	BonusCriteria        string `json:"bonusCriteria"`
	ProductDetails       string `json:"productDetails"`

	ApprovalSteps        []string `json:"approvalSteps"`
	DeadlineReminders    bool     `json:"deadlineReminders"`
	CommunicationChannel string   `json:"communicationChannel"`
	TimeZone             string   `json:"timeZone"`

	BannerImageURL string `json:"bannerImageUrl"`
	ReferenceLinks string `json:"referenceLinks"`
	ReferenceMedia string `json:"referenceMedia"`
	Status         string `json:"status"`
}

// UserProfile represents the user profile response (for Clerk integration)
type UserProfile struct {
	ClerkID  string `json:"clerkId"`
	Email    string `json:"email"`
	Name     string `json:"name"`
	UserType string `json:"userType"`
}
