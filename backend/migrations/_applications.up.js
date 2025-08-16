db = db.getSiblingDB('sponsorconnect');

// Create applications collection
db.createCollection('applications');

// Index on campaignId and creatorId for queries
db.applications.createIndex({ "campaignId": 1 });
db.applications.createIndex({ "creatorId": 1 });

print(" Applications collection created");

