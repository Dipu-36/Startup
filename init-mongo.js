// MongoDB initialization script
db = db.getSiblingDB('sponsorconnect');

// Create collections
db.createCollection('brands');
db.createCollection('creators');
db.createCollection('campaigns');
db.createCollection('applications');

// Create indexes
db.brands.createIndex({ "email": 1 }, { unique: true });
db.creators.createIndex({ "email": 1 }, { unique: true });
db.campaigns.createIndex({ "brandId": 1 });
db.applications.createIndex({ "campaignId": 1 });
db.applications.createIndex({ "creatorId": 1 });

// Insert sample data
db.brands.insertOne({
  _id: ObjectId(),
  name: "Sample Brand",
  email: "brand@example.com",
  companyName: "Sample Company Inc.",
  createdAt: new Date(),
  updatedAt: new Date()
});

print("Database initialized successfully!");
