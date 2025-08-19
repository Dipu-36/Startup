package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/Dipu-36/startup/internal/auth"
	"github.com/Dipu-36/startup/internal/storage"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (h *Handlers) CreateCampaignHandler(w http.ResponseWriter, r *http.Request) {
	// Get user from context
	user, ok := auth.GetUserFromContext(r.Context())
	if !ok {
		http.Error(w, "User not found in context", http.StatusInternalServerError)
		return
	}

	// Parse request body
	var req storage.CampaignRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if req.Title == "" || req.Description == "" {
		http.Error(w, "Title and description are required", http.StatusBadRequest)
		return
	}

	// Get user's ObjectID
	userObjectID, err := primitive.ObjectIDFromHex(user.UserID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	// Get user details for brand name
	userCollection := h.store.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var dbUser storage.User
	err = userCollection.FindOne(ctx, bson.M{"_id": userObjectID}).Decode(&dbUser)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Create campaign
	campaign := storage.Campaign{
		ID:           primitive.NewObjectID(),
		BrandID:      userObjectID,
		BrandName:    dbUser.Name,
		Title:        req.Title,
		Description:  req.Description,
		Category:     req.Category,
		StartDate:    req.StartDate,
		EndDate:      req.EndDate,
		CampaignType: req.CampaignType,

		Platforms:              req.Platforms,
		NicheMatch:             req.NicheMatch,
		GeographicRestrictions: req.GeographicRestrictions,

		ContentFormat:     req.ContentFormat,
		NumberOfPosts:     req.NumberOfPosts,
		ContentGuidelines: req.ContentGuidelines,
		ApprovalRequired:  req.ApprovalRequired,

		CompensationType: req.CompensationType,
		PaymentAmount:    req.PaymentAmount,
		ProductDetails:   req.ProductDetails,

		BannerImageURL: req.BannerImageURL,
		ReferenceLinks: req.ReferenceLinks,

		Status:     req.Status,
		Applicants: 0,
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}

	// Set nested structs manually
	campaign.TargetAudience.Location = req.TargetAudience.Location
	campaign.TargetAudience.AgeGroup = req.TargetAudience.AgeGroup
	campaign.TargetAudience.Gender = req.TargetAudience.Gender
	campaign.TargetAudience.Interests = req.TargetAudience.Interests

	campaign.MinRequirements.FollowersCount = req.MinRequirements.FollowersCount
	campaign.MinRequirements.EngagementRate = req.MinRequirements.EngagementRate
	campaign.MinRequirements.ContentStyle = req.MinRequirements.ContentStyle
	campaign.MinRequirements.Languages = req.MinRequirements.Languages

	// Insert campaign into database
	collection := h.store.GetCollection("campaigns")
	_, err = collection.InsertOne(ctx, campaign)
	if err != nil {
		http.Error(w, "Error creating campaign", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(campaign)
}

func (h *Handlers) GetCampaignsHandler(w http.ResponseWriter, r *http.Request) {
	// Get user from context
	user, ok := auth.GetUserFromContext(r.Context())
	if !ok {
		http.Error(w, "User not found in context", http.StatusInternalServerError)
		return
	}

	// Get user's ObjectID
	userObjectID, err := primitive.ObjectIDFromHex(user.UserID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	// Find campaigns for this brand
	collection := h.store.GetCollection("campaigns")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{"brandId": userObjectID})
	if err != nil {
		http.Error(w, "Error fetching campaigns", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var campaigns []storage.Campaign
	if err = cursor.All(ctx, &campaigns); err != nil {
		http.Error(w, "Error decoding campaigns", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(campaigns)
}

func (h *Handlers) GetAllCampaignsHandler(w http.ResponseWriter, r *http.Request) {
	// Find all active campaigns (for influencers to browse)
	collection := h.store.GetCollection("campaigns")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{"status": "active"})
	if err != nil {
		http.Error(w, "Error fetching campaigns", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var campaigns []storage.Campaign
	if err = cursor.All(ctx, &campaigns); err != nil {
		http.Error(w, "Error decoding campaigns", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(campaigns)
}
