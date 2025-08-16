package storage

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// client is a global variable from storage package of type mongo.Client
var client *mongo.Client

// datbase is a global variabel from the storage package of type mongo.Database
var database *mongo.Database

// GetCollectionName is agetter function for getting the collection
func GetCollection(name string) *mongo.Collection {
	return database.Collection(name)
}

type Storage interface {
	GetCollection(name string) *mongo.Collection
	Close() error
}

type MongoStore struct {
	client   *mongo.Client
	database *mongo.Database
}

func NewMongoStore() (*MongoStore, error) {
	mongoURI := os.Getenv("MONGODB_URI")
	dbName := os.Getenv("MONGODB_DATABASE")

	if mongoURI == "" || dbName == "" {
		log.Fatal("MONGODB_URI and MONGODB_DATABASE environment variables are required")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var err error
	client, err = mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}

	// Test the connection
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Failed to ping MongoDB:", err)
	}

	db := client.Database(dbName)
	log.Println("Connected to MongoDB successfully")

	return &MongoStore{
		client:   client,
		database: db,
	}, nil
}

// closeMongoDB is a function to close the MongoDB connection
func (m *MongoStore) CloseMongoDB() error {
	if m.client == nil {
		return nil
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	return m.client.Disconnect(ctx)
}
