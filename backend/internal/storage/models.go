// Package storage defines the structure of the database entites and defines the realtionships between these entites
// - it also abstracts the Database by creating an interface over which the application interacts
// - the package uses the DB credentials from the env file and uses it for connection pooling and maintence
package storage

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// User defines the model for User
type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Email     string             `bson:"email" json:"email"`
	Password  string             `bson:"password" json:"-"` // Don't include password in JSON responses
	Name      string             `bson:"name" json:"name"`
	UserType  string             `bson:"userType" json:"userType"` // "brand" or "influencer"
	CreatedAt time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time          `bson:"updatedAt" json:"updatedAt"`
}

// Campaign defines the model for Campaign
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

// LoginRequest defines the model for Loginrequest
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// SignupRequest defines the model for SignupRequest
type SignupRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
	UserType string `json:"userType"`
}

// AuthResponse defines the model for AuthResponse
type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

// CampaignRequest defines the model for CampaignRequest
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
// CreatorSnapshot is the canonical, normalized snapshot stored for each creator at a point in time.
type CreatorSnapshot struct {
    ID             string            `bson:"_id,omitempty" json:"id,omitempty"` 
    CreatorUserID  string            `bson:"creator_user_id" json:"creator_user_id"` // your internal user id
    Platform       string            `bson:"platform" json:"platform"`                 // "youtube"
    PlatformID     string            `bson:"platform_id" json:"platform_id"`           // platform-specific creator id
    SnapshotAt     time.Time         `bson:"snapshot_at" json:"snapshot_at"`           // time of snapshot
    FollowerCount  int64             `bson:"follower_count" json:"follower_count"`
    ViewCount      int64             `bson:"view_count" json:"view_count"`         // total views (if available)
    AvgEngagement  float64           `bson:"avg_engagement" json:"avg_engagement"` // normalized engagement rate (0..1)
    RegionCounts   map[string]int64  `bson:"region_counts,omitempty" json:"region_counts,omitempty"`   // e.g. {"IN": 1200, "US": 300}
    AgeBuckets     map[string]int64  `bson:"age_buckets,omitempty" json:"age_buckets,omitempty"`       // e.g. {"13-17":100,"18-24":200}
    TopTopics      []string          `bson:"top_topics,omitempty" json:"top_topics,omitempty"`         // extracted tags/topics
    RawPayload     map[string]interface{} `bson:"raw_payload,omitempty" json:"raw_payload,omitempty"` // raw API response for debugging
    CreatedAt      time.Time         `bson:"created_at" json:"created_at"`
    UpdatedAt      time.Time         `bson:"updated_at" json:"updated_at"`
}


