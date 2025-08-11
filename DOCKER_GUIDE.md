# Docker Commands Cheat Sheet

## 🌐 MongoDB Atlas Integration

This Docker setup is configured to use **MongoDB Atlas** (cloud database) instead of a local MongoDB instance. All data will be stored in the cloud and persist across container restarts.

### Configuration
- **Database**: MongoDB Atlas (soujatya.gjxsm.mongodb.net)
- **Environment**: Configured in `.env.docker`
- **Data Persistence**: Automatic in Atlas cloud

## Quick Start Commands

### Production Environment
```bash
# Start all services in production mode (uses MongoDB Atlas)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services (data remains in Atlas)
docker-compose down

# Restart a specific service
docker-compose restart backend
```

### Development Environment
```bash
# Start development environment with hot reload (uses MongoDB Atlas)
docker-compose -f docker-compose.dev.yaml up

# Run in background
docker-compose -f docker-compose.dev.yaml up -d

# Stop development environment (data remains in Atlas)
docker-compose -f docker-compose.dev.yaml down
```

## Service Management

### View Running Containers
```bash
docker ps
```

### Access Service Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongo

# Follow logs in real-time
docker-compose logs -f backend
```

### Execute Commands in Containers
```bash
# Access backend container shell
docker-compose exec backend sh

# Access MongoDB shell
docker-compose exec mongo mongosh

# Run Go commands in backend
docker-compose exec backend go mod tidy
```

## Database Management

### MongoDB Operations
```bash
# Access MongoDB shell
docker-compose exec mongo mongosh startup_platform

# Backup database
docker-compose exec mongo mongodump --db startup_platform --out /data/backup

# Restore database
docker-compose exec mongo mongorestore /data/backup
```

### Reset Database
```bash
# Remove MongoDB volume (deletes all data)
docker-compose down -v
docker volume rm startup_mongo_data
```

## Troubleshooting

### Common Issues

1. **Port already in use**:
```bash
# Check what's using the port
netstat -tulpn | grep :3000
# Kill the process or change port in docker-compose.yaml
```

2. **Permission issues (Linux/Mac)**:
```bash
sudo docker-compose up
```

3. **Container won't start**:
```bash
# Check container logs
docker-compose logs [service-name]

# Rebuild containers
docker-compose build --no-cache
docker-compose up
```

4. **Hot reload not working**:
```bash
# Restart development environment
docker-compose -f docker-compose.dev.yaml restart frontend
```

### Clean Up
```bash
# Remove all containers and images
docker-compose down --rmi all

# Remove all volumes (deletes data)
docker-compose down -v

# Clean up Docker system
docker system prune -a
```

## Build and Deploy

### Manual Build
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend

# Build with no cache
docker-compose build --no-cache
```

### Environment Variables
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://mongo:27017/startup_platform
BACKEND_PORT=8080
FRONTEND_PORT=3000
NODE_ENV=production
```

## Useful URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- MongoDB: localhost:27017
