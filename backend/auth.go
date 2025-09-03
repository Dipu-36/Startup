package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/jwt"
)

// ClerkConfig holds Clerk configuration
type ClerkConfig struct {
	SecretKey      string
	PublishableKey string
}

// UserMetadata represents custom user metadata
type UserMetadata struct {
	UserType string `json:"userType"`
}

// Context key for storing user information
type contextKey string

const userContextKey = contextKey("user")

// getClerkConfig returns Clerk configuration from environment variables
func getClerkConfig() (*ClerkConfig, error) {
	secretKey := os.Getenv("CLERK_SECRET_KEY")
	if secretKey == "" {
		return nil, fmt.Errorf("CLERK_SECRET_KEY environment variable is required")
	}

	publishableKey := os.Getenv("CLERK_PUBLISHABLE_KEY")
	if publishableKey == "" {
		return nil, fmt.Errorf("CLERK_PUBLISHABLE_KEY environment variable is required")
	}

	return &ClerkConfig{
		SecretKey:      secretKey,
		PublishableKey: publishableKey,
	}, nil
}

// initializeClerk initializes the Clerk SDK with the secret key
func initializeClerk() error {
	config, err := getClerkConfig()
	if err != nil {
		return fmt.Errorf("failed to get Clerk config: %w", err)
	}

	// Set the secret key for the Clerk SDK
	clerk.SetKey(config.SecretKey)

	return nil
}

// verifyJWT verifies a Clerk JWT token and returns the session claims
func verifyJWT(tokenString string) (*clerk.SessionClaims, error) {
	// Create a context with timeout for JWT verification
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Verify the JWT token using Clerk's built-in verification
	claims, err := jwt.Verify(ctx, &jwt.VerifyParams{
		Token: tokenString,
	})
	if err != nil {
		// Check if it's a timeout error
		if ctx.Err() == context.DeadlineExceeded {
			return nil, fmt.Errorf("failed to verify JWT: request timeout while fetching Clerk JWKS keys")
		}
		return nil, fmt.Errorf("failed to verify JWT: %w", err)
	}

	return claims, nil
}

// getUserFromClaims creates a minimal user object from JWT claims
func getUserFromClaims(claims *clerk.SessionClaims) *clerk.User {
	return &clerk.User{
		ID: claims.Subject,
	}
}

// authMiddleware is the authentication middleware that verifies JWT tokens
func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		println("authMiddleware: Processing request to", r.URL.Path)

		// Get the Authorization header
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			println("authMiddleware: No authorization header found")
			http.Error(w, "Authorization header is required", http.StatusUnauthorized)
			return
		}

		// Check if the header starts with "Bearer "
		if !strings.HasPrefix(authHeader, "Bearer ") {
			println("authMiddleware: Authorization header doesn't start with Bearer")
			http.Error(w, "Authorization header must start with Bearer", http.StatusUnauthorized)
			return
		}

		// Extract the token
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		println("authMiddleware: Token extracted, length:", len(tokenString))

		// Verify the JWT token
		claims, err := verifyJWT(tokenString)
		if err != nil {
			println("authMiddleware: JWT verification failed:", err.Error())

			// Check if it's a network timeout error with Clerk
			if strings.Contains(err.Error(), "context deadline exceeded") ||
				strings.Contains(err.Error(), "request timeout") {
				println("authMiddleware: Clerk service timeout detected")
				http.Error(w, "Authentication service temporarily unavailable. Please try again in a few moments.", http.StatusServiceUnavailable)
				return
			}

			http.Error(w, fmt.Sprintf("Invalid token: %v", err), http.StatusUnauthorized)
			return
		}

		// Create user from claims
		user := getUserFromClaims(claims)
		println("authMiddleware: JWT verified, user subject:", user.ID)

		// Add user to request context
		ctx := context.WithValue(r.Context(), userContextKey, user)
		r = r.WithContext(ctx)

		// Call the next handler
		next.ServeHTTP(w, r)
	})
}

// requireUserType returns a middleware that checks if the user has the required type
func requireUserType(userType string, next http.HandlerFunc) http.HandlerFunc {
	return authMiddleware(func(w http.ResponseWriter, r *http.Request) {
		user, ok := getUserFromContext(r.Context())
		if !ok {
			http.Error(w, "User not found in context", http.StatusInternalServerError)
			return
		}

		currentUserType := getUserTypeFromClerkUser(user)
		if currentUserType != userType {
			http.Error(w, fmt.Sprintf("Access denied. Required user type: %s", userType), http.StatusForbidden)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// getUserFromContext retrieves the user from the request context
func getUserFromContext(ctx context.Context) (*clerk.User, bool) {
	user, ok := ctx.Value(userContextKey).(*clerk.User)
	return user, ok
}

// getUserIDFromClerkUser extracts user ID from Clerk user
func getUserIDFromClerkUser(user *clerk.User) string {
	if user == nil {
		return ""
	}
	return user.ID
}

// getNameFromClerkUser extracts name from Clerk user
func getNameFromClerkUser(user *clerk.User) string {
	if user == nil {
		return ""
	}

	// Try full name first
	if user.FirstName != nil && user.LastName != nil {
		return fmt.Sprintf("%s %s", *user.FirstName, *user.LastName)
	}

	// Try first name only
	if user.FirstName != nil {
		return *user.FirstName
	}

	// Try last name only
	if user.LastName != nil {
		return *user.LastName
	}

	// Try username
	if user.Username != nil {
		return *user.Username
	}

	// Fallback to email
	if len(user.EmailAddresses) > 0 {
		return user.EmailAddresses[0].EmailAddress
	}

	return "Unknown User"
}

// getUserTypeFromMetadata extracts user type from Clerk user's public metadata
func getUserTypeFromMetadata(user *clerk.User) (string, error) {
	if user == nil {
		return "", fmt.Errorf("user is nil")
	}

	// Since we're working with a minimal user object from JWT claims,
	// we don't have access to actual metadata from Clerk API
	// For now, return a default user type
	return "creator", nil
}
