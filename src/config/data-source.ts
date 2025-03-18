import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Game } from '../games/entities/game.entity';
import { Player } from '../players/entities/player.entity';
import { Score } from '../scoring/entities/scoring.entity';
import { Session } from '../sessions/entities/session.entity';
import { Team } from '../teams/entities/team.entity';

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  entities: [Game, Player, Score, Session, Team],
  migrations: ['dist/database/migrations/*.js'],
  ssl: {
    rejectUnauthorized: false,
  },
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
