import { Module, forwardRef } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Session } from 'src/sessions/entities/session.entity';
import { Player } from 'src/players/entities/player.entity';
import { GatewayModule } from 'src/gateways/gateway.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team, Session, Player]),
    forwardRef(() => GatewayModule),
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
