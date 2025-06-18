import { Test, TestingModule } from '@nestjs/testing';
import { ScoringService } from './scoring.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Score } from './entities/scoring.entity';
import { Player } from '../players/entities/player.entity';
import { Team } from '../teams/entities/team.entity';
import { Session } from '../sessions/entities/session.entity';
import { Game } from '../games/entities/game.entity';
import { ScoreGateway } from '../gateways/score.gateway';

describe('ScoringService', () => {
  let service: ScoringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoringService,
        { provide: getRepositoryToken(Score), useValue: {} },
        { provide: getRepositoryToken(Player), useValue: {} },
        { provide: getRepositoryToken(Team), useValue: {} },
        { provide: getRepositoryToken(Session), useValue: {} },
        { provide: getRepositoryToken(Game), useValue: {} },
        { provide: ScoreGateway, useValue: {} },
      ],
    }).compile();

    service = module.get<ScoringService>(ScoringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
