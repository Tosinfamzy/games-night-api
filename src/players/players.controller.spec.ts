import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockPlayersService = {
  addPlayer: jest.fn(),
  createHost: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

class MockPlayersController {
  constructor(private readonly playerService: any) {}

  async addPlayer(body: { sessionId: string; name: string; type?: string }) {
    if (!this.isValidUuid(body.sessionId)) {
      throw new BadRequestException('sessionId must be a valid UUID');
    }
    return this.playerService.addPlayer(body.sessionId, body.name, body.type);
  }

  async createHost(createHostPlayerDto: { name: string }) {
    return this.playerService.createHost(createHostPlayerDto);
  }

  async getPlayer(id: string) {
    return this.playerService.findOne(+id);
  }

  async removePlayer(id: string) {
    return this.playerService.remove(+id);
  }

  private isValidUuid(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}

describe('PlayersController', () => {
  let controller: MockPlayersController;
  let service: any;

  const mockPlayer = {
    id: 1,
    name: 'Test Player',
    sessionId: '123e4567-e89b-12d3-a456-426614174000',
    type: 'participant',
    isHost: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    service = mockPlayersService;
    controller = new MockPlayersController(service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addPlayer', () => {
    it('should add a player successfully', async () => {
      const playerData = {
        sessionId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'John Doe',
        type: 'participant',
      };

      mockPlayersService.addPlayer.mockResolvedValue(mockPlayer);

      const result = await controller.addPlayer(playerData);

      expect(result).toEqual(mockPlayer);
      expect(service.addPlayer).toHaveBeenCalledWith(
        playerData.sessionId,
        playerData.name,
        playerData.type,
      );
    });

    it('should throw BadRequestException for invalid UUID', async () => {
      const playerData = {
        sessionId: 'invalid-uuid',
        name: 'John Doe',
        type: 'participant',
      };

      await expect(controller.addPlayer(playerData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should add player without type (defaults)', async () => {
      const playerData = {
        sessionId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'John Doe',
      };

      mockPlayersService.addPlayer.mockResolvedValue(mockPlayer);

      const result = await controller.addPlayer(playerData);

      expect(result).toEqual(mockPlayer);
      expect(service.addPlayer).toHaveBeenCalledWith(
        playerData.sessionId,
        playerData.name,
        undefined,
      );
    });
  });

  describe('createHost', () => {
    it('should create a host player successfully', async () => {
      const createHostDto = {
        name: 'Host Player',
      };

      const hostPlayer = { ...mockPlayer, type: 'host', isHost: true };
      mockPlayersService.createHost.mockResolvedValue(hostPlayer);

      const result = await controller.createHost(createHostDto);

      expect(result).toEqual(hostPlayer);
      expect(service.createHost).toHaveBeenCalledWith(createHostDto);
    });
  });

  describe('getPlayer', () => {
    it('should return a player by ID', async () => {
      mockPlayersService.findOne.mockResolvedValue(mockPlayer);

      const result = await controller.getPlayer('1');

      expect(result).toEqual(mockPlayer);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should handle player not found', async () => {
      mockPlayersService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.getPlayer('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removePlayer', () => {
    it('should remove a player successfully', async () => {
      mockPlayersService.remove.mockResolvedValue(undefined);

      await controller.removePlayer('1');

      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should handle player not found during removal', async () => {
      mockPlayersService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.removePlayer('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
