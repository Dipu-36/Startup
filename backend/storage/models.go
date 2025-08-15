package storage

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Email     string             `bson:"email" json:"email"`
	Password  string             `bson:"password" json:"-"` // Don't include password in JSON responses
	Name      string             `bson:"name" json:"name"`
	UserType  string             `bson:"userType" json:"userType"` // "brand" or "influencer"
	CreatedAt time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time          `bson:"updatedAt" json:"updatedAt"`
}

type Campaign struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	BrandID      primitive.ObjectID `bson:"brandId" json:"brandId"`
	BrandName    string             `bson:"brandName" json:"brandName"`
	Title        string             `bson:"title" json:"title"`
	Description  string             `bson:"description" json:"description"`
	Category     string             `bson:"category" json:"category"`
	StartDate    string             `bson:"startDate" json:"startDate"`
	EndDate      string             `bson:"endDate" json:"endDate"`
	CampaignType string             `bson:"campaignType" json:"campaignType"`

	// Target & Requirements
	TargetAudience struct {
		Location  string `bson:"location" json:"location"`
		AgeGroup  string `bson:"ageGroup" json:"ageGroup"`
		Gender    string `bson:"gender" json:"gender"`
		Interests string `bson:"interests" json:"interests"`
	} `bson:"targetAudience" json:"targetAudience"`

	Platforms []string `bson:"platforms" json:"platforms"`

	MinRequirements struct {
		FollowersCount string   `bson:"followersCount" json:"followersCount"`
		EngagementRate string   `bson:"engagementRate" json:"engagementRate"`
		ContentStyle   string   `bson:"contentStyle" json:"contentStyle"`
		Languages      []string `bson:"languages" json:"languages"`
	} `bson:"minRequirements" json:"minRequirements"`

	NicheMatch             bool   `bson:"nicheMatch" json:"nicheMatch"`
	GeographicRestrictions string `bson:"geographicRestrictions" json:"geographicRestrictions"`

	// Deliverables
	ContentFormat     []string `bson:"contentFormat" json:"contentFormat"`
	NumberOfPosts     string   `bson:"numberOfPosts" json:"numberOfPosts"`
	ContentGuidelines string   `bson:"contentGuidelines" json:"contentGuidelines"`
	ApprovalRequired  bool     `bson:"approvalRequired" json:"approvalRequired"`

	// Compensation & Perks
	CompensationType string `bson:"compensationType" json:"compensationType"`
	PaymentAmount    string `bson:"paymentAmount" json:"paymentAmount"`
	ProductDetails   string `bson:"productDetails" json:"productDetails"`

	// Media & Assets
	BannerImageURL string `bson:"bannerImageUrl" json:"bannerImageUrl"`
	ReferenceLinks string `bson:"referenceLinks" json:"referenceLinks"`

	// Status and Metadata
	Status     string    `bson:"status" json:"status"` // "draft", "active", "completed", "cancelled"
	Applicants int       `bson:"applicants" json:"applicants"`
	CreatedAt  time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt  time.Time `bson:"updatedAt" json:"updatedAt"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type SignupRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
	UserType string `json:"userType"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

type CampaignRequest struct {
	Title        string `json:"title"`
	Description  string `json:"description"`
	Category     string `json:"category"`
	StartDate    string `json:"startDate"`
	EndDate      string `json:"endDate"`
	CampaignType string `json:"campaignType"`

	TargetAudience struct {
		Location  string `json:"location"`
		AgeGroup  string `json:"ageGroup"`
		Gender    string `json:"gender"`
		Interests string `json:"interests"`
	} `json:"targetAudience"`

	Platforms []string `json:"platforms"`

	MinRequirements struct {
		FollowersCount string   `json:"followersCount"`
		EngagementRate string   `json:"engagementRate"`
		ContentStyle   string   `json:"contentStyle"`
		Languages      []string `json:"languages"`
	} `json:"minRequirements"`

	NicheMatch             bool   `json:"nicheMatch"`
	GeographicRestrictions string `json:"geographicRestrictions"`

	ContentFormat     []string `json:"contentFormat"`
	NumberOfPosts     string   `json:"numberOfPosts"`
	ContentGuidelines string   `json:"contentGuidelines"`
	ApprovalRequired  bool     `json:"approvalRequired"`

	CompensationType string `json:"compensationType"`
	PaymentAmount    string `json:"paymentAmount"`
	ProductDetails   string `json:"productDetails"`

	BannerImageURL string `json:"bannerImageUrl"`
	ReferenceLinks string `json:"referenceLinks"`
	Status         string `json:"status"`
}
