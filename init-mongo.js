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

// Insert sample applications
db.applications.insertMany([
  {
    _id: ObjectId(),
    campaignId: ObjectId("66c0123456789abcdef12345"),
    creatorId: ObjectId("66c0123456789abcdef54321"),
    creatorName: "Sarah Johnson",
    creatorEmail: "sarah@example.com",
    followers: "50K",
    platform: "Instagram",
    status: "pending",
    appliedDate: new Date("2025-08-10"),
    campaignName: "Summer Fashion Campaign",
    createdAt: new Date("2025-08-10"),
    updatedAt: new Date("2025-08-10")
  },
  {
    _id: ObjectId(),
    campaignId: ObjectId("66c0123456789abcdef12346"),
    creatorId: ObjectId("66c0123456789abcdef54322"),
    creatorName: "Mike Chen",
    creatorEmail: "mike@example.com",
    followers: "75K",
    platform: "TikTok",
    status: "pending",
    appliedDate: new Date("2025-08-09"),
    campaignName: "Tech Product Launch",
    createdAt: new Date("2025-08-09"),
    updatedAt: new Date("2025-08-09")
  },
  {
    _id: ObjectId(),
    campaignId: ObjectId("66c0123456789abcdef12347"),
    creatorId: ObjectId("66c0123456789abcdef54323"),
    creatorName: "Emma Rodriguez",
    creatorEmail: "emma@example.com",
    followers: "120K",
    platform: "YouTube",
    status: "approved",
    appliedDate: new Date("2025-08-08"),
    campaignName: "Fitness Equipment Promo",
    createdAt: new Date("2025-08-08"),
    updatedAt: new Date("2025-08-08")
  },
  {
    _id: ObjectId(),
    campaignId: ObjectId("66c0123456789abcdef12348"),
    creatorId: ObjectId("66c0123456789abcdef54324"),
    creatorName: "Alex Kim",
    creatorEmail: "alex@example.com",
    followers: "85K",
    platform: "Instagram",
    status: "rejected",
    appliedDate: new Date("2025-08-07"),
    campaignName: "Beauty Brand Collaboration",
    createdAt: new Date("2025-08-07"),
    updatedAt: new Date("2025-08-07")
  },
  {
    _id: ObjectId(),
    campaignId: ObjectId("66c0123456789abcdef12349"),
    creatorId: ObjectId("66c0123456789abcdef54325"),
    creatorName: "Jessica Brown",
    creatorEmail: "jessica@example.com",
    followers: "95K",
    platform: "TikTok",
    status: "pending",
    appliedDate: new Date("2025-08-06"),
    campaignName: "Food & Beverage Campaign",
    createdAt: new Date("2025-08-06"),
    updatedAt: new Date("2025-08-06")
  }
]);

print("Database initialized successfully!");
