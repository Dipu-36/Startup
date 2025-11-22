// youtube_handler.go
package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/Dipu-36/startup/internal/auth"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type YouTubeConnectRequest struct {
	ChannelName string `json:"channelName"`
}

func (h *Handlers) ConnectYouTubeHandler(w http.ResponseWriter, r *http.Request) {
	user, ok := auth.GetUserFromContext(r.Context())
	if !ok {
		http.Error(w, "User not found in context", http.StatusInternalServerError)
		return
	}

	if user.UserType != "influencer" {
		http.Error(w, "Only influencers can connect YouTube channels", http.StatusForbidden)
		return
	}

	var req YouTubeConnectRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.ChannelName == "" {
		http.Error(w, "Channel name is required", http.StatusBadRequest)
		return
	}

	// Get YouTube OAuth client (you'll need to implement this)
	client := getYouTubeClient() // Use your existing OAuth code

	// Create YouTube service and fetch analytics
	youtubeService, err := NewYouTubeService(client, req.ChannelName)
	if err != nil {
		http.Error(w, "Error connecting to YouTube: "+err.Error(), http.StatusInternalServerError)
		return
	}

	analytics, err := youtubeService.GetChannelAnalytics()
	if err != nil {
		http.Error(w, "Error fetching analytics: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Save to database
	userObjectID, err := primitive.ObjectIDFromHex(user.UserID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	influencerProfile := storage.InfluencerProfile{
		ID:               primitive.NewObjectID(),
		UserID:           userObjectID,
		YouTubeChannel:   req.ChannelName,
		ChannelAnalytics: analytics,
		LastUpdated:      time.Now(),
		CreatedAt:        time.Now(),
	}

	collection := h.Store.GetCollection("influencer_profiles")
	_, err = collection.InsertOne(r.Context(), influencerProfile)
	if err != nil {
		http.Error(w, "Error saving profile", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(influencerProfile)
}

func (h *Handlers) GetInfluencerAnalyticsHandler(w http.ResponseWriter, r *http.Request) {
	user, ok := auth.GetUserFromContext(r.Context())
	if !ok {
		http.Error(w, "User not found in context", http.StatusInternalServerError)
		return
	}

	userObjectID, err := primitive.ObjectIDFromHex(user.UserID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	collection := h.Store.GetCollection("influencer_profiles")
	var profile storage.InfluencerProfile
	err = collection.FindOne(r.Context(), bson.M{"userId": userObjectID}).Decode(&profile)
	if err != nil {
		http.Error(w, "Profile not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(profile.ChannelAnalytics)
}
