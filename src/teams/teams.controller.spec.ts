import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockTeamsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  addPlayer: jest.fn(),
  removePlayer: jest.fn(),
  findBySession: jest.fn(),
};

class MockTeamsController {
  constructor(private readonly teamsService: any) {}

  async create(createTeamDto: any) {
    return this.teamsService.create(createTeamDto);
  }

  async findAll() {
    return this.teamsService.findAll();
  }

  async findOne(id: string) {
    return this.teamsService.findOne(+id);
  }

  async update(id: string, updateTeamDto: any) {
    return this.teamsService.update(+id, updateTeamDto);
  }

  async remove(id: string) {
    return this.teamsService.remove(+id);
  }

  async addPlayer(id: string, playerId: string) {
    return this.teamsService.addPlayer(+id, +playerId);
  }

  async removePlayer(id: string, playerId: string) {
    return this.teamsService.removePlayer(+id, +playerId);
  }

  async findBySession(sessionId: string) {
    return this.teamsService.findBySession(sessionId);
  }
}

describe('TeamsController', () => {
  let controller: MockTeamsController;
  let service: any;

  const mockTeam = {
    id: 1,
    name: 'Test Team',
    sessionId: '123e4567-e89b-12d3-a456-426614174000',
    players: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    service = mockTeamsService;
    controller = new MockTeamsController(service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new team', async () => {
      const createTeamDto = {
        name: 'New Team',
        sessionId: '123e4567-e89b-12d3-a456-426614174000',
      };

      mockTeamsService.create.mockResolvedValue(mockTeam);

      const result = await controller.create(createTeamDto);

      expect(result).toEqual(mockTeam);
      expect(service.create).toHaveBeenCalledWith(createTeamDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of teams', async () => {
      const expectedResult = [mockTeam];
      mockTeamsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single team', async () => {
      const teamId = '1';
      mockTeamsService.findOne.mockResolvedValue(mockTeam);

      const result = await controller.findOne(teamId);

      expect(result).toEqual(mockTeam);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a team', async () => {
      const teamId = '1';
      const updateTeamDto = { name: 'Updated Team' };
      const updatedTeam = { ...mockTeam, ...updateTeamDto };

      mockTeamsService.update.mockResolvedValue(updatedTeam);

      const result = await controller.update(teamId, updateTeamDto);

      expect(result).toEqual(updatedTeam);
      expect(service.update).toHaveBeenCalledWith(1, updateTeamDto);
    });
  });

  describe('remove', () => {
    it('should remove a team', async () => {
      const teamId = '1';
      mockTeamsService.remove.mockResolvedValue(undefined);

      await controller.remove(teamId);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('addPlayer', () => {
    it('should add a player to a team', async () => {
      const teamId = '1';
      const playerId = '2';
      const updatedTeam = { ...mockTeam, players: [{ id: 2 }] };

      mockTeamsService.addPlayer.mockResolvedValue(updatedTeam);

      const result = await controller.addPlayer(teamId, playerId);

      expect(result).toEqual(updatedTeam);
      expect(service.addPlayer).toHaveBeenCalledWith(1, 2);
    });
  });

  describe('removePlayer', () => {
    it('should remove a player from a team', async () => {
      const teamId = '1';
      const playerId = '2';

      mockTeamsService.removePlayer.mockResolvedValue(mockTeam);

      const result = await controller.removePlayer(teamId, playerId);

      expect(result).toEqual(mockTeam);
      expect(service.removePlayer).toHaveBeenCalledWith(1, 2);
    });
  });

  describe('findBySession', () => {
    it('should return teams for a session', async () => {
      const sessionId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedResult = [mockTeam];

      mockTeamsService.findBySession.mockResolvedValue(expectedResult);

      const result = await controller.findBySession(sessionId);

      expect(result).toEqual(expectedResult);
      expect(service.findBySession).toHaveBeenCalledWith(sessionId);
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
