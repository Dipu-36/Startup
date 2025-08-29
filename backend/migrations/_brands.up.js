db = db.getSiblingDB('sponsorconnect');

// Create brands collection
db.createCollection('brands');

// Create unique index on email
db.brands.createIndex({ "email": 1 }, { unique: true });

// Insert sample brand
db.brands.insertOne({
  _id: ObjectId(),
  name: "Sample Brand",
  email: "brand@example.com",
  companyName: "Sample Company Inc.",
  createdAt: new Date(),
  updatedAt: new Date()
});

print(" Brands collection created and sample inserted");

