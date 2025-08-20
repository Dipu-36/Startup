package auth

import (
	"context"
	"errors"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/Dipu-36/startup/internal/storage"
	"github.com/golang-jwt/jwt/v5"
)

// Claims defines JWT payload
type Claims struct {
	UserID   string `json:"user_id"`
	Email    string `json:"email"`
	UserType string `json:"user_type"`
	jwt.RegisteredClaims
}

// GenerateJWT creates and retuns a signed token or an error
func GenerateJWT(user storage.User) (string, error) {
	//Read secret key from the environment variable
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return "", errors.New("JWT_SECRET environment variable is required")
	}
	//token inlcudes the following
	claims := Claims{
		UserID:   user.ID.Hex(),
		Email:    user.Email,
		UserType: user.UserType,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(jwtSecret))
}

// ValidateJWT verifies a JWT token and returns the claims and error
func ValidateJWT(tokenString string) (*Claims, error) {
	//Ensuring the token was signed with the correct key
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return nil, errors.New("JWT_SECRET environment variable is required")
	}

	//Parsing and chekcing the Claims
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(jwtSecret), nil
	})

	if err != nil {
		return nil, err
	}
	//Passing the parsed token and then returning it as it has been validated
	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}

// AuthMiddleware is an HTTP middleware that enforces JWT authentication it returns the extracted user claims in the request context
func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			http.Error(w, "Bearer token required", http.StatusUnauthorized)
			return
		}

		claims, err := ValidateJWT(tokenString)
		if err != nil {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Add user info to request context
		ctx := r.Context()
		ctx = SetUserInContext(ctx, claims)
		r = r.WithContext(ctx)

		next(w, r)
	}
}

// SetUserInContext stores the JWT claims inside the request context allowing downstream handlers to retrieve authenticated user
// remooving the need to reparse the token
func SetUserInContext(ctx context.Context, claims *Claims) context.Context {
	return context.WithValue(ctx, "user", claims)
}

// GetUserFromContext retireves the JWT claims from the request context and returns Claims pointer and a boolean
// to indicate whether the user was found or not
func GetUserFromContext(ctx context.Context) (*Claims, bool) {
	user, ok := ctx.Value("user").(*Claims)
	return user, ok
}
