import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { GameAnalytics } from './entities/game-analytics.entity';
import { Game } from '../games/entities/game.entity';
import { Session } from '../sessions/entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameAnalytics, Game, Session])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
