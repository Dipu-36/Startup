package main

import (
<<<<<<< HEAD
	"context"
=======
>>>>>>> 642e7c2608befb16b23cb768f1f7ebd913ecad33
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/Dipu-36/startup/handlers"
	"github.com/Dipu-36/startup/internal/auth"
	"github.com/Dipu-36/startup/internal/storage"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/bson"
)

// APIServer represents the main HTTP server instance for the application
// It encapsulates server configuration routing and dependency management
// Feilds:
// - listenaddr: This is the port server listens to
// - store: the database sotrage interface for data persistence operations
// - router: the HTTP request router (gorilla/mux) for handling API endpoints
// - handlers: collection of HTTP handler functions for processing API rquests
type APIServer struct {
	listenaddr string
	store      storage.Storage
	router     *mux.Router
	handlers   *handlers.Handlers
}

// NewAPIServer is a constructor function initializes a new APIServer instance.
func NewAPIServer(port string, db storage.Storage, h *handlers.Handlers) *APIServer {
	server := &APIServer{
		listenaddr: port,
		store:      db,
		router:     mux.NewRouter(),
		handlers:   h,
	}
	server.routes()
	return server
}

<<<<<<< HEAD
	// Initialize Clerk
	if err := initializeClerk(); err != nil {
		log.Fatal("Failed to initialize Clerk:", err)
	}

	// Initialize MongoDB
	initMongoDB()
	defer closeMongoDB()
=======
// routes configures all the API endpoints and their corresponding handlers
// this method sets up the routing structure and applies middleware where needed
// NOTE => Protected routes are routes that use auth.AuthMiddleware for JWT validation
func (s *APIServer) routes() {
	api := s.router.PathPrefix("/api").Subrouter()
>>>>>>> 642e7c2608befb16b23cb768f1f7ebd913ecad33

	//Registers routes with our handler decorater
	api.HandleFunc("/health", healthCheck).Methods("GET")
<<<<<<< HEAD
	api.HandleFunc("/debug/applications", debugApplicationsHandler).Methods("GET") // Temporary debug endpoint
	api.HandleFunc("/debug/campaigns", debugCampaignsHandler).Methods("GET")       // Temporary debug endpoint

	// Protected routes - general
	api.HandleFunc("/auth/profile", authMiddleware(profileHandler)).Methods("GET")
	api.HandleFunc("/profile", authMiddleware(createProfileHandler)).Methods("POST")
=======
	api.HandleFunc("/auth/signup", s.handlers.SignupHandler).Methods("POST")
	api.HandleFunc("/auth/login", s.handlers.LoginRequest).Methods("POST")

	// Protected routes - general
	api.HandleFunc("/auth/profile", auth.AuthMiddleware(s.handlers.ProfileHandler)).Methods("GET")
>>>>>>> 642e7c2608befb16b23cb768f1f7ebd913ecad33

	// Protected routes - user type specific
	api.HandleFunc("/brand/dashboard", requireUserType("brand", brandOnlyHandler)).Methods("GET")
	api.HandleFunc("/influencer/dashboard", requireUserType("influencer", influencerOnlyHandler)).Methods("GET")

	// Campaign routes
<<<<<<< HEAD
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
=======
	api.HandleFunc("/campaigns", auth.AuthMiddleware(s.handlers.CreateCampaignHandler)).Methods("POST")
	api.HandleFunc("/campaigns", auth.AuthMiddleware(s.handlers.GetCampaignsHandler)).Methods("GET")
>>>>>>> 642e7c2608befb16b23cb768f1f7ebd913ecad33

	api.HandleFunc("/campaigns/all", auth.AuthMiddleware(s.handlers.GetAllCampaignsHandler)).Methods("GET")

}

// Run starts the HTTP server and begins listening for incoming requests
// this method :
// - configures CORS policies for cross origin requests
// - applies security middleware
// - bindss to specific port
// - handles graceful shitdown on termination signals
//
// CORS configuration:
// - allows request forrm localhost:3000
// - supports standard HTTP methods
// - permits all headers
// - allows credential inclusion (cookies etc)
func (s *APIServer) Run() {
	// Setup CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://frontend:3000", "http://172.18.0.2:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"}, // Allows all headers
		AllowCredentials: true,          //Required for httpONly
	})

	handler := c.Handler(s.router)

	fmt.Printf("%s backend server starting on port %s\n", auth.GetAppName(), s.listenaddr)
	log.Fatal(http.ListenAndServe(":"+s.listenaddr, handler))
}

func main() {
	//Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No env file found, using the environment variables")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	//Initilaizing the MongoDB
	store, err := storage.NewMongoStore()
	if err != nil {
		log.Fatal("Failed to initialize MongoDB: ", err)
	}
	defer store.Close()
	storage.InitGlobalStore(store)

	//Initilaizing the handlers
	h := handlers.NewHandler(store)

	//initialize and run the server
	server := NewAPIServer(port, store, h)
	server.Run()

}

// healthCheck handles server health monitoring requests.
// This endpoint is used for:
//   - Load balancer health checks
//   - Deployment verification
//   - System monitoring
//
// Response includes application name and status information.
func healthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf(`{"status": "OK", "message": "%s"}`, auth.GetAPIMessage())))
}

// WriteJSON writes JSON response with
//   - the given status codeit
//   - it sets the Content-Type as application-json Content-Type,
//   - encodes the provided values to v & returns an error if JSON encoding fails
func WriteJSON(w http.ResponseWriter, status int, v any) error {
	//sets the content type to
	w.Header().Set("Content-Type", "application/json")

	//sets the status code before writing the headers
	w.WriteHeader(status)

	//Encode the response body as JSON
	return json.NewEncoder(w).Encode(v)

}

// apiFunc defines the signature for the API handler functions that returns the errors
// This custom type allows handlers to return the errors that will be automatically converts to JSON error responses
type apiFunc func(http.ResponseWriter, *http.Request) error

// ApiError represents a standardized error response structure
// this ensures all API errors follow the same JSON format for client consistency.
type ApiError struct {
	Error string
}

func makeHTTPHandleFunc(f apiFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := f(w, r); err != nil {
			WriteJSON(w, http.StatusBadRequest, ApiError{Error: err.Error()})
		}
	}
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
