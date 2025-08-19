package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/Dipu-36/startup/handlers"
	"github.com/Dipu-36/startup/internal/auth"
	"github.com/Dipu-36/startup/internal/storage"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

type APIServer struct {
	listenaddr string
	store      storage.Storage
	router     *mux.Router
	handlers   *handlers.Handlers
}

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

func (s *APIServer) routes() {
	api := s.router.PathPrefix("/api").Subrouter()

	//Registers routes with our handler decorater
	api.HandleFunc("/health", healthCheck).Methods("GET")
	api.HandleFunc("/auth/signup", s.handlers.SignupHandler).Methods("POST")
	api.HandleFunc("/auth/login", s.handlers.LoginRequest).Methods("POST")

	// Protected routes - general
	api.HandleFunc("/auth/profile", auth.AuthMiddleware(s.handlers.ProfileHandler)).Methods("GET")

	// Protected routes - user type specific
	api.HandleFunc("/brand/dashboard", requireUserType("brand", brandOnlyHandler)).Methods("GET")
	api.HandleFunc("/influencer/dashboard", requireUserType("influencer", influencerOnlyHandler)).Methods("GET")

	// Campaign routes
	api.HandleFunc("/campaigns", auth.AuthMiddleware(s.handlers.CreateCampaignHandler)).Methods("POST")
	api.HandleFunc("/campaigns", auth.AuthMiddleware(s.handlers.GetCampaignsHandler)).Methods("GET")

	api.HandleFunc("/campaigns/all", auth.AuthMiddleware(s.handlers.GetAllCampaignsHandler)).Methods("GET")

}

// Public routes
func (s *APIServer) Run() {
	// Setup CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
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
func healthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf(`{"status": "OK", "message": "%s"}`, auth.GetAPIMessage())))
}

// WriteJSON writes JSON response with the given status code, it sets the Content-Type as application-json Content-Type, encodes the provided values to v & returns an error if JSON encoding fails
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
