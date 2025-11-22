package storage

import (
    "context"
    "time"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"

    "yourmodule/pkg/models"
)

const snapshotColl = "creator_snapshots"

// EnsureSnapshotIndexes creates indexes for quick queries and retention/TTL if you want.
func EnsureSnapshotIndexes(ctx context.Context, db *mongo.Database) error {
    coll := db.Collection(snapshotColl)
    idxes := []mongo.IndexModel{
        {
            Keys: bson.D{{Key: "platform", Value: 1}, {Key: "platform_id", Value: 1}, {Key: "snapshot_at", Value: -1}},
            Options: options.Index().SetName("platform_platformid_snapshotat"),
        },
        {
            Keys: bson.D{{Key: "creator_user_id", Value: 1}},
            Options: options.Index().SetName("creator_user_idx"),
        },
        // Optional TTL: delete snapshots older than retention days (e.g., 365 days)
        // { Keys: bson.D{{Key: "created_at", Value: 1}}, Options: options.Index().SetExpireAfterSeconds(3600*24*365) },
    }
    _, err := coll.Indexes().CreateMany(ctx, idxes)
    return err
}

// SaveSnapshot inserts a snapshot (or upserts if you prefer). Typically insert to keep history.
func SaveSnapshot(ctx context.Context, db *mongo.Database, s *models.CreatorSnapshot) error {
    coll := db.Collection(snapshotColl)
    now := time.Now().UTC()
    if s.CreatedAt.IsZero() {
        s.CreatedAt = now
    }
    s.UpdatedAt = now
    _, err := coll.InsertOne(ctx, s)
    return err
}

// LatestSnapshotForPlatformID fetches the most recent snapshot for a platform-specific creator ID
func LatestSnapshotForPlatformID(ctx context.Context, db *mongo.Database, platform, platformID string) (*models.CreatorSnapshot, error) {
    coll := db.Collection(snapshotColl)
    filter := bson.M{"platform": platform, "platform_id": platformID}
    opts := options.FindOne().SetSort(bson.D{{Key: "snapshot_at", Value: -1}})
    var res models.CreatorSnapshot
    err := coll.FindOne(ctx, filter, opts).Decode(&res)
    if err == mongo.ErrNoDocuments {
        return nil, nil
    }
    return &res, err
}

