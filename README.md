# Creator Connect Platform

A web platform that connects content creators and businesses for sponsorship campaigns and collaborations.

## Features

- **For Creators**: Apply to sponsorship campaigns that match your niche
- **For Businesses**: Post sponsorship campaigns and review creator applications
- **Collaboration Management**: Streamlined approval process for brand partnerships

## Tech Stack

- **Frontend**: React with TypeScript (no Tailwind CSS)
- **Backend**: Go with Gorilla Mux and CORS
- **Database**: MongoDB
- **Build Tool**: Makefile

## Project Structure

```
├── frontend/          # React TypeScript application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── LandingPage.tsx
│   │   │   └── index.ts   # Component exports
│   │   ├── styles/        # CSS files organized by component
│   │   │   ├── App.css
│   │   │   ├── LandingPage.css
│   │   │   ├── globals.css    # Global variables and utilities
│   │   │   └── index.css      # Main styles index
│   │   └── ...
├── backend/           # Go backend application
│   ├── main.go
│   ├── go.mod
│   └── go.sum
├── bin/              # Compiled binaries
├── docker-compose.yaml
├── dockerfile
└── Makefile          # Build and development commands
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Go (v1.22 or higher)
- MongoDB
- Make

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Dipu-36/startup.git
cd startup
```

2. Install frontend dependencies:
```bash
make install
```

### Development

Start the development servers:

```bash
# Start frontend only (http://localhost:3000)
make dev

# Start backend only (http://localhost:8080)
make build-backend
make run-backend
```

### Available Make Commands

#### Frontend Commands
- `make install-frontend` - Install frontend dependencies
- `make start-frontend` - Start frontend development server
- `make build-frontend` - Build frontend for production

#### Backend Commands
- `make build-backend` - Build backend binary
- `make run-backend` - Run backend server
- `make test-backend` - Run backend tests

#### Combined Commands
- `make install` - Install all dependencies
- `make dev` - Start frontend development server
- `make build` - Build both frontend and backend

#### Docker Commands
- `make up` - Start with Docker Compose
- `make down` - Stop Docker containers
- `make start-container` - Start existing containers
- `make stop-container` - Stop running containers

## API Endpoints

- `GET /api/health` - Health check endpoint

## Landing Page

The landing page features:
- Full viewport design inspired by modern SaaS platforms
- Clean navigation with "LOGIN" and "GET STARTED" buttons
- Animated background elements
- Responsive design
- Modern gradient color scheme with CSS variables
- Organized CSS structure with separate files for each component


