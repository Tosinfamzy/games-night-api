import { DataSource } from 'typeorm';
import { Game } from '../../games/entities/game.entity';
import { Player } from '../../players/entities/player.entity';
import { Score } from '../../scoring/entities/scoring.entity';
import { Session } from '../../sessions/entities/session.entity';
import { Team } from '../../teams/entities/team.entity';
import { createGame } from '../factories/game.factory';
import { createSession } from '../factories/session.factory';
import { createTeam } from '../factories/team.factory';
import { createPlayer } from '../factories/player.factory';
import { createPlayerScore, createTeamScore } from '../factories/score.factory';
import { config } from 'dotenv';
import * as faker from 'faker';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [Game, Player, Score, Session, Team],
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
});

const NUM_GAMES = 10;
const NUM_SESSIONS_PER_GAME = 2;
const NUM_TEAMS_PER_SESSION = 3;
const NUM_PLAYERS_PER_TEAM = 2;
const NUM_SOLO_PLAYERS_PER_SESSION = 3;
const NUM_TEAM_SCORES = 5;
const NUM_PLAYER_SCORES = 3;

async function seed() {
  console.log('Starting seed process...');

  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');

    await AppDataSource.manager.query('TRUNCATE "score" CASCADE');
    await AppDataSource.manager.query('TRUNCATE "player" CASCADE');
    await AppDataSource.manager.query('TRUNCATE "team" CASCADE');
    await AppDataSource.manager.query('TRUNCATE "session" CASCADE');
    await AppDataSource.manager.query('TRUNCATE "game" CASCADE');
    console.log('Cleared existing data');

    const games: Game[] = [];
    for (let i = 0; i < NUM_GAMES; i++) {
      const gameData = createGame();
      const game = AppDataSource.manager.create(Game, gameData);
      games.push(await AppDataSource.manager.save(game));
    }
    console.log(`Created ${games.length} games`);

    for (const game of games) {
      for (let i = 0; i < NUM_SESSIONS_PER_GAME; i++) {
        const sessionGames = faker.random.arrayElements(
          games,
          faker.random.number({ min: 1, max: 3 }),
        );
        if (!sessionGames.includes(game)) {
          sessionGames.push(game);
        }
        const sessionData = createSession(sessionGames);
        const session = AppDataSource.manager.create(Session, sessionData);
        const savedSession = await AppDataSource.manager.save(session);
        console.log(`Created session for game: ${game.name}`);

        const teams: Team[] = [];
        for (let j = 0; j < NUM_TEAMS_PER_SESSION; j++) {
          const teamData = createTeam(savedSession);
          const team = AppDataSource.manager.create(Team, teamData);
          teams.push(await AppDataSource.manager.save(team));
        }
        console.log(
          `Created ${teams.length} teams for session: ${savedSession.id}`,
        );

        for (const team of teams) {
          for (let k = 0; k < NUM_PLAYERS_PER_TEAM; k++) {
            const playerData = createPlayer(savedSession, team);
            const player = AppDataSource.manager.create(Player, playerData);
            await AppDataSource.manager.save(player);
          }
        }
        console.log(`Created players for teams`);

        for (let k = 0; k < NUM_SOLO_PLAYERS_PER_SESSION; k++) {
          const playerData = createPlayer(savedSession);
          const player = AppDataSource.manager.create(Player, playerData);
          await AppDataSource.manager.save(player);
        }
        console.log(`Created solo players for session: ${savedSession.id}`);

        const allPlayers = await AppDataSource.manager.find(Player, {
          where: { session: { id: savedSession.id } },
        });

        for (const team of teams) {
          for (let k = 0; k < NUM_TEAM_SCORES; k++) {
            const scoreData = createTeamScore(team, savedSession);
            const score = AppDataSource.manager.create(Score, scoreData);
            await AppDataSource.manager.save(score);
          }
        }
        console.log(`Created team scores for session: ${savedSession.id}`);

        for (const player of allPlayers) {
          for (let k = 0; k < NUM_PLAYER_SCORES; k++) {
            const scoreData = createPlayerScore(player, savedSession);
            const score = AppDataSource.manager.create(Score, scoreData);
            await AppDataSource.manager.save(score);
          }
        }
        console.log(`Created player scores for session: ${savedSession.id}`);
      }
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error during seed:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed');
    }
  }
}

seed();
