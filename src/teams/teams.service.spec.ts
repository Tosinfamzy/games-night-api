import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Session } from '../sessions/entities/session.entity';
import { Player } from '../players/entities/player.entity';
import { TeamsGateway } from '../gateways/teams.gateway';

describe('TeamsService', () => {
  let service: TeamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        { provide: getRepositoryToken(Team), useValue: {} },
        { provide: getRepositoryToken(Session), useValue: {} },
        { provide: getRepositoryToken(Player), useValue: {} },
        { provide: TeamsGateway, useValue: {} },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
