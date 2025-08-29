package main

import (
	"encoding/json"
	"net/http"

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

		if user.UserType != userType {
			http.Error(w, "Access denied: insufficient permissions", http.StatusForbidden)
			return
		}

		next(w, r)
	})
}

// protected handler for brands only
func brandOnlyHandler(w http.ResponseWriter, r *http.Request) {
	user, _ := auth.GetUserFromContext(r.Context())

	response := map[string]interface{}{
		"message": "Welcome to the brand dashboard!",
		"user":    user.Email,
		"type":    user.UserType,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// handler for influencers only
func influencerOnlyHandler(w http.ResponseWriter, r *http.Request) {
	user, _ := auth.GetUserFromContext(r.Context())

	response := map[string]interface{}{
		"message": "Welcome to the influencer dashboard!",
		"user":    user.Email,
		"type":    user.UserType,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
