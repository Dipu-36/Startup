package main

import (
	"encoding/json"
	"net/http"

<<<<<<< HEAD
	"github.com/clerk/clerk-sdk-go/v2"
)

// Helper function to get email from Clerk user
func getEmailFromClerkUser(user *clerk.User) string {
	if len(user.EmailAddresses) > 0 {
		return user.EmailAddresses[0].EmailAddress
	}
	return ""
}
=======
	"github.com/Dipu-36/startup/internal/auth"
)

// Middleware to check user type
func requireUserType(userType string, next http.HandlerFunc) http.HandlerFunc {
	return auth.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		user, ok := auth.GetUserFromContext(r.Context())
		if !ok {
			http.Error(w, "User not found in context", http.StatusInternalServerError)
			return
		}
>>>>>>> 642e7c2608befb16b23cb768f1f7ebd913ecad33

// Helper function to get user type from Clerk user
func getUserTypeFromClerkUser(user *clerk.User) string {
	userType, _ := getUserTypeFromMetadata(user)
	return userType
}

// protected handler for brands only
func brandOnlyHandler(w http.ResponseWriter, r *http.Request) {
<<<<<<< HEAD
	user, ok := getUserFromContext(r.Context())
	if !ok {
		http.Error(w, "User not found in context", http.StatusInternalServerError)
		return
	}
=======
	user, _ := auth.GetUserFromContext(r.Context())
>>>>>>> 642e7c2608befb16b23cb768f1f7ebd913ecad33

	response := map[string]interface{}{
		"message": "Welcome to the brand dashboard!",
		"user":    getEmailFromClerkUser(user),
		"type":    getUserTypeFromClerkUser(user),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// handler for influencers only
func influencerOnlyHandler(w http.ResponseWriter, r *http.Request) {
<<<<<<< HEAD
	user, ok := getUserFromContext(r.Context())
	if !ok {
		http.Error(w, "User not found in context", http.StatusInternalServerError)
		return
	}
=======
	user, _ := auth.GetUserFromContext(r.Context())
>>>>>>> 642e7c2608befb16b23cb768f1f7ebd913ecad33

	response := map[string]interface{}{
		"message": "Welcome to the influencer dashboard!",
		"user":    getEmailFromClerkUser(user),
		"type":    getUserTypeFromClerkUser(user),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
