# PowerShell script to build Docker containers with Clerk environment variables
# Usage: .\build-with-clerk.ps1

Write-Host "Building Docker containers with Clerk configuration..." -ForegroundColor Green

# Check if .env file exists
if (-not (Test-Path "frontend\.env")) {
    Write-Host "Warning: frontend\.env file not found. Please copy .env.example to .env and configure your Clerk keys." -ForegroundColor Yellow
    Write-Host "Continuing with build using .env.example values..." -ForegroundColor Yellow
}

# Load environment variables from .env file if it exists
$envFile = if (Test-Path "frontend\.env") { "frontend\.env" } else { "frontend\.env.example" }

$envVars = @{}
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^([^#][^=]*?)=(.*)$') {
        $envVars[$matches[1].Trim()] = $matches[2].Trim()
    }
}

# Build with environment variables
Write-Host "Building frontend with Clerk configuration..." -ForegroundColor Cyan

$buildArgs = @()
foreach ($key in $envVars.Keys) {
    if ($key.StartsWith("REACT_APP_")) {
        $buildArgs += "--build-arg"
        $buildArgs += "$key=$($envVars[$key])"
    }
}

# Build the frontend Docker image
docker build @buildArgs -t sponsorconnect-frontend:latest -f frontend/Dockerfile frontend/

if ($LASTEXITCODE -eq 0) {
    Write-Host "Frontend built successfully with Clerk configuration!" -ForegroundColor Green
} else {
    Write-Host "Frontend build failed!" -ForegroundColor Red
    exit 1
}

# Build backend
Write-Host "Building backend..." -ForegroundColor Cyan
docker build -t sponsorconnect-backend:latest -f backend/Dockerfile backend/

if ($LASTEXITCODE -eq 0) {
    Write-Host "Backend built successfully!" -ForegroundColor Green
    Write-Host "All containers built successfully! You can now run 'docker-compose up' or 'make dev'" -ForegroundColor Green
} else {
    Write-Host "Backend build failed!" -ForegroundColor Red
    exit 1
}
