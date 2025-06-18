# Games Night Backend

[![CI Pipeline](https://github.com/tosinfamzy/games-night-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/tosinfamzy/games-night-backend/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/tosinfamzy/games-night-backend/branch/main/graph/badge.svg)](https://codecov.io/gh/tosinfamzy/games-night-backend)

A NestJS backend application for managing game sessions, players, teams, scoring, analytics, and versioned game rules.

## Quick Start

For the fastest setup, use the automated development setup script:

```bash
git clone https://github.com/tosinfamzy/games-night-backend.git
cd games-night-backend
npm run setup:dev
```

This will automatically:

- Install dependencies
- Create `.env` file
- Set up PostgreSQL (with Docker if available)
- Run migrations and seed data
- Verify the setup with tests

## Project Structure

```
games-night-backend/
├── src/                      # Source code
│   ├── analytics/           # Analytics module
│   │   ├── entities/        # Analytics entities
│   │   ├── analytics.controller.ts
│   │   ├── analytics.module.ts
│   │   └── analytics.service.ts
│   ├── config/              # Configuration files
│   │   └── data-source.ts   # Database configuration
│   ├── database/            # Database related files
│   │   ├── factories/      # Test data factories
│   │   ├── migrations/     # Database migrations
│   │   └── seeds/          # Database seeders
│   ├── games/              # Games module
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── entities/      # Database entities
│   │   ├── games.controller.ts
│   │   ├── games.module.ts
│   │   ├── games.service.ts
│   │   └── game-rules.controller.ts
│   ├── gateways/          # WebSocket gateways
│   │   ├── gateway.module.ts
│   │   ├── score.gateway.ts
│   │   └── sessions.gateway.ts
│   ├── players/           # Players module
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── entities/     # Database entities
│   │   ├── players.controller.ts
│   │   ├── players.module.ts
│   │   └── players.service.ts
│   ├── scoring/          # Scoring module
│   │   ├── dto/         # Data Transfer Objects
│   │   ├── entities/    # Database entities
│   │   ├── scoring.controller.ts
│   │   ├── scoring.module.ts
│   │   └── scoring.service.ts
│   ├── sessions/        # Sessions module
│   │   ├── dto/        # Data Transfer Objects
│   │   ├── entities/   # Database entities
│   │   ├── sessions.controller.ts
│   │   ├── sessions.gateway.ts
│   │   ├── sessions.module.ts
│   │   └── sessions.service.ts
│   ├── teams/          # Teams module
│   │   ├── dto/       # Data Transfer Objects
│   │   ├── entities/  # Database entities
│   │   ├── teams.controller.ts
│   │   ├── teams.module.ts
│   │   └── teams.service.ts
│   ├── app.module.ts   # Main application module
│   └── main.ts        # Application entry point
├── test/              # Test files
├── .env              # Environment variables
├── .eslintrc.js      # ESLint configuration
├── .gitignore        # Git ignore rules
├── .prettierrc       # Prettier configuration
├── nest-cli.json     # NestJS CLI configuration
├── package.json      # Project dependencies
├── tsconfig.json     # TypeScript configuration
└── README.md         # Project documentation
```

## Features

- Game session management with multiple games per session (using UUID identifiers)
- Player and team management
- Real-time scoring with WebSocket support
- Versioned game rules system
- Game state management (SETUP, READY, IN_PROGRESS, COMPLETED)
- Session state tracking (IN_PROGRESS, COMPLETED)
- Game analytics and statistics tracking
- Swagger API documentation
- TypeORM database integration
- Input validation
- Error handling

## Game Flow

1. **Host Player Creation**

   - Create a host player who will manage the session
   - Host player serves as the administrator for the game night

2. **Session Creation**

   - Create a new session with selected games
   - Configure session settings (difficulty, duration)

3. **Player Management**

   - Add players to the session
   - Create teams and assign players (random or custom teams)
     - Random teams: Evenly distributes players among teams
     - Custom teams: Manually assign players to specific teams
   - Track player ready status

4. **Game Management**

   - Configure game rules and settings
   - Track game state and rounds
   - Manage game transitions

5. **Scoring System**

   - Track individual player scores
   - Track team scores
   - Real-time score updates via WebSocket

6. **Game Rules Versioning**

   - Create and manage multiple versions of game rules
   - Compare rule versions
   - Set active rule versions
   - Track rule changes over time

7. **Analytics**
   - Track game usage statistics
   - Analyze player performance
   - Monitor session metrics
   - Generate reports on game popularity and engagement

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Database Information

The application uses PostgreSQL with TypeORM for database management. Session IDs have been migrated from integers to UUIDs to provide better scalability and security.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/tosinfamzy/games-night-backend.git
cd games-night-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory (copy from .env.example):

```bash
cp .env.example .env
```

Then update the `.env` file with your database credentials:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=games_night_user
DATABASE_PASSWORD=games_night_pass
DATABASE_NAME=games_night_dev
```

4. Run database migrations:

```bash
npm run migration:run
```

5. Seed the database (optional):

```bash
npm run seed
```

## Running the Application

### Local Development

Development mode:

```bash
npm run start:dev
```

Production mode:

```bash
npm run build
npm run start:prod
```

### Docker Development

Run with Docker Compose for development (includes PostgreSQL and Redis):

```bash
npm run docker:dev
```

### Docker Production

Run with Docker Compose for production:

```bash
npm run docker:prod
```

Build and run Docker container manually:

```bash
npm run docker:build
npm run docker:run
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api
```

### Team Creation Features

The application offers two ways to create teams:

1. **Random Teams**

   - Endpoint: `POST /sessions/{id}/teams/random`
   - Automatically creates balanced teams by randomly distributing players
   - Requires the number of teams to create and hostId for authorization
   - Example request:
     ```json
     {
       "numberOfTeams": 2
     }
     ```

2. **Custom Teams**
   - Endpoint: `POST /sessions/{id}/teams/custom`
   - Allows manual specification of teams and player assignments
   - Example request:
     ```json
     {
       "teams": [
         {
           "teamName": "Team Alpha",
           "playerIds": [1, 2, 3]
         },
         {
           "teamName": "Team Beta",
           "playerIds": [4, 5, 6]
         }
       ]
     }
     ```

## Testing

Run unit tests:

```bash
npm run test
```

Run end-to-end tests:

```bash
npm run test:e2e
```

Run tests with coverage:

```bash
npm run test:cov
```

Run all CI tests locally:

```bash
npm run ci:test
```

## Development Setup

Quick setup for new developers:

```bash
npm run setup:dev
```

This script will:

- Check Node.js version compatibility
- Install dependencies
- Create `.env` file from template
- Optionally start PostgreSQL with Docker
- Run database migrations
- Seed the database
- Run tests to verify setup

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

### Workflows

- **CI Pipeline** (`.github/workflows/ci.yml`)

  - Runs on every push and PR
  - Code quality checks (ESLint, Prettier, TypeScript)
  - Unit and e2e tests with PostgreSQL
  - Build verification
  - Security scanning

- **Code Quality** (`.github/workflows/code-quality.yml`)

  - Advanced code quality checks
  - Test coverage reporting
  - Bundle size analysis
  - Dependency vulnerability scanning

- **Release** (`.github/workflows/release.yml`)

  - Automated releases on git tags
  - Docker image building and publishing
  - Changelog generation
  - NPM package publishing

- **PR Automation** (`.github/workflows/pr-automation.yml`)
  - Auto-label PRs based on changed files
  - Size labeling based on lines changed
  - Welcome comments for new contributors

### Prerequisites for CI/CD

To use all features, configure these secrets in your GitHub repository:

- `SNYK_TOKEN` - For security scanning (optional)
- `NPM_TOKEN` - For NPM publishing (optional)
- `CODECOV_TOKEN` - For coverage reporting (optional)

### Docker Support

The project includes multi-stage Docker builds:

- **Development**: `Dockerfile.dev` with hot reloading
- **Production**: `Dockerfile` with optimized builds
- **Docker Compose**: Ready-to-use configurations for both environments
