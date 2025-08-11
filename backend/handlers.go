package main

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

func signupHandler(w http.ResponseWriter, r *http.Request) {
	var req SignupRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if req.Email == "" || req.Password == "" || req.Name == "" || req.UserType == "" {
		http.Error(w, "All fields are required", http.StatusBadRequest)
		return
	}

	// Validate user type
	if req.UserType != "brand" && req.UserType != "influencer" {
		http.Error(w, "User type must be 'brand' or 'influencer'", http.StatusBadRequest)
		return
	}

	// Check if user already exists
	collection := database.Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var existingUser User
	err := collection.FindOne(ctx, bson.M{"email": req.Email}).Decode(&existingUser)
	if err == nil {
		http.Error(w, "User already exists with this email", http.StatusConflict)
		return
	}
	if err != mongo.ErrNoDocuments {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Error processing password", http.StatusInternalServerError)
		return
	}

	// Create user
	user := User{
		ID:        primitive.NewObjectID(),
		Email:     req.Email,
		Password:  string(hashedPassword),
		Name:      req.Name,
		UserType:  req.UserType,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	_, err = collection.InsertOne(ctx, user)
	if err != nil {
		http.Error(w, "Error creating user", http.StatusInternalServerError)
		return
	}

	// Generate JWT
	token, err := generateJWT(user)
	if err != nil {
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	// Return response
	response := AuthResponse{
		Token: token,
		User:  user,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if req.Email == "" || req.Password == "" {
		http.Error(w, "Email and password are required", http.StatusBadRequest)
		return
	}

	// Find user
	collection := database.Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user User
	err := collection.FindOne(ctx, bson.M{"email": req.Email}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		} else {
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	// Check password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	// Generate JWT
	token, err := generateJWT(user)
	if err != nil {
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	// Return response
	response := AuthResponse{
		Token: token,
		User:  user,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func profileHandler(w http.ResponseWriter, r *http.Request) {
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
	objectID, err := primitive.ObjectIDFromHex(user.UserID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	err = collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&dbUser)
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

// Campaign Handlers

func createCampaignHandler(w http.ResponseWriter, r *http.Request) {
	// Get user from context
	user, ok := getUserFromContext(r.Context())
	if !ok {
		http.Error(w, "User not found in context", http.StatusInternalServerError)
		return
	}

	// Parse request body
	var req CampaignRequest
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
	userCollection := database.Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var dbUser User
	err = userCollection.FindOne(ctx, bson.M{"_id": userObjectID}).Decode(&dbUser)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Create campaign
	campaign := Campaign{
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

	// Get user's ObjectID
	userObjectID, err := primitive.ObjectIDFromHex(user.UserID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	// Find campaigns for this brand
	collection := database.Collection("campaigns")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{"brandId": userObjectID})
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

func getAllCampaignsHandler(w http.ResponseWriter, r *http.Request) {
	// Find all active campaigns (for influencers to browse)
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
