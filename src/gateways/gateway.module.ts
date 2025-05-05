import { Module, forwardRef } from '@nestjs/common';
import { ScoreGateway } from './score.gateway';
import { TeamsGateway } from './teams.gateway';
import { ScoringModule } from 'src/scoring/scoring.module';
import { TeamsModule } from 'src/teams/teams.module';
import { PlayersModule } from 'src/players/players.module';

@Module({
  imports: [
    forwardRef(() => ScoringModule),
    forwardRef(() => TeamsModule),
    forwardRef(() => PlayersModule),
  ],
  providers: [ScoreGateway, TeamsGateway],
  exports: [ScoreGateway, TeamsGateway],
})
export class GatewayModule {}
