import { Module } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { ScoringController } from './scoring.controller';
import { Session } from 'src/sessions/entities/session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from 'src/players/entities/player.entity';
import { Team } from 'src/teams/entities/team.entity';
import { Score } from './entities/scoring.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Score, Player, Team, Session])],
  controllers: [ScoringController],
  providers: [ScoringService],
})
export class ScoringModule {}
