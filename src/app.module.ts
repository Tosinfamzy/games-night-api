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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production', // Only synchronize in development
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
