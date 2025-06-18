import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SessionsService } from './sessions.service';
import { SessionsGateway } from './sessions.gateway';
import { Session } from './entities/session.entity';
import { Game } from '../games/entities/game.entity';
import { Player } from '../players/entities/player.entity';
import { Team } from '../teams/entities/team.entity';

describe('SessionsService', () => {
  let service: SessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        { provide: getRepositoryToken(Session), useValue: {} },
        { provide: getRepositoryToken(Game), useValue: {} },
        { provide: getRepositoryToken(Player), useValue: {} },
        { provide: getRepositoryToken(Team), useValue: {} },
        { provide: SessionsGateway, useValue: {} },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
