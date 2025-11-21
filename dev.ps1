# Quick Development Script for SponsorConnect
# Usage: .\dev.ps1 [command]

param(
    [string]$Command = "start"
)

Write-Host "🚀 SponsorConnect Development Helper" -ForegroundColor Cyan
Write-Host ""

switch ($Command.ToLower()) {
    "start" {
        Write-Host "🔥 Starting development environment with hot reload..." -ForegroundColor Green
        Write-Host "📝 Your changes will be automatically reloaded!" -ForegroundColor Yellow
        Write-Host ""
        docker-compose -f docker-compose.dev.yaml up --build
    }
    "bg" {
        Write-Host "🔥 Starting development environment in background..." -ForegroundColor Green
        docker-compose -f docker-compose.dev.yaml up --build -d
        Write-Host ""
        Write-Host "✅ Development environment running!" -ForegroundColor Green
        Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Blue
        Write-Host "🔌 Backend:  http://localhost:8080" -ForegroundColor Blue
        Write-Host "📝 View logs: .\dev.ps1 logs" -ForegroundColor Yellow
    }
    "stop" {
        Write-Host "🛑 Stopping development environment..." -ForegroundColor Red
        docker-compose -f docker-compose.dev.yaml down
        Write-Host "✅ Stopped!" -ForegroundColor Green
    }
    "restart" {
        Write-Host "🔄 Restarting development environment..." -ForegroundColor Yellow
        docker-compose -f docker-compose.dev.yaml down
        docker-compose -f docker-compose.dev.yaml up -d
        Write-Host "✅ Restarted!" -ForegroundColor Green
    }
    "logs" {
        Write-Host "📋 Viewing development logs..." -ForegroundColor Blue
        docker-compose -f docker-compose.dev.yaml logs -f
    }
    "status" {
        Write-Host "📊 Development environment status:" -ForegroundColor Blue
        docker-compose -f docker-compose.dev.yaml ps
    }
    "help" {
        Write-Host "Available commands:" -ForegroundColor Yellow
        Write-Host "  .\dev.ps1 start     - Start with logs (default)" -ForegroundColor White
        Write-Host "  .\dev.ps1 bg        - Start in background" -ForegroundColor White
        Write-Host "  .\dev.ps1 stop      - Stop environment" -ForegroundColor White
        Write-Host "  .\dev.ps1 restart   - Restart environment" -ForegroundColor White
        Write-Host "  .\dev.ps1 logs      - View logs" -ForegroundColor White
        Write-Host "  .\dev.ps1 status    - Show status" -ForegroundColor White
        Write-Host "  .\dev.ps1 help      - Show this help" -ForegroundColor White
    }
    default {
        Write-Host "❌ Unknown command: $Command" -ForegroundColor Red
        Write-Host "Run '.\dev.ps1 help' for available commands" -ForegroundColor Yellow
    }
}
