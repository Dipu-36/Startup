package main

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Authentication is handled by Clerk, so no signup/login handlers needed

func profileHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		getProfileHandler(w, r)
	case "POST":
		createProfileHandler(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getProfileHandler(w http.ResponseWriter, r *http.Request) {
	user, ok := getUserFromContext(r.Context())
	if !ok {
		http.Error(w, "User not found in context", http.StatusInternalServerError)
		return
	}

	// Fetch user from database to get latest data
	collection := database.Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var dbUser User
	userID := getUserIDFromClerkUser(user)

	err := collection.FindOne(ctx, bson.M{"clerkId": userID}).Decode(&dbUser)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(dbUser)
}

func createProfileHandler(w http.ResponseWriter, r *http.Request) {
	user, ok := getUserFromContext(r.Context())
	if !ok {
		http.Error(w, "User not found in context", http.StatusInternalServerError)
		return
	}

	var req struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		UserType string `json:"userType"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Log received data for debugging
	debugUserID := getUserIDFromClerkUser(user)
	println("createProfileHandler called for user:", debugUserID)
	println("Request data:", req.Name, req.Email, req.UserType)

	// Validate user type
	if req.UserType != "brand" && req.UserType != "influencer" {
		println("createProfileHandler: Invalid user type:", req.UserType)
		http.Error(w, "Invalid user type", http.StatusBadRequest)
		return
	}

	userID := getUserIDFromClerkUser(user)
	println("createProfileHandler: Using userID:", userID)

	// Check if user already exists
	collection := database.Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	println("createProfileHandler: Checking if user exists in MongoDB...")
	var existingUser User
	err := collection.FindOne(ctx, bson.M{"clerkId": userID}).Decode(&existingUser)
	if err == nil {
		println("createProfileHandler: User already exists, updating...")
		// User already exists, just update the user type if different
		if existingUser.UserType != req.UserType {
			_, updateErr := collection.UpdateOne(ctx, bson.M{"clerkId": userID}, bson.M{
				"$set": bson.M{
					"userType":  req.UserType,
					"updatedAt": time.Now(),
				},
			})
			if updateErr != nil {
				println("createProfileHandler: Error updating user:", updateErr.Error())
				http.Error(w, "Error updating user", http.StatusInternalServerError)
				return
			}
		}
		println("createProfileHandler: User updated successfully")
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "updated"})
		return
	}

	// Create new user
	println("createProfileHandler: User not found, creating new user...")
	newUser := User{
		ID:        primitive.NewObjectID(),
		ClerkID:   userID,
		Email:     req.Email,
		Name:      req.Name,
		UserType:  req.UserType,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	println("createProfileHandler: Inserting user into MongoDB...")
	_, err = collection.InsertOne(ctx, newUser)
	if err != nil {
		println("createProfileHandler: Error inserting user:", err.Error())
		http.Error(w, "Error creating user", http.StatusInternalServerError)
		return
	}

	println("createProfileHandler: User created successfully!")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"status": "created"})
}

func createCampaignHandler(w http.ResponseWriter, r *http.Request) {
	var req CampaignRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Get user from context
	user, ok := getUserFromContext(r.Context())
	if !ok {
		http.Error(w, "User not found in context", http.StatusInternalServerError)
		return
	}

	// Get user's Clerk ID
	userID := getUserIDFromClerkUser(user)

	// Get user details for brand name
	userCollection := database.Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var dbUser User
	err := userCollection.FindOne(ctx, bson.M{"clerkId": userID}).Decode(&dbUser)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Create campaign
	campaign := Campaign{
		ID:           primitive.NewObjectID(),
		BrandID:      userID,
		BrandName:    dbUser.Name,
		Title:        req.Title,
		Description:  req.Description,
		Category:     req.Category,
		StartDate:    req.StartDate,
		EndDate:      req.EndDate,
		CampaignType: req.CampaignType,
		Budget:       req.Budget,
		Currency:     req.Currency,

		TargetAudienceAge:    req.TargetAudienceAge,
		TargetAudienceGender: req.TargetAudienceGender,
		TargetAudienceRegion: req.TargetAudienceRegion,
		LanguagePreference:   req.LanguagePreference,
		CustomRegion:         req.CustomRegion,

		Platforms: req.Platforms,

		MinRequirements: struct {
			FollowersCount string   `bson:"followersCount" json:"followersCount"`
			EngagementRate string   `bson:"engagementRate" json:"engagementRate"`
			ContentStyle   string   `bson:"contentStyle" json:"contentStyle"`
			Languages      []string `bson:"languages" json:"languages"`
		}{
			FollowersCount: req.MinRequirements.FollowersCount,
			EngagementRate: req.MinRequirements.EngagementRate,
			ContentStyle:   req.MinRequirements.ContentStyle,
			Languages:      req.MinRequirements.Languages,
		},
		MinimumFollowers:       req.MinimumFollowers,
		MinimumEngagement:      req.MinimumEngagement,
		CreatorTier:            req.CreatorTier,
		NicheMatch:             req.NicheMatch,
		GeographicRestrictions: req.GeographicRestrictions,

		ContentFormat:          req.ContentFormat,
		NumberOfPosts:          req.NumberOfPosts,
		HashtagsToUse:          req.HashtagsToUse,
		MentionsRequired:       req.MentionsRequired,
		ContentGuidelines:      req.ContentGuidelines,
		CreativeApprovalNeeded: req.CreativeApprovalNeeded,
		ApprovalRequired:       req.ApprovalRequired,

		CompensationType:     req.CompensationType,
		PaymentAmount:        req.PaymentAmount,
		CommissionPercentage: req.CommissionPercentage,
		FreeProductsOffered:  req.FreeProductsOffered,
		Deliverables:         req.Deliverables,
		PerformanceBonus:     req.PerformanceBonus,
		BonusCriteria:        req.BonusCriteria,
		ProductDetails:       req.ProductDetails,

		ApprovalSteps:        req.ApprovalSteps,
		DeadlineReminders:    req.DeadlineReminders,
		CommunicationChannel: req.CommunicationChannel,
		TimeZone:             req.TimeZone,

		BannerImageURL: req.BannerImageURL,
		ReferenceLinks: req.ReferenceLinks,
		ReferenceMedia: req.ReferenceMedia,

		Status:    "active",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// Insert campaign into database
	collection := database.Collection("campaigns")
	_, err = collection.InsertOne(ctx, campaign)
	if err != nil {
		http.Error(w, "Error creating campaign", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(campaign)
}

func getCampaignsHandler(w http.ResponseWriter, r *http.Request) {
	// Get user from context
	user, ok := getUserFromContext(r.Context())
	if !ok {
		http.Error(w, "User not found in context", http.StatusInternalServerError)
		return
	}

	// Get user's Clerk ID
	userID := getUserIDFromClerkUser(user)

	// Find campaigns for this brand
	collection := database.Collection("campaigns")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{"brandId": userID})
	if err != nil {
		http.Error(w, "Error fetching campaigns", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var campaigns []Campaign
	if err = cursor.All(ctx, &campaigns); err != nil {
		http.Error(w, "Error decoding campaigns", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(campaigns)
}

func getApplicationsForBrandHandler(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Get user from context (set by auth middleware)
	user, ok := getUserFromContext(r.Context())
	if !ok {
		http.Error(w, "User context not found", http.StatusInternalServerError)
		return
	}

	// Get user's Clerk ID
	userID := getUserIDFromClerkUser(user)

	// First, get all campaigns for this brand
	campaignsCollection := database.Collection("campaigns")
	campaignCursor, err := campaignsCollection.Find(ctx, bson.M{"brandId": userID})
	if err != nil {
		http.Error(w, "Error fetching brand campaigns", http.StatusInternalServerError)
		return
	}
	defer campaignCursor.Close(ctx)

	var campaigns []Campaign
	if err = campaignCursor.All(ctx, &campaigns); err != nil {
		http.Error(w, "Error decoding campaigns", http.StatusInternalServerError)
		return
	}

	// Extract campaign IDs
	var campaignIDs []primitive.ObjectID
	campaignMap := make(map[primitive.ObjectID]string)
	for _, campaign := range campaigns {
		campaignIDs = append(campaignIDs, campaign.ID)
		campaignMap[campaign.ID] = campaign.Title
	}

	// Now get all applications for these campaigns
	applicationsCollection := database.Collection("applications")
	applicationCursor, err := applicationsCollection.Find(ctx, bson.M{
		"campaignId": bson.M{"$in": campaignIDs},
	})
	if err != nil {
		http.Error(w, "Error fetching applications", http.StatusInternalServerError)
		return
	}
	defer applicationCursor.Close(ctx)

	var applications []Application
	if err = applicationCursor.All(ctx, &applications); err != nil {
		http.Error(w, "Error decoding applications", http.StatusInternalServerError)
		return
	}

	// Add campaign names to applications and populate creator info from database
	usersCollection := database.Collection("users")
	for i := range applications {
		applications[i].CampaignName = campaignMap[applications[i].CampaignID]

		// If creator info is missing, fetch from database
		if applications[i].CreatorName == "" || applications[i].CreatorName == "Unknown User" || applications[i].CreatorEmail == "" {
			var creator User
			err := usersCollection.FindOne(ctx, bson.M{"clerkId": applications[i].CreatorID}).Decode(&creator)
			if err == nil {
				applications[i].CreatorName = creator.Name
				applications[i].CreatorEmail = creator.Email
			}
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(applications)
}

// Get specific campaign handler
func getCampaignHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	campaignId := vars["campaignId"]

	// Get user from context
	user, ok := getUserFromContext(r.Context())
	if !ok {
		http.Error(w, "User not found in context", http.StatusInternalServerError)
		return
	}

	// Convert campaign ID to ObjectID
	campaignOID, err := primitive.ObjectIDFromHex(campaignId)
	if err != nil {
		http.Error(w, "Invalid campaign ID", http.StatusBadRequest)
		return
	}

	// Find the campaign
	var campaign Campaign
	campaignCollection := database.Collection("campaigns")
	err = campaignCollection.FindOne(context.TODO(), bson.M{"_id": campaignOID}).Decode(&campaign)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "Campaign not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error fetching campaign", http.StatusInternalServerError)
		}
		return
	}

	// Get user's Clerk ID for comparison
	userID := getUserIDFromClerkUser(user)

	// Check if user is the brand owner of this campaign
	userType := getUserTypeFromClerkUser(user)
	if userType == "brand" && campaign.BrandID != userID {
		http.Error(w, "Access denied", http.StatusForbidden)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(campaign)
}

// Get applications for a specific campaign
func getCampaignApplicationsHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	campaignId := vars["campaignId"]

	// Get user from context
	user, ok := getUserFromContext(r.Context())
	if !ok {
		http.Error(w, "User not found in context", http.StatusInternalServerError)
		return
	}

	// Convert campaign ID to ObjectID
	campaignOID, err := primitive.ObjectIDFromHex(campaignId)
	if err != nil {
		http.Error(w, "Invalid campaign ID", http.StatusBadRequest)
		return
	}

	// Find the campaign to verify ownership
	var campaign Campaign
	campaignCollection := database.Collection("campaigns")
	err = campaignCollection.FindOne(context.TODO(), bson.M{"_id": campaignOID}).Decode(&campaign)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "Campaign not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error fetching campaign", http.StatusInternalServerError)
		}
		return
	}

	// Get user's Clerk ID for comparison
	userID := getUserIDFromClerkUser(user)

	// Check if user is the brand owner of this campaign
	userType := getUserTypeFromClerkUser(user)
	if userType == "brand" && campaign.BrandID != userID {
		http.Error(w, "Access denied", http.StatusForbidden)
		return
	}

	// Get applications for this campaign
	applicationsCollection := database.Collection("applications")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := applicationsCollection.Find(ctx, bson.M{"campaignId": campaignOID})
	if err != nil {
		http.Error(w, "Error fetching applications", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var applications []Application
	if err = cursor.All(ctx, &applications); err != nil {
		http.Error(w, "Error decoding applications", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(applications)
}

// Get all campaigns for dashboard (for all users to browse)
func getAllCampaignsHandler(w http.ResponseWriter, r *http.Request) {
	collection := database.Collection("campaigns")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{"status": "active"})
	if err != nil {
		http.Error(w, "Error fetching campaigns", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var campaigns []Campaign
	if err = cursor.All(ctx, &campaigns); err != nil {
		http.Error(w, "Error decoding campaigns", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(campaigns)
}

// Apply to a campaign (for creators)
func applyCampaignHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	campaignId := vars["campaignId"]

	var req struct {
		Followers string `json:"followers"`
		Platform  string `json:"platform"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Get user from context
	user, ok := getUserFromContext(r.Context())
	if !ok {
		http.Error(w, "User not found in context", http.StatusInternalServerError)
		return
	}

	// Convert campaign ID to ObjectID
	campaignObjID, err := primitive.ObjectIDFromHex(campaignId)
	if err != nil {
		http.Error(w, "Invalid campaign ID", http.StatusBadRequest)
		return
	}

	// Get campaign details
	var campaign Campaign
	campaignCollection := database.Collection("campaigns")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = campaignCollection.FindOne(ctx, bson.M{"_id": campaignObjID}).Decode(&campaign)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "Campaign not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error fetching campaign", http.StatusInternalServerError)
		}
		return
	}

	// Get user's Clerk ID
	userID := getUserIDFromClerkUser(user)

	// Get user details from database
	usersCollection := database.Collection("users")
	var dbUser User
	err = usersCollection.FindOne(ctx, bson.M{"clerkId": userID}).Decode(&dbUser)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "User profile not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error fetching user profile", http.StatusInternalServerError)
		}
		return
	}

	// Check if user has already applied to this campaign
	appsCollection := database.Collection("applications")
	existingCount, err := appsCollection.CountDocuments(ctx, bson.M{
		"campaignId": campaignObjID,
		"creatorId":  userID,
	})
	if err != nil {
		http.Error(w, "Error checking existing applications", http.StatusInternalServerError)
		return
	}
	if existingCount > 0 {
		http.Error(w, "You have already applied to this campaign", http.StatusConflict)
		return
	}

	// Create application
	application := Application{
		ID:           primitive.NewObjectID(),
		CampaignID:   campaignObjID,
		CreatorID:    userID,
		CreatorName:  dbUser.Name,  // Get name from database
		CreatorEmail: dbUser.Email, // Get email from database
		Followers:    req.Followers,
		Platform:     req.Platform,
		Status:       "pending",
		AppliedDate:  time.Now(),
		CampaignName: campaign.Title,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	_, err = appsCollection.InsertOne(ctx, application)
	if err != nil {
		http.Error(w, "Error creating application", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(application)
}

// Get creator's applications
func getCreatorApplicationsHandler(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Get user from context
	user, ok := getUserFromContext(r.Context())
	if !ok {
		http.Error(w, "User not found in context", http.StatusInternalServerError)
		return
	}

	// Check if user is an influencer
	userType := getUserTypeFromClerkUser(user)
	if userType != "influencer" {
		http.Error(w, "Only influencers can view applications", http.StatusForbidden)
		return
	}

	// Get user's Clerk ID
	userID := getUserIDFromClerkUser(user)

	// Get applications for this creator
	applicationsCollection := database.Collection("applications")
	applicationCursor, err := applicationsCollection.Find(ctx, bson.M{"creatorId": userID})
	if err != nil {
		http.Error(w, "Error fetching applications", http.StatusInternalServerError)
		return
	}
	defer applicationCursor.Close(ctx)

	var applications []Application
	if err = applicationCursor.All(ctx, &applications); err != nil {
		http.Error(w, "Error decoding applications", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(applications)
}

// Update application status (for brands)
func updateApplicationStatusHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	applicationId := vars["applicationId"]

	var req struct {
		Status string `json:"status"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate status
	if req.Status != "accepted" && req.Status != "rejected" {
		http.Error(w, "Invalid status. Must be 'accepted' or 'rejected'", http.StatusBadRequest)
		return
	}

	// Get user from context
	user, ok := getUserFromContext(r.Context())
	if !ok {
		http.Error(w, "User not found in context", http.StatusInternalServerError)
		return
	}

	// Check if user is a brand
	userType := getUserTypeFromClerkUser(user)
	if userType != "brand" {
		http.Error(w, "Only brands can update application status", http.StatusForbidden)
		return
	}

	// Convert application ID to ObjectID
	appObjID, err := primitive.ObjectIDFromHex(applicationId)
	if err != nil {
		http.Error(w, "Invalid application ID", http.StatusBadRequest)
		return
	}

	// Update application status
	collection := database.Collection("applications")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"_id": appObjID}
	update := bson.M{
		"$set": bson.M{
			"status":    req.Status,
			"updatedAt": time.Now(),
		},
	}

	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		http.Error(w, "Error updating application", http.StatusInternalServerError)
		return
	}

	if result.MatchedCount == 0 {
		http.Error(w, "Application not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Application status updated successfully",
		"status":  req.Status,
	})
}

// Delete campaign (for brands)
func deleteCampaignHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	campaignId := vars["campaignId"]

	// Get user from context
	user, ok := getUserFromContext(r.Context())
	if !ok {
		http.Error(w, "User not found in context", http.StatusInternalServerError)
		return
	}

	// Convert campaign ID to ObjectID
	campaignObjID, err := primitive.ObjectIDFromHex(campaignId)
	if err != nil {
		http.Error(w, "Invalid campaign ID", http.StatusBadRequest)
		return
	}

	// Get campaign to verify ownership
	var campaign Campaign
	campaignCollection := database.Collection("campaigns")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = campaignCollection.FindOne(ctx, bson.M{"_id": campaignObjID}).Decode(&campaign)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "Campaign not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error fetching campaign", http.StatusInternalServerError)
		}
		return
	}

	// Get user's Clerk ID for comparison
	userID := getUserIDFromClerkUser(user)

	// Check if user is the owner of this campaign
	if campaign.BrandID != userID {
		http.Error(w, "Access denied", http.StatusForbidden)
		return
	}

	// Delete the campaign
	_, err = campaignCollection.DeleteOne(ctx, bson.M{"_id": campaignObjID})
	if err != nil {
		http.Error(w, "Error deleting campaign", http.StatusInternalServerError)
		return
	}

	// Also delete related applications
	applicationsCollection := database.Collection("applications")
	_, err = applicationsCollection.DeleteMany(ctx, bson.M{"campaignId": campaignObjID})
	if err != nil {
		// Log error but don't fail the campaign deletion
		// http.Error(w, "Error deleting related applications", http.StatusInternalServerError)
		// return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Campaign deleted successfully",
	})
}
