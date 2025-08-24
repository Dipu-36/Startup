// package handlers contains all HTTP request handlers for the application's API routes
// These handlers process requests interact with data storage layer and return appropiate HTTP response.

package handlers

import "github.com/Dipu-36/startup/internal/storage"

// Handlers struct serves as a centralized container for all the API endpoint handlers
// - it follows dependency injection to provide the handlers with access to the storgae layer eleimanting tight coupling
// Responisibilites
// - Provides structured way to organize HTTP handlers
// - Maintains shared dependecies across all handlers ( DB connection)
// - Consistent access to sotrage layer
type Handlers struct {
	//Store provides the DB connection and data access methods
	//handlers use ths to interact with MongoDB database
	Store *storage.MongoStore
}

// NewHandler is a constructor function that creates and returns a new handlers instance
// - it follows the dependecy injection to initialize handlers with required depedencies
func NewHandler(store *storage.MongoStore) *Handlers {
	return &Handlers{Store: store}
}
