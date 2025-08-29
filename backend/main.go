package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Initialize MongoDB
	initMongoDB()
	defer closeMongoDB()

	router := mux.NewRouter()

	// API routes
	api := router.PathPrefix("/api").Subrouter()

	// Public routes
	api.HandleFunc("/health", healthCheck).Methods("GET")
	api.HandleFunc("/auth/signup", signupHandler).Methods("POST")
	api.HandleFunc("/auth/login", loginHandler).Methods("POST")

	// Protected routes - general
	api.HandleFunc("/auth/profile", authMiddleware(profileHandler)).Methods("GET")

	// Protected routes - user type specific
	api.HandleFunc("/brand/dashboard", requireUserType("brand", brandOnlyHandler)).Methods("GET")
	api.HandleFunc("/influencer/dashboard", requireUserType("influencer", influencerOnlyHandler)).Methods("GET")

	// Campaign routes
	api.HandleFunc("/campaigns", authMiddleware(createCampaignHandler)).Methods("POST")
	api.HandleFunc("/campaigns", authMiddleware(getCampaignsHandler)).Methods("GET")
	api.HandleFunc("/campaigns/all", authMiddleware(getAllCampaignsHandler)).Methods("GET")
	api.HandleFunc("/campaigns/{campaignId}", authMiddleware(getCampaignHandler)).Methods("GET")
	api.HandleFunc("/campaigns/{campaignId}/applications", authMiddleware(getCampaignApplicationsHandler)).Methods("GET")

	// Application routes
	api.HandleFunc("/applications", authMiddleware(getApplicationsForBrandHandler)).Methods("GET")
	api.HandleFunc("/applications/creator", authMiddleware(getApplicationsForCreatorHandler)).Methods("GET")
	api.HandleFunc("/applications", authMiddleware(createApplicationHandler)).Methods("POST")
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
