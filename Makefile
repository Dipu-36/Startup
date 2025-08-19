# SponsorConnect - One Command Setup
# Just run: make up

# Main commands for Docker setup
.PHONY: up
up:
	@echo "Starting SponsorConnect with Docker..."
	@echo "Using MongoDB Atlas (cloud database)"
	@docker-compose up --build -d
	@echo "Application is starting up!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:8080"
	@echo "Health:   http://localhost:8080/api/health"

.PHONY: dev
dev:
	@echo "Starting SponsorConnect in Development Mode..."
	@echo "Using MongoDB Atlas with hot reload"
	@docker-compose -f docker-compose.dev.yaml up --build
	@echo "Development environment ready!"

.PHONY: down
down:
	@echo "Stopping SponsorConnect..."
	@docker-compose down
	@docker-compose -f docker-compose.dev.yaml down
	@echo "Application stopped!"

.PHONY: logs
logs:
	@docker-compose logs -f

.PHONY: restart
restart: down up

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
	@powershell -Command "try { Invoke-RestMethod http://localhost:8080/api/health | ConvertTo-Json } catch { Write-Host 'Backend not responding' }"
	@powershell -Command "try { Invoke-WebRequest http://localhost:3000 -UseBasicParsing | Out-Null; Write-Host 'Frontend is running' } catch { Write-Host 'Frontend not responding' }"

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
	@echo "📦 Installing dependencies..."
	@cd frontend && npm install
	@cd backend && go mod download
	@echo "Dependencies installed!"

# Help
.PHONY: help
help:
	@echo "SponsorConnect - Available Commands:"
	@echo ""
	@echo "  make up          - Start the application with Docker (RECOMMENDED)"
	@echo "  make dev         - Start in development mode with hot reload"
	@echo "  make down        - Stop the application"
	@echo "  make restart     - Restart the application"
	@echo "  make logs        - View application logs"
	@echo "  make status      - Show container status"
	@echo "  make health      - Check application health"
	@echo "  make clean       - Clean up Docker containers and images"
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
