package main

import (
	"encoding/json"
	"net/http"
)

// Middleware to check user type
func requireUserType(userType string, next http.HandlerFunc) http.HandlerFunc {
	return authMiddleware(func(w http.ResponseWriter, r *http.Request) {
		user, ok := getUserFromContext(r.Context())
		if !ok {
			http.Error(w, "User not found in context", http.StatusInternalServerError)
			return
		}

		if user.UserType != userType {
			http.Error(w, "Access denied: insufficient permissions", http.StatusForbidden)
			return
		}

		next(w, r)
	})
}

// Example protected handler for brands only
func brandOnlyHandler(w http.ResponseWriter, r *http.Request) {
	user, _ := getUserFromContext(r.Context())

	response := map[string]interface{}{
		"message": "Welcome to the brand dashboard!",
		"user":    user.Email,
		"type":    user.UserType,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Example protected handler for influencers only
func influencerOnlyHandler(w http.ResponseWriter, r *http.Request) {
	user, _ := getUserFromContext(r.Context())

	response := map[string]interface{}{
		"message": "Welcome to the influencer dashboard!",
		"user":    user.Email,
		"type":    user.UserType,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
