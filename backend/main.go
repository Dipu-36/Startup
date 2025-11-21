package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/bson"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Initialize Clerk
	if err := initializeClerk(); err != nil {
		log.Fatal("Failed to initialize Clerk:", err)
	}

	// Initialize MongoDB
	initMongoDB()
	defer closeMongoDB()

	router := mux.NewRouter()

	// API routes
	api := router.PathPrefix("/api").Subrouter()

	// Public routes
	api.HandleFunc("/health", healthCheck).Methods("GET")
	api.HandleFunc("/debug/applications", debugApplicationsHandler).Methods("GET") // Temporary debug endpoint
	api.HandleFunc("/debug/campaigns", debugCampaignsHandler).Methods("GET")       // Temporary debug endpoint

	// Protected routes - general
	api.HandleFunc("/auth/profile", authMiddleware(profileHandler)).Methods("GET")
	api.HandleFunc("/profile", authMiddleware(createProfileHandler)).Methods("POST")

	// Protected routes - user type specific
	api.HandleFunc("/brand/dashboard", requireUserType("brand", brandOnlyHandler)).Methods("GET")
	api.HandleFunc("/influencer/dashboard", requireUserType("influencer", influencerOnlyHandler)).Methods("GET")

	// Campaign routes
	api.HandleFunc("/campaigns", authMiddleware(createCampaignHandler)).Methods("POST")
	api.HandleFunc("/campaigns", authMiddleware(getCampaignsHandler)).Methods("GET")
	api.HandleFunc("/campaigns/all", authMiddleware(getAllCampaignsHandler)).Methods("GET")
	api.HandleFunc("/campaigns/{campaignId}", authMiddleware(getCampaignHandler)).Methods("GET")
	api.HandleFunc("/campaigns/{campaignId}", authMiddleware(updateCampaignHandler)).Methods("PUT")
	api.HandleFunc("/campaigns/{campaignId}", authMiddleware(deleteCampaignHandler)).Methods("DELETE")
	api.HandleFunc("/campaigns/{campaignId}/applications", authMiddleware(getCampaignApplicationsHandler)).Methods("GET")

	// Application routes
	api.HandleFunc("/applications", authMiddleware(getApplicationsForBrandHandler)).Methods("GET")
	api.HandleFunc("/applications/creator", authMiddleware(getCreatorApplicationsHandler)).Methods("GET")
	api.HandleFunc("/campaigns/{campaignId}/apply", authMiddleware(applyCampaignHandler)).Methods("POST")
	api.HandleFunc("/applications/{applicationId}/status", authMiddleware(updateApplicationStatusHandler)).Methods("PUT")

	// Setup CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://frontend:3000", "http://172.18.0.2:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("%s backend server starting on port %s\n", GetAppName(), port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}

func healthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf(`{"status": "OK", "message": "%s"}`, GetAPIMessage())))
}

// Temporary debug handler to check applications in database
func debugApplicationsHandler(w http.ResponseWriter, r *http.Request) {
	collection := database.Collection("applications")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
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
	json.NewEncoder(w).Encode(map[string]interface{}{
		"count":        len(applications),
		"applications": applications,
	})
}

// Temporary debug handler to check campaigns in database
func debugCampaignsHandler(w http.ResponseWriter, r *http.Request) {
	collection := database.Collection("campaigns")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
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
	json.NewEncoder(w).Encode(map[string]interface{}{
		"count":     len(campaigns),
		"campaigns": campaigns,
	})
}
