import { Module, forwardRef } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { ScoringController } from './scoring.controller';
import { Session } from 'src/sessions/entities/session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from 'src/players/entities/player.entity';
import { Team } from 'src/teams/entities/team.entity';
import { Score } from './entities/scoring.entity';
import { Game } from 'src/games/entities/game.entity';
import { GatewayModule } from 'src/gateways/gateway.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Score, Player, Team, Session, Game]),
    forwardRef(() => GatewayModule),
  ],
  controllers: [ScoringController],
  providers: [ScoringService],
  exports: [ScoringService],
})
export class ScoringModule {}
