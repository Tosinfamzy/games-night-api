import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GamesService } from './games.service';
import { Game } from './entities/game.entity';
import { GameParticipant } from './entities/game-participant.entity';
import { Player } from '../players/entities/player.entity';
import { Rule } from './entities/rule.entity';

describe('GamesService', () => {
  let service: GamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        { provide: getRepositoryToken(Game), useValue: {} },
        { provide: getRepositoryToken(GameParticipant), useValue: {} },
        { provide: getRepositoryToken(Player), useValue: {} },
        { provide: getRepositoryToken(Rule), useValue: {} },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
