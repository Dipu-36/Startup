package handlers

import "github.com/Dipu-36/startup/internal/storage"

// Using dependecy injection
type Handlers struct {
	Store *storage.MongoStore
}

func NewHandler(store *storage.MongoStore) *Handlers {
	return &Handlers{Store: store}
}
