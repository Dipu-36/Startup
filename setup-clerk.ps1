# Clerk Setup Script for SponsorConnect
# This script helps you set up Clerk authentication

Write-Host "🔐 Setting up Clerk Authentication for SponsorConnect" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Check if .env already exists
if (Test-Path "frontend\.env") {
    Write-Host "frontend\.env file already exists" -ForegroundColor Green
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Keeping existing .env file. You can manually update it with your Clerk keys." -ForegroundColor Yellow
        exit 0
    }
}

# Copy .env.example to .env
Copy-Item "frontend\.env.example" "frontend\.env"
Write-Host "Created frontend\.env from template" -ForegroundColor Green

Write-Host ""
Write-Host " Next Steps:" -ForegroundColor Cyan
Write-Host "1. Go to https://dashboard.clerk.com/ and create a new application" -ForegroundColor White
Write-Host "2. Copy your Publishable Key and Secret Key" -ForegroundColor White
Write-Host "3. Edit frontend\.env and replace the placeholder values:" -ForegroundColor White
Write-Host "   - REACT_APP_CLERK_PUBLISHABLE_KEY=your_publishable_key" -ForegroundColor Yellow
Write-Host "   - CLERK_SECRET_KEY=your_secret_key" -ForegroundColor Yellow
Write-Host ""
Write-Host " Opening .env file for editing..." -ForegroundColor Cyan

# Try to open the .env file in the default editor
try {
    Start-Process "frontend\.env"
} catch {
    Write-Host "Could not auto-open .env file. Please edit frontend\.env manually." -ForegroundColor Yellow
}

Write-Host ""
Write-Host " After configuring your Clerk keys, run:" -ForegroundColor Green
Write-Host "   make dev      # For development with hot reload" -ForegroundColor White
Write-Host "   make up       # For production mode" -ForegroundColor White
Write-Host ""
Write-Host " Clerk Documentation: https://clerk.com/docs/quickstarts/react" -ForegroundColor Blue
