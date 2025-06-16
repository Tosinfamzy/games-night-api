#!/bin/bash

# Games Night Backend - Development Setup Script
# This script sets up the development environment for the Games Night Backend

set -e

echo "🎮 Games Night Backend - Development Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_error "Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed."
    exit 1
fi

print_status "npm version: $(npm -v)"

# Check if Docker is installed (optional)
if command -v docker &> /dev/null; then
    print_status "Docker version: $(docker --version)"
    DOCKER_AVAILABLE=true
else
    print_warning "Docker is not installed. Docker-based development will not be available."
    DOCKER_AVAILABLE=false
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm ci

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from template..."
    cat > .env << EOF
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=games_night_user
DATABASE_PASSWORD=games_night_pass
DATABASE_NAME=games_night_dev

# Application Configuration
NODE_ENV=development
PORT=3000

# Redis Configuration (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
EOF
    print_status "Created .env file. Please update the values as needed."
else
    print_status ".env file already exists."
fi

# Offer to start PostgreSQL with Docker
if [ "$DOCKER_AVAILABLE" = true ]; then
    echo ""
    read -p "🐘 Would you like to start PostgreSQL with Docker? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Starting PostgreSQL with Docker..."
        docker run --name games-night-postgres \
            -e POSTGRES_USER=games_night_user \
            -e POSTGRES_PASSWORD=games_night_pass \
            -e POSTGRES_DB=games_night_dev \
            -p 5432:5432 \
            -d postgres:14-alpine
        
        print_status "PostgreSQL is starting up..."
        sleep 5
        
        # Wait for PostgreSQL to be ready
        echo "Waiting for PostgreSQL to be ready..."
        until docker exec games-night-postgres pg_isready -U games_night_user -d games_night_dev; do
            sleep 1
        done
        
        print_status "PostgreSQL is ready!"
    fi
fi

# Run database migrations
echo ""
echo "🔄 Running database migrations..."
if npm run migration:run; then
    print_status "Database migrations completed successfully."
else
    print_error "Database migrations failed. Please check your database connection."
    exit 1
fi

# Offer to seed the database
echo ""
read -p "🌱 Would you like to seed the database with sample data? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Seeding database..."
    if npm run seed:dev; then
        print_status "Database seeded successfully."
    else
        print_error "Database seeding failed."
    fi
fi

# Run tests to verify setup
echo ""
echo "🧪 Running tests to verify setup..."
if npm run test; then
    print_status "All tests passed!"
else
    print_warning "Some tests failed. The setup is complete but you may need to fix test issues."
fi

echo ""
echo "🎉 Development environment setup complete!"
echo ""
echo "Next steps:"
echo "  1. Review and update the .env file if needed"
echo "  2. Start the development server: npm run start:dev"
echo "  3. Visit http://localhost:3000/api for API documentation"
echo ""
echo "Available commands:"
echo "  npm run start:dev     - Start development server"
echo "  npm run test          - Run unit tests"
echo "  npm run test:e2e      - Run end-to-end tests"
echo "  npm run lint          - Run linting"
echo "  npm run docker:dev    - Start with Docker Compose"
echo ""
print_status "Happy coding! 🚀"
