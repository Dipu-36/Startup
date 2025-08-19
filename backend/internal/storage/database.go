package storage

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var globalStore *MongoStore

type Storage interface {
	GetCollection(name string) *mongo.Collection
	Close() error
}

type MongoStore struct {
	client   *mongo.Client
	database *mongo.Database
}

func InitGlobalStore(store *MongoStore) {
	globalStore = store
}

func NewMongoStore() (*MongoStore, error) {
	mongoURI := os.Getenv("MONGODB_URI")
	dbName := os.Getenv("MONGODB_DATABASE")

	if mongoURI == "" || dbName == "" {
		log.Fatal("MONGODB_URI and MONGODB_DATABASE environment variables are required")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}

	// Test the connection
	if err := client.Ping(ctx, nil); err != nil {
		log.Fatal("Failed to ping MongoDB:", err)
	}

	db := client.Database(dbName)
	log.Println("Connected to MongoDB successfully")

	return &MongoStore{
		client:   client,
		database: db,
	}, nil
}

// Implements Storage interface
func (m *MongoStore) GetCollection(name string) *mongo.Collection {
	if globalStore == nil {
		log.Fatal("Mongostore is not initialized")
	}
	return globalStore.database.Collection(name)
}

func (m *MongoStore) Close() error {
	if m.client == nil {
		return nil
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	return m.client.Disconnect(ctx)
}

// Package level helper function for handlers to call GetCollection
func GetCollection(name string) *mongo.Collection {
	if globalStore == nil {
		log.Fatal("Mongostore is not initialized")
	}
	return globalStore.database.Collection(name)
}
