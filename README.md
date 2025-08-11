# 🚀 SponsorConnect - One Command Setup

**An influencer marketing platform built with Go and React**

## ⚡ Quick Start (Recommended)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Startup
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   ```

3. **Configure MongoDB Atlas**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/) and create a free cluster
   - Create a database user and whitelist your IP (or use `0.0.0.0/0` for development)
   - Copy your connection string and update `MONGODB_URI` in `.env`
   - Generate a secure JWT secret and update `JWT_SECRET` in `.env`

4. **Start the application**
   ```bash
   make up
   ```

That's it! 🎉

## 🌐 Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/api/health

## 🛠️ Available Commands

```bash
make up          # Start the application (RECOMMENDED)
make dev         # Start in development mode with hot reload
make down        # Stop the application
make restart     # Restart the application
make logs        # View application logs
make status      # Show container status
make health      # Check application health
make clean       # Clean up Docker containers and images
make help        # Show all available commands
```

## 🏗️ Architecture

- **Backend**: Go with Gin framework, JWT authentication, MongoDB Atlas
- **Frontend**: React with TypeScript, responsive design
- **Database**: MongoDB Atlas (cloud database)
- **Deployment**: Docker containers with docker-compose
## 📋 Features

- ✅ User authentication (signup/login)
- ✅ Campaign creation and management
- ✅ Real-time campaign preview
- ✅ Responsive brand dashboard
- ✅ MongoDB Atlas integration
- ✅ JWT-based security
- ✅ Docker containerization
- ✅ One-command deployment

## 🔧 Development

### Prerequisites
- Docker and Docker Compose
- MongoDB Atlas account (free tier available)

### Environment Variables

Key environment variables in `.env`:

```env
APP_NAME=SponsorConnect
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sponsorconnect
JWT_SECRET=your-super-secure-jwt-secret
PORT=8080
FRONTEND_URL=http://localhost:3000
```

### API Endpoints

#### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User login

#### Campaigns
- `GET /api/campaigns` - Get all campaigns (authenticated)
- `POST /api/campaigns` - Create new campaign (authenticated)

#### Health
- `GET /api/health` - Health check endpoint

### Local Development (without Docker)

If you prefer to run without Docker:

```bash
# Install dependencies
make install-deps

# Run backend (in one terminal)
make run-backend-local

# Run frontend (in another terminal)  
make run-frontend-local
```

## 🐳 Docker Configuration

The application uses two docker-compose configurations:
- `docker-compose.yaml` - Production mode
- `docker-compose.dev.yaml` - Development mode with hot reload

Both configurations use MongoDB Atlas (no local database required).

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Environment-based configuration
- Secure MongoDB Atlas connection

## 📦 Project Structure

```
Startup/
├── backend/           # Go backend API
├── frontend/          # React TypeScript frontend
├── docker-compose.yaml
├── docker-compose.dev.yaml
├── Makefile          # One-command setup
├── .env.example      # Environment template
└── README.md
```

## 🚀 Deployment

For production deployment:

1. Update `.env` with production values
2. Set `APP_ENV=production`
3. Use a secure `JWT_SECRET`
4. Configure proper CORS origins
5. Run `make up`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `make up`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Made with ❤️ for the influencer marketing community**

Need help? Check `make help` for all available commands!
- Animated background elements
- Responsive design
- Modern gradient color scheme with CSS variables
- Organized CSS structure with separate files for each component


