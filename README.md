# Games Night Backend

A NestJS backend application for managing game sessions, players, teams, and scoring with versioned game rules.

## Project Structure

```
games-night-backend/
├── src/                      # Source code
│   ├── config/              # Configuration files
│   │   └── data-source.ts   # Database configuration
│   ├── database/            # Database related files
│   │   └── seeds/          # Database seeders
│   ├── games/              # Games module
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── entities/      # Database entities
│   │   ├── games.controller.ts
│   │   ├── games.module.ts
│   │   ├── games.service.ts
│   │   └── game-rules.controller.ts
│   ├── gateways/          # WebSocket gateways
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

- Game session management with multiple games per session
- Player and team management
- Real-time scoring with WebSocket support
- Versioned game rules system
- Game state management (SETUP, READY, IN_PROGRESS, COMPLETED)
- Session state tracking (PENDING, IN_PROGRESS, COMPLETED)
- Swagger API documentation
- TypeORM database integration
- Input validation
- Error handling

## Game Flow

1. **Session Creation**

   - Create a new session with selected games
   - Configure session settings (difficulty, duration)

2. **Player Management**

   - Add players to the session
   - Create teams and assign players
   - Track player ready status

3. **Game Management**

   - Configure game rules and settings
   - Track game state and rounds
   - Manage game transitions

4. **Scoring System**

   - Track individual player scores
   - Track team scores
   - Real-time score updates via WebSocket

5. **Game Rules Versioning**
   - Create and manage multiple versions of game rules
   - Compare rule versions
   - Set active rule versions
   - Track rule changes over time

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/games-night-backend.git
cd games-night-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=
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

Development mode:

```bash
npm run start:dev
```

Production mode:

```bash
npm run build
npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api
```

## Testing

Run unit tests:

```bash
npm run test
```
