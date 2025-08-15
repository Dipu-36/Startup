#!/bin/bash

# SponsorConnect Setup Validation Script
# This script validates that your setup is ready for one-command deployment

echo "SponsorConnect Setup Validation"
echo "=================================="
echo ""

# Check if .env file exists
echo "Checking environment configuration..."
if [ ! -f ".env" ]; then
    echo " .env file not found!"
    echo "   Run: cp .env.example .env"
    echo "   Then edit .env with your MongoDB Atlas credentials"
    exit 1
else
    echo ".env file found"
fi

# Check if Docker is available
echo ""
echo "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "Docker not found!"
    echo "Please install Docker Desktop"
    exit 1
else
    echo "Docker found: $(docker --version)"
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose not found!"
    echo "   Please install Docker Compose"
    exit 1
else
    echo "Docker Compose found: $(docker-compose --version)"
fi

# Validate docker-compose configuration
echo ""
echo "Validating Docker Compose configuration..."
if docker-compose config > /dev/null 2>&1; then
    echo "docker-compose.yaml is valid"
else
    echo "docker-compose.yaml has errors"
    echo "Check your docker-compose.yaml file"
    exit 1
fi

# Check if Make is available
echo ""
echo "Checking Make installation..."
if ! command -v make &> /dev/null; then
    echo "Make not found!"
    echo "Please install Make or run Docker commands directly"
    echo "Alternative: docker-compose up --build -d"
else
    echo "Make found: $(make --version | head -1)"
fi

# Check essential files
echo ""
echo "Checking essential files..."
essential_files=(
    "docker-compose.yaml"
    "docker-compose.dev.yaml"
    "backend/Dockerfile"
    "frontend/Dockerfile"
    "backend/main.go"
    "frontend/package.json"
)

for file in "${essential_files[@]}"; do
    if [ -f "$file" ]; then
        echo "$file"
    else
        echo "$file missing"
        exit 1
    fi
done

# Check .env configuration
echo ""
echo "Checking .env configuration..."
if grep -q "mongodb+srv://" .env; then
    echo "MongoDB Atlas URI found in .env"
else
    echo "MongoDB Atlas URI not configured in .env"
    echo "Please update MONGODB_URI in .env file"
fi

if grep -q "JWT_SECRET=your-super-secure" .env; then
    echo "Default JWT_SECRET detected"
    echo "Please update JWT_SECRET in .env file"
else
    echo "JWT_SECRET appears to be customized"
fi

echo ""
echo "Setup Validation Complete!"
echo ""
echo "Ready to start? Run:"
echo "make up"
echo ""
echo "Then visit:"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8080"
echo "Health:   http://localhost:8080/api/health"
echo ""
echo "Need help? Run: make help"
