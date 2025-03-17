import { Module, forwardRef } from '@nestjs/common';
import { ScoreGateway } from './score.gateway';
import { ScoringModule } from 'src/scoring/scoring.module';

@Module({
  imports: [forwardRef(() => ScoringModule)],
  providers: [ScoreGateway],
  exports: [ScoreGateway],
})
export class GatewayModule {}
