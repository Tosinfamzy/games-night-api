import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GamesModule } from './games/games.module';
import { SessionsModule } from './sessions/sessions.module';
import { PlayersModule } from './players/players.module';
import { Player } from './players/entities/player.entity';
import { Session } from './sessions/entities/session.entity';
import { Game } from './games/entities/game.entity';
import { TeamsModule } from './teams/teams.module';
import { ScoringModule } from './scoring/scoring.module';
import { Team } from './teams/entities/team.entity';
import { GatewayModule } from './gateways/gateway.module';
import { Score } from './scoring/entities/scoring.entity';
import { ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Game, Session, Player, Team, Score],
      synchronize: true,
      autoLoadEntities: true,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    GamesModule,
    SessionsModule,
    PlayersModule,
    TeamsModule,
    ScoringModule,
    GatewayModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
