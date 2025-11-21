db = db.getSiblingDB('sponsorconnect');

// Create campaigns collection
db.createCollection('campaigns');

// Index on brandId for faster queries
db.campaigns.createIndex({ "brandId": 1 });

print(" Campaigns collection created");

