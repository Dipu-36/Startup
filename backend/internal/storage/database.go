// Package storage defines the structure of the database entites and defines the realtionships between these entites
// - it also abstracts the Database by creating an interface over which the application interacts
// - the package uses the DB credentials from the env file and uses it for connection pooling and maintence

package storage

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// globalStore is a package level variable to hold reference to the MongoStore instance
// this variable has been made to avoid passing the Database instancew everywhere
var globalStore *MongoStore

// Storage interface provides an abstraction over MongoDB operations
type Storage interface {
	GetCollection(name string) *mongo.Collection
	Close() error
}

// MongoStore struct is to create an instance of the MongoDB connection and handle the DB lifecycle
type MongoStore struct {
	client   *mongo.Client
	database *mongo.Database
}

// InitiGlobalStore sets the globalStore variable
func InitGlobalStore(store *MongoStore) {
	globalStore = store
}

// NewMongoStore initializes a connection to MongoDB and returns a MongoStore instance
func NewMongoStore() (*MongoStore, error) {
	//Reads MONGODB_URI from environment vairable
	mongoURI := os.Getenv("MONGODB_URI")
	//Reads MONGODB_DATABASE from environment variable
	dbName := os.Getenv("MONGODB_DATABASE")

	//Ensure required env variable are set
	if mongoURI == "" || dbName == "" {
		log.Fatal("MONGODB_URI and MONGODB_DATABASE environment variables are required")
	}

	//Create a context with 10s timeout for connecting to MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	//Establish the client connection
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}

	// Test the connection to ensure MongoDB is reachable
	if err := client.Ping(ctx, nil); err != nil {
		log.Fatal("Failed to ping MongoDB:", err)
	}

	//Select database
	db := client.Database(dbName)
	log.Println("Connected to MongoDB successfully")

	return &MongoStore{
		client:   client,
		database: db,
	}, nil
}

// GetCollection returns a MongoDB collection by name and an error if globalSotre initialization has failed
func (m *MongoStore) GetCollection(name string) *mongo.Collection {
	if globalStore == nil {
		log.Fatal("Mongostore is not initialized")
	}
	return globalStore.database.Collection(name)
}

// Close gracefully disconnects MongoDB with a 5s timeout
func (m *MongoStore) Close() error {
	if m.client == nil {
		return nil
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	return m.client.Disconnect(ctx)
}
