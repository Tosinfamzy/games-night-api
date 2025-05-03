import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GamesModule } from './games/games.module';
import { SessionsModule } from './sessions/sessions.module';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';
import { ScoringModule } from './scoring/scoring.module';
import { GatewayModule } from './gateways/gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { dataSourceOptions } from './config/data-source';
import { AnalyticsModule } from './analytics/analytics.module';
import { Game } from './games/entities/game.entity';
import { Session } from './sessions/entities/session.entity';
import { Player } from './players/entities/player.entity';
import { Team } from './teams/entities/team.entity';
import { GameAnalytics } from './analytics/entities/game-analytics.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
      entities: [Game, Session, Player, Team, GameAnalytics],
    }),
    GamesModule,
    SessionsModule,
    PlayersModule,
    TeamsModule,
    ScoringModule,
    GatewayModule,
    AnalyticsModule,
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
