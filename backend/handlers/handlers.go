package handlers

import "github.com/Dipu-36/startup/internal/storage"

// Using dependecy injection
type Handlers struct {
	store *storage.MongoStore
}

func NewHandler(store *storage.MongoStore) *Handlers {
	return &Handlers{store: store}
}
