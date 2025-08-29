db = db.getSiblingDB('sponsorconnect');

// Drop campaigns collection
db.campaigns.drop();

print(" Campaigns collection dropped");

