# Games Night Backend

A NestJS backend service for managing game nights, sessions, teams, players, and scoring.

## Features

- Game management
- Session tracking
- Player registration
- Team formation
- Real-time scoring system
- WebSocket notifications

## Tech Stack

- NestJS
- TypeORM
- PostgreSQL
- Socket.IO

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- PostgreSQL

### Installation

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run the application
npm run start:dev
```

## Database Management

### Migrations

This project uses TypeORM migrations to manage database schema changes. Here are the available commands:

```bash
# Generate a new migration (after schema changes)
npm run migration:generate -- src/database/migrations/MigrationName

# Create a new empty migration
npm run migration:create -- src/database/migrations/MigrationName

# Run pending migrations
npm run migration:run

# Revert the last applied migration
npm run migration:revert
```

### Seed Data

You can populate your database with development data using the seed command:

```bash
# Run seed for development environment
npm run seed:dev
```

The seed script will:

1. Clear all existing data
2. Create sample games with rules
3. Create game sessions
4. Create teams for sessions
5. Create players (both team members and solo players)
6. Add scores for teams and players

This makes it easy to test the application with realistic data.
