import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Session } from 'src/sessions/entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team, Session])],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
