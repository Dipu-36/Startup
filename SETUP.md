# 🚀 SETUP.md - Complete Setup Guide

## Prerequisites

- **Docker Desktop**: [Download here](https://www.docker.com/products/docker-desktop/)
- **Git**: [Download here](https://git-scm.com/downloads)
- **MongoDB Atlas Account**: [Create free account](https://cloud.mongodb.com/)

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Startup
```

### 2. Set Up Environment Variables

```bash
# Copy the environment template
cp .env.example .env
```

### 3. Configure MongoDB Atlas

#### Create MongoDB Atlas Cluster (Free Tier)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign up or log in
3. Click "Create a New Cluster"
4. Choose "Shared" (free tier)
5. Select a cloud provider and region
6. Click "Create Cluster"

#### Set Up Database Access

1. In Atlas dashboard, go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and password (save these!)
5. Set permissions to "Atlas admin" for development
6. Click "Add User"

#### Configure Network Access

1. Go to "Network Access"
2. Click "Add IP Address"
3. For development, click "Allow Access from Anywhere" (`0.0.0.0/0`)
4. For production, add your specific IP addresses
5. Click "Confirm"

#### Get Connection String

1. Go to "Databases" 
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `sponsorconnect`

Example connection string:
```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/sponsorconnect?retryWrites=true&w=majority
```

### 4. Update Environment File

Edit `.env` file with your values:

```env
# App Configuration
APP_NAME=SponsorConnect
APP_ENV=development

# MongoDB Atlas (UPDATE THIS!)
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/sponsorconnect?retryWrites=true&w=majority

# JWT Secret (GENERATE A SECURE ONE!)
JWT_SECRET=your-super-secure-random-secret-key-change-this

# Server Configuration
PORT=8080
FRONTEND_URL=http://localhost:3000
DEBUG=true
LOG_LEVEL=info
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Docker Ports
BACKEND_PORT=8080
FRONTEND_PORT=3000
```

#### Generate JWT Secret

Generate a secure JWT secret:

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

**On macOS/Linux:**
```bash
openssl rand -base64 32
```

**Online Generator:**
Visit [AllKeyGenerator.com](https://allkeygenerator.com/Random/Security-Encryption-Key-Generator.aspx)

### 5. Start the Application

```bash
make up
```

Wait for the containers to build and start. You should see:
```
✅ Application is starting up!
🌐 Frontend: http://localhost:3000
🔌 Backend:  http://localhost:8080
📱 Health:   http://localhost:8080/api/health
```

### 6. Verify Setup

Open your browser and check:

1. **Frontend**: http://localhost:3000
   - Should show the SponsorConnect landing page
   
2. **Backend Health**: http://localhost:8080/api/health
   - Should return: `{"status":"OK","message":"SponsorConnect API is running","timestamp":"..."}`

3. **Backend API**: http://localhost:8080/api/
   - Should return: `{"message":"Welcome to SponsorConnect API"}`

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed

**Error**: `Failed to connect to MongoDB`

**Solutions**:
- Verify your MongoDB Atlas connection string in `.env`
- Check if your IP is whitelisted in Atlas Network Access
- Ensure database user credentials are correct
- Try using `0.0.0.0/0` for Network Access (development only)

#### 2. Port Already in Use

**Error**: `Port 3000 (or 8080) is already in use`

**Solutions**:
```bash
# Stop the application first
make down

# Check what's using the port
netstat -ano | findstr :3000   # Windows
lsof -i :3000                  # macOS/Linux

# Change ports in .env if needed
FRONTEND_PORT=3001
BACKEND_PORT=8081
```

#### 3. Docker Build Failed

**Error**: Docker build issues

**Solutions**:
```bash
# Clean up Docker
make clean

# Restart Docker Desktop
# Then try again
make up
```

#### 4. Environment Variables Not Loading

**Solutions**:
- Ensure `.env` file exists in the root directory
- Check `.env` file format (no spaces around `=`)
- Restart the application: `make restart`

### Reset Everything

If something goes wrong, reset completely:

```bash
# Stop everything
make down

# Clean up Docker
make clean

# Remove .env and start over
rm .env
cp .env.example .env
# Edit .env with your settings

# Try again
make up
```

### Development vs Production

#### Development Mode
```bash
make dev   # Starts with hot reload
```

#### Production Mode
```bash
make up    # Optimized build
```

## Next Steps

Once setup is complete:

1. **Create an Account**: Go to http://localhost:3000 and click "Get Started"
2. **Create Campaigns**: Log in and start creating marketing campaigns
3. **Explore API**: Check out the API at http://localhost:8080/api/

## Need Help?

- Check `make help` for all available commands
- Review the main [README.md](README.md) for feature overview
- Check Docker Desktop for container logs
- Verify MongoDB Atlas dashboard for connection issues

## Quick Commands Reference

```bash
make up          # Start everything
make down        # Stop everything  
make dev         # Development mode
make logs        # View logs
make restart     # Restart
make health      # Health check
make clean       # Clean up Docker
make help        # Show all commands
```

---

**🎉 Congratulations!** Your SponsorConnect platform should now be running!

Visit http://localhost:3000 to get started.
