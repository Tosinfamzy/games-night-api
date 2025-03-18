# Games Night Backend

A NestJS backend application for managing game sessions, players, teams, and scoring.

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
│   │   └── games.service.ts
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

- Game session management
- Player management
- Team management
- Real-time scoring
- WebSocket support for live updates
- Swagger API documentation
- TypeORM database integration
- Input validation
- Error handling

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
DATABASE_URL=postgresql://username:password@localhost:5432/games_night
PORT=3000
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

Run e2e tests:

```bash
npm run test:e2e
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
