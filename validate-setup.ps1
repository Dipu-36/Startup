# SponsorConnect Setup Validation Script (PowerShell)
# This script validates that your setup is ready for one-command deployment

Write-Host "SponsorConnect Setup Validation" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""

$hasErrors = $false

# Check if .env file exists
Write-Host "Checking environment configuration..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "   Run: cp .env.example .env" -ForegroundColor White
    Write-Host "   Then edit .env with your MongoDB Atlas credentials" -ForegroundColor White
    $hasErrors = $true
} else {
    Write-Host "SUCCESS: .env file found" -ForegroundColor Green
}

# Check if Docker is available
Write-Host ""
Write-Host "Checking Docker installation..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "SUCCESS: Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Docker not found!" -ForegroundColor Red
    Write-Host "   Please install Docker Desktop" -ForegroundColor White
    $hasErrors = $true
}

# Check if Docker Compose is available
try {
    $composeVersion = docker-compose --version
    Write-Host "SUCCESS: Docker Compose found: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Docker Compose not found!" -ForegroundColor Red
    Write-Host "   Please install Docker Compose" -ForegroundColor White
    $hasErrors = $true
}

# Validate docker-compose configuration
Write-Host ""
Write-Host "Validating Docker Compose configuration..." -ForegroundColor Yellow
try {
    docker-compose config | Out-Null
    Write-Host "SUCCESS: docker-compose.yaml is valid" -ForegroundColor Green
} catch {
    Write-Host "ERROR: docker-compose.yaml has errors" -ForegroundColor Red
    Write-Host "   Check your docker-compose.yaml file" -ForegroundColor White
    $hasErrors = $true
}

# Check if Make is available
Write-Host ""
Write-Host "Checking Make installation..." -ForegroundColor Yellow
try {
    $makeVersion = make --version
    Write-Host "SUCCESS: Make found" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Make not found!" -ForegroundColor Red
    Write-Host "   Please install Make or run Docker commands directly" -ForegroundColor White
    Write-Host "   Alternative: docker-compose up --build -d" -ForegroundColor White
}

# Check essential files
Write-Host ""
Write-Host "Checking essential files..." -ForegroundColor Yellow
$essentialFiles = @(
    "docker-compose.yaml",
    "docker-compose.dev.yaml",
    "backend/Dockerfile",
    "frontend/Dockerfile",
    "backend/main.go",
    "frontend/package.json"
)

foreach ($file in $essentialFiles) {
    if (Test-Path $file) {
        Write-Host "SUCCESS: $file" -ForegroundColor Green
    } else {
        Write-Host "ERROR: $file missing" -ForegroundColor Red
        $hasErrors = $true
    }
}

# Check .env configuration
Write-Host ""
Write-Host "Checking .env configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    
    if ($envContent -match "mongodb\+srv://") {
        Write-Host "SUCCESS: MongoDB Atlas URI found in .env" -ForegroundColor Green
    } else {
        Write-Host "WARNING: MongoDB Atlas URI not configured in .env" -ForegroundColor Yellow
        Write-Host "   Please update MONGODB_URI in .env file" -ForegroundColor White
    }
    
    if ($envContent -match "JWT_SECRET=your-super-secure") {
        Write-Host "WARNING: Default JWT_SECRET detected" -ForegroundColor Yellow
        Write-Host "   Please update JWT_SECRET in .env file" -ForegroundColor White
    } else {
        Write-Host "SUCCESS: JWT_SECRET appears to be customized" -ForegroundColor Green
    }
}

Write-Host ""
if ($hasErrors) {
    Write-Host "Setup validation failed!" -ForegroundColor Red
    Write-Host "Please fix the issues above before proceeding" -ForegroundColor White
    exit 1
} else {
    Write-Host "Setup Validation Complete!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Ready to start? Run:" -ForegroundColor Cyan
Write-Host "   make up" -ForegroundColor White
Write-Host ""
Write-Host "Then visit:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:8080" -ForegroundColor White
Write-Host "   Health:   http://localhost:8080/api/health" -ForegroundColor White
Write-Host ""
Write-Host "Need help? Run: make help" -ForegroundColor Cyan
