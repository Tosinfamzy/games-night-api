import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GameParticipant } from './entities/game-participant.entity';
import { Player } from '../players/entities/player.entity';
import { Rule } from './entities/rule.entity';
import { GameRulesController } from './game-rules.controller';
import { GameRulesService } from './game-rules.service';
import { GameRules } from './entities/game-rules.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, GameParticipant, Player, Rule, GameRules]),
  ],
  controllers: [GamesController, GameRulesController],
  providers: [GamesService, GameRulesService],
  exports: [GamesService, GameRulesService],
})
export class GamesModule {}
