# Backend commands
.PHONY: build-backend
build-backend:
	@cd backend && go build -o ../bin/Startup

.PHONY: run-backend
run-backend:
	@./bin/Startup

.PHONY: test-backend
test-backend:
	@cd backend && go test -v ./...

# Frontend commands
.PHONY: install-frontend
install-frontend:
	@cd frontend && npm install

.PHONY: start-frontend
start-frontend:
	@cd frontend && npm start

.PHONY: build-frontend
build-frontend:
	@cd frontend && npm run build

# Combined commands
.PHONY: install
install: install-frontend

.PHONY: dev
dev:
	@echo "Starting development servers..."
	@echo "Frontend will start on http://localhost:3000"
	@cd frontend && npm start

.PHONY: build
build: build-backend build-frontend

# Help command
.PHONY: help
help:
	@echo "🚀 Content Creator Platform - Available Commands"
	@echo ""
	@echo "📦 Local Development:"
	@echo "  install            - Install frontend dependencies"
	@echo "  dev               - Start local development server"
	@echo "  build             - Build both backend and frontend"
	@echo "  build-backend     - Build Go backend only"
	@echo "  build-frontend    - Build React frontend only"
	@echo "  run-backend       - Run compiled backend"
	@echo "  test-backend      - Run backend tests"
	@echo "  test-frontend     - Run frontend tests"
	@echo "  test              - Run all tests"
	@echo "  test-watch        - Run tests in watch mode"
	@echo ""
	@echo "🐳 Docker Production:"
	@echo "  docker-up         - Start production environment"
	@echo "  docker-down       - Stop production environment"
	@echo "  docker-restart    - Restart production environment"
	@echo "  docker-logs       - View all service logs"
	@echo "  docker-build      - Rebuild all Docker images"
	@echo "  docker-clean      - Clean up Docker resources"
	@echo ""
	@echo "🛠️ Docker Development:"
	@echo "  docker-dev        - Start development with hot reload"
	@echo "  docker-dev-down   - Stop development environment"
	@echo "  docker-dev-logs   - View development logs"
	@echo "  docker-dev-restart- Restart development environment"
	@echo ""
	@echo "🔧 Docker Utilities:"
	@echo "  docker-status     - Show container status"
	@echo "  docker-reset      - Reset entire environment"
	@echo "  docker-backend-logs   - Backend logs only"
	@echo "  docker-frontend-logs  - Frontend logs only"
	@echo "  docker-mongo-logs     - MongoDB logs only"
	@echo "  docker-shell-backend  - Access backend container"
	@echo "  docker-shell-mongo    - Access MongoDB shell"
	@echo ""
	@echo "⚡ Quick Shortcuts:"
	@echo "  start             - Same as docker-dev"
	@echo "  stop              - Same as docker-dev-down"
	@echo "  restart           - Same as docker-dev-restart"
	@echo "  logs              - Same as docker-dev-logs"
	@echo "  clean             - Same as docker-clean"
	@echo "  reset             - Same as docker-reset"
	@echo "  status            - Show project status overview"
	@echo ""
	@echo "🔍 Utilities:"
	@echo "  env-check         - Check environment setup"
	@echo "  backup-db         - Create database backup"
	@echo ""
	@echo "💡 Quick Start:"
	@echo "  make start        - Best for development"
	@echo "  make docker-up    - Best for production"
	@echo "  make status       - Check everything is running"

# Docker Production Commands
.PHONY: docker-up
docker-up:
	@echo "🚀 Starting production environment..."
	docker-compose up -d --build

.PHONY: docker-down
docker-down:
	@echo "🛑 Stopping production environment..."
	docker-compose down

.PHONY: docker-logs
docker-logs:
	@echo "📋 Showing all service logs..."
	docker-compose logs -f

.PHONY: docker-restart
docker-restart:
	@echo "🔄 Restarting production environment..."
	docker-compose restart

.PHONY: docker-build
docker-build:
	@echo "🔨 Building all Docker images..."
	docker-compose build --no-cache

.PHONY: docker-clean
docker-clean:
	@echo "🧹 Cleaning up Docker resources..."
	docker-compose down -v --rmi all
	docker system prune -f

# Docker Development Commands
.PHONY: docker-dev
docker-dev:
	@echo "🛠️ Starting development environment with hot reload..."
	docker-compose -f docker-compose.dev.yaml up

.PHONY: docker-dev-down
docker-dev-down:
	@echo "🛑 Stopping development environment..."
	docker-compose -f docker-compose.dev.yaml down

.PHONY: docker-dev-logs
docker-dev-logs:
	@echo "📋 Showing development logs..."
	docker-compose -f docker-compose.dev.yaml logs -f

.PHONY: docker-dev-restart
docker-dev-restart:
	@echo "🔄 Restarting development environment..."
	docker-compose -f docker-compose.dev.yaml restart

# Docker Service Management
.PHONY: docker-backend-logs
docker-backend-logs:
	@echo "📋 Backend logs..."
	docker-compose logs -f backend

.PHONY: docker-frontend-logs
docker-frontend-logs:
	@echo "📋 Frontend logs..."
	docker-compose logs -f frontend

.PHONY: docker-mongo-logs
docker-mongo-logs:
	@echo "📋 MongoDB logs..."
	docker-compose logs -f mongo

.PHONY: docker-shell-backend
docker-shell-backend:
	@echo "🐚 Accessing backend container..."
	docker-compose exec backend sh

.PHONY: docker-shell-mongo
docker-shell-mongo:
	@echo "🐚 Accessing MongoDB shell..."
	docker-compose exec mongo mongosh startup_platform

# Docker Quick Commands
.PHONY: docker-status
docker-status:
	@echo "📊 Container status..."
	docker ps

.PHONY: docker-reset
docker-reset:
	@echo "🔄 Resetting entire Docker environment..."
	docker-compose down -v
	docker-compose up -d --build

# Testing Commands
.PHONY: test
test: test-backend test-frontend

.PHONY: test-frontend
test-frontend:
	@echo "🧪 Running frontend tests..."
	@cd frontend && npm test -- --watchAll=false

.PHONY: test-watch
test-watch:
	@echo "🧪 Running tests in watch mode..."
	@cd frontend && npm test

# Development Shortcuts
.PHONY: start
start: docker-dev

.PHONY: stop
stop: docker-dev-down

.PHONY: restart
restart: docker-dev-restart

.PHONY: logs
logs: docker-dev-logs

.PHONY: clean
clean: docker-clean

.PHONY: reset
reset: docker-reset

# Environment Management
.PHONY: env-check
env-check:
	@echo "🔍 Checking environment..."
	@echo "Docker version:"
	@docker --version
	@echo "Docker Compose version:"
	@docker-compose --version
	@echo "Node version (if installed locally):"
	@node --version 2>/dev/null || echo "Node not installed locally"
	@echo "Go version (if installed locally):"
	@go version 2>/dev/null || echo "Go not installed locally"

.PHONY: backup-db
backup-db:
	@echo "💾 Creating database backup..."
	@mkdir -p backups
	@docker-compose exec -T mongo mongodump --uri="${MONGO_URI}" --out=/tmp/backup
	@docker cp $$(docker-compose ps -q mongo):/tmp/backup ./backups/$$(date +%Y%m%d_%H%M%S)
	@echo "Backup created in ./backups/"

# Quick Status Check
.PHONY: status
status:
	@echo "📊 Project Status:"
	@echo "=================\n"
	@echo "Docker Containers:"
	@docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
	@echo "\nDocker Images:"
	@docker images | grep -E "(startup|mongo)" || echo "No project images found"
	@echo "\nDisk Usage:"
	@docker system df

