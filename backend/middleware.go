package main

import (
	"encoding/json"
	"net/http"

	"github.com/clerk/clerk-sdk-go/v2"
)

// Helper function to get email from Clerk user
func getEmailFromClerkUser(user *clerk.User) string {
	if len(user.EmailAddresses) > 0 {
		return user.EmailAddresses[0].EmailAddress
	}
	return ""
}

// Helper function to get user type from Clerk user
func getUserTypeFromClerkUser(user *clerk.User) string {
	userType, _ := getUserTypeFromMetadata(user)
	return userType
}

// Example protected handler for brands only
func brandOnlyHandler(w http.ResponseWriter, r *http.Request) {
	user, ok := getUserFromContext(r.Context())
	if !ok {
		http.Error(w, "User not found in context", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"message": "Welcome to the brand dashboard!",
		"user":    getEmailFromClerkUser(user),
		"type":    getUserTypeFromClerkUser(user),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Example protected handler for influencers only
func influencerOnlyHandler(w http.ResponseWriter, r *http.Request) {
	user, ok := getUserFromContext(r.Context())
	if !ok {
		http.Error(w, "User not found in context", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"message": "Welcome to the influencer dashboard!",
		"user":    getEmailFromClerkUser(user),
		"type":    getUserTypeFromClerkUser(user),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
