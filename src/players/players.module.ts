import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { Session } from 'src/sessions/entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Player, Session])],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
