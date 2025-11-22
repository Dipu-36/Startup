// handlers/youtube_handler.go
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
    "go.mongodb.org/mongo-driver/mongo"
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

    // Get YouTube OAuth client and fetch analytics
    client := getYouTubeClient() // Use your existing OAuth code
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

    // Save to influencer profile
    userObjectID, err := primitive.ObjectIDFromHex(user.UserID)
    if err != nil {
        http.Error(w, "Invalid user ID", http.StatusBadRequest)
        return
    }

    influencerProfile := storage.InfluencerProfile{
        ID:               primitive.NewObjectID(),
        UserID:           userObjectID,
        YouTubeChannel:   req.ChannelName,
        YouTubeChannelID: youtubeService.channelID,
        ChannelAnalytics: analytics,
        LastUpdated:      time.Now(),
        CreatedAt:        time.Now(),
    }

    // Save or update influencer profile
    profileCollection := h.Store.GetCollection("influencer_profiles")
    _, err = profileCollection.UpdateOne(
        r.Context(),
        bson.M{"userId": userObjectID},
        bson.M{"$set": influencerProfile},
        options.Update().SetUpsert(true),
    )
    if err != nil {
        http.Error(w, "Error saving profile", http.StatusInternalServerError)
        return
    }

    // ALSO Save to creator_snapshots for historical tracking
    snapshot := storage.CreatorSnapshot{
        CreatorUserID: user.UserID,
        Platform:      "youtube",
        PlatformID:    youtubeService.channelID,
        SnapshotAt:    time.Now(),
        FollowerCount: analytics.Subscribers,
        ViewCount:     analytics.TotalViews,
        AvgEngagement: analytics.AvgEngagement,
        TopTopics:     analytics.TopTopics,
        CreatedAt:     time.Now(),
        UpdatedAt:     time.Now(),
    }

    // Ensure indexes are created
    db := h.Store.GetCollection("creator_snapshots").Database()
    storage.EnsureSnapshotIndexes(r.Context(), db)

    // Save snapshot
    err = storage.SaveSnapshot(r.Context(), db, &snapshot)
    if err != nil {
        // Log but don't fail the request
        log.Printf("Warning: Could not save snapshot: %v", err)
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
        if err == mongo.ErrNoDocuments {
            http.Error(w, "Profile not found", http.StatusNotFound)
        } else {
            http.Error(w, "Database error", http.StatusInternalServerError)
        }
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(profile.ChannelAnalytics)
}

func (h *Handlers) GetInfluencerProfileHandler(w http.ResponseWriter, r *http.Request) {
    // This can be used by brands to view influencer profiles
    vars := mux.Vars(r)
    influencerID := vars["id"]

    objectID, err := primitive.ObjectIDFromHex(influencerID)
    if err != nil {
        http.Error(w, "Invalid influencer ID", http.StatusBadRequest)
        return
    }

    collection := h.Store.GetCollection("influencer_profiles")
    var profile storage.InfluencerProfile
    err = collection.FindOne(r.Context(), bson.M{"_id": objectID}).Decode(&profile)
    if err != nil {
        if err == mongo.ErrNoDocuments {
            http.Error(w, "Influencer profile not found", http.StatusNotFound)
        } else {
            http.Error(w, "Database error", http.StatusInternalServerError)
        }
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(profile)
}
