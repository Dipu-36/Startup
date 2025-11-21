# 🚀 SponsorConnect - One Command Setup
# Just run: make up

# Check for environment setup
.PHONY: check-env
check-env:
	@echo "🔍 Checking environment configuration..."
	@powershell -Command "if (-not (Test-Path 'frontend\.env')) { Write-Host 'Warning: frontend\.env not found. Using .env.example values.' -ForegroundColor Yellow; Write-Host 'Copy frontend\.env.example to frontend\.env and configure your Clerk keys for full functionality.' -ForegroundColor Yellow } else { Write-Host 'Environment file found' -ForegroundColor Green }"

# Build with Clerk configuration
.PHONY: build-with-clerk
build-with-clerk: check-env
	@echo "🏗️  Building with Clerk configuration..."
	@powershell -ExecutionPolicy Bypass -File build-with-clerk.ps1

# Main commands for Docker setup
.PHONY: up
up: check-env
	@echo "Starting SponsorConnect with Docker..."
	@echo "Using MongoDB Atlas (cloud database)"
	@docker-compose up --build -d
	@echo "Application is starting up!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:8080"
	@echo "Health:   http://localhost:8080/api/health"
	@echo "Clerk:    Make sure your Clerk keys are configured in frontend/.env"

.PHONY: dev
dev: check-env
	@echo "Starting SponsorConnect in Development Mode..."
	@echo "Using MongoDB Atlas with hot reload"
	@echo "Files will auto-reload when you make changes!"
	@echo "Clerk: Make sure your Clerk keys are configured in frontend/.env"
	@docker-compose -f docker-compose.dev.yaml up --build
	@echo "Development environment ready!"

.PHONY: dev-detached
dev-detached:
	@echo "Starting SponsorConnect in Development Mode (background)..."
	@echo "Using MongoDB Atlas with hot reload"
	@echo "Files will auto-reload when you make changes!"
	@docker-compose -f docker-compose.dev.yaml up --build -d
	@echo "Development environment ready!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:8080"
	@echo "Health:   http://localhost:8080/api/health"
	@echo "Use 'make dev-logs' to view logs"

.PHONY: down
down:
	@echo "Stopping SponsorConnect..."
	@docker-compose down
	@docker-compose -f docker-compose.dev.yaml down
	@echo "Application stopped!"

.PHONY: logs
logs:
	@docker-compose logs -f

.PHONY: dev-logs
dev-logs:
	@docker-compose -f docker-compose.dev.yaml logs -f

.PHONY: restart
restart: down up

.PHONY: dev-restart
dev-restart:
	@echo "Restarting development environment..."
	@docker-compose -f docker-compose.dev.yaml down
	@docker-compose -f docker-compose.dev.yaml up -d
	@echo "Development environment restarted!"

.PHONY: clean
clean:
	@echo "Cleaning up Docker containers and images..."
	@docker-compose down --volumes --remove-orphans
	@docker-compose -f docker-compose.dev.yaml down --volumes --remove-orphans
	@docker system prune -f
	@echo "Cleanup complete!"

.PHONY: status
status:
	@echo "SponsorConnect Status:"
	@docker-compose ps

# Health check
.PHONY: health
health:
	@echo "Health Check:"
	@powershell -Command "try { Invoke-RestMethod http://localhost:8080/api/health | ConvertTo-Json } catch { Write-Host '❌ Backend not responding' }"
	@powershell -Command "try { Invoke-WebRequest http://localhost:3000 -UseBasicParsing | Out-Null; Write-Host '✅ Frontend is running' } catch { Write-Host '❌ Frontend not responding' }"

# Local development commands (without Docker)
.PHONY: run-backend-local
run-backend-local:
	@echo "🔧 Starting backend locally..."
	@cd backend && go run .

.PHONY: run-frontend-local  
run-frontend-local:
	@echo "🔧 Starting frontend locally..."
	@cd frontend && npm start

.PHONY: install-deps
install-deps:
	@echo "Installing dependencies..."
	@cd frontend && npm install
	@cd backend && go mod download
	@echo "Dependencies installed!"

# Help
.PHONY: help
help:
	@echo "SponsorConnect - Available Commands:"
	@echo ""
	@echo "  DEVELOPMENT (with hot reload):"
	@echo "  make dev              - Start in development mode (logs visible)"
	@echo "  make dev-detached     - Start in development mode (background)"
	@echo "  make dev-logs         - View development logs"
	@echo "  make dev-restart      - Restart development environment"
	@echo ""
	@echo "  CLERK SETUP:"
	@echo "  make check-env        - Check environment configuration"
	@echo "  make build-with-clerk - Build with Clerk configuration"
	@echo ""
	@echo "  PRODUCTION:"
	@echo "  make up               - Start the application with Docker"
	@echo "  make down             - Stop the application"
	@echo "  make restart          - Restart the application"
	@echo "  make logs             - View application logs"
	@echo ""
	@echo "  UTILITIES:"
	@echo "  make status           - Show container status"
	@echo "  make health           - Check application health"
	@echo "  make clean            - Clean up Docker containers and images"
	@echo ""
	@echo "  Local Development (without Docker):"
	@echo "  make install-deps     - Install dependencies"
	@echo "  make run-backend-local    - Run backend locally"
	@echo "  make run-frontend-local   - Run frontend locally"
	@echo ""
	@echo "After running 'make up':"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:8080"
	@echo "  Health:   http://localhost:8080/api/health"

# Default target
.DEFAULT_GOAL := help
