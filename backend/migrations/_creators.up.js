db = db.getSiblingDB('sponsorconnect');

// Create creators collection
db.createCollection('creators');

// Create unique index on email
db.creators.createIndex({ "email": 1 }, { unique: true });

print(" Creators collection created");

