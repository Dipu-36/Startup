# 🐳 Docker + MongoDB Atlas Setup Guide

This project is configured to use **MongoDB Atlas** (cloud database) when running in Docker. All data will be stored in the cloud and persist automatically.

## 🚀 Quick Start

### 1. Prerequisites
- Docker and Docker Compose installed
- MongoDB Atlas account (already configured)

### 2. Start the Application
```bash
# Production mode
docker-compose up -d

# Development mode (with hot reload)
docker-compose -f docker-compose.dev.yaml up -d
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: MongoDB Atlas (automatic)

## 📋 What's Included

### Services
- ✅ **Backend API**: Go server with MongoDB Atlas connection
- ✅ **Frontend**: React application 
- ❌ **Local MongoDB**: Removed (using Atlas instead)

### Key Changes Made
1. **Removed local MongoDB container** - No more local database
2. **Atlas integration** - All data goes to cloud database  
3. **Environment configuration** - Uses `.env.docker` for Atlas connection
4. **Simplified setup** - Fewer containers, faster startup

## 🔧 Configuration Files

### `.env.docker` (Atlas Configuration)
```env
MONGODB_URI=mongodb+srv://admin:H9skGpb6jYa%2AMb%24@soujatya.gjxsm.mongodb.net/sponsorconnect?retryWrites=true&w=majority
MONGODB_DATABASE=sponsorconnect
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=8080
CORS_ORIGIN=http://localhost:3000
REACT_APP_API_URL=http://localhost:8080/api
```

### Updated Docker Compose Structure
```yaml
# Production: docker-compose.yaml
services:
  backend:    # Connected to Atlas
  frontend:   # Serves React app
  # No local database needed!

# Development: docker-compose.dev.yaml  
services:
  backend-dev:  # With hot reload + Atlas
  frontend-dev: # With hot reload
  # No local database needed!
```

## 🌟 Benefits

### 1. **Persistent Data**
- ✅ Data survives container restarts
- ✅ Data survives system reboots
- ✅ Data accessible from anywhere

### 2. **Simplified Setup**
- ✅ No local MongoDB setup required
- ✅ Faster container startup (no DB container)
- ✅ Less disk space usage

### 3. **Production Ready**
- ✅ Same database in dev and production
- ✅ Automatic backups (Atlas feature)
- ✅ Cloud scalability

## 🔍 Troubleshooting

### Backend Connection Issues
```bash
# Check backend logs
docker-compose logs backend

# Should see: "Connected to MongoDB successfully"
```

### Frontend API Issues  
```bash
# Check if backend is running
curl http://localhost:8080/api/health

# Should return: {"status": "OK", "message": "SponsorConnect API is running"}
```

### Data Not Persisting
- ✅ **Atlas handles this automatically**
- ✅ Check MongoDB Atlas dashboard for data
- ✅ Data persists even if containers are destroyed

## 📊 Monitoring

### Check Atlas Dashboard
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Login with project credentials
3. View database activity and stored data

### Local Monitoring
```bash
# View all container status
docker-compose ps

# View backend logs
docker-compose logs -f backend

# View frontend logs  
docker-compose logs -f frontend
```

## 🎯 Next Steps

1. **Start Development**: `docker-compose -f docker-compose.dev.yaml up -d`
2. **Create Campaigns**: Use the web interface to create campaigns
3. **Verify Data**: Check MongoDB Atlas dashboard to see stored data
4. **Deploy**: Use `docker-compose up -d` for production

Your data will now be safely stored in MongoDB Atlas! 🚀
