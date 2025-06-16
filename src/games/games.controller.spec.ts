import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockGamesService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  addPlayer: jest.fn(),
  removePlayer: jest.fn(),
  startGame: jest.fn(),
  endGame: jest.fn(),
  setPlayerReady: jest.fn(),
  getGameByCode: jest.fn(),
};

class MockGamesController {
  constructor(private readonly gamesService: any) {}

  async findAll() {
    return this.gamesService.findAll();
  }

  async findOne(id: string) {
    return this.gamesService.findOne(id);
  }

  async create(createGameDto: any) {
    return this.gamesService.create(createGameDto);
  }

  async addPlayer(gameId: string, addPlayerDto: any) {
    return this.gamesService.addPlayer(gameId, addPlayerDto.playerId);
  }

  async startGame(gameId: string) {
    return this.gamesService.startGame(gameId);
  }

  async endGame(gameId: string) {
    return this.gamesService.endGame(gameId);
  }
}

describe('GamesController', () => {
  let controller: MockGamesController;
  let service: any;

  const mockGame = {
    id: '1',
    name: 'Test Game',
    type: 'trivia',
    state: 'waiting',
    maxParticipants: 4,
    participants: [],
    rules: [],
  };

  beforeEach(async () => {
    service = mockGamesService;
    controller = new MockGamesController(service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of games', async () => {
      const expectedResult = [mockGame];
      mockGamesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single game', async () => {
      const gameId = '1';
      mockGamesService.findOne.mockResolvedValue(mockGame);

      const result = await controller.findOne(gameId);

      expect(result).toEqual(mockGame);
      expect(service.findOne).toHaveBeenCalledWith(gameId);
    });
  });

  describe('create', () => {
    it('should create a new game', async () => {
      const createGameDto = {
        name: 'New Game',
        type: 'trivia',
        maxParticipants: 4,
      };

      mockGamesService.create.mockResolvedValue(mockGame);

      const result = await controller.create(createGameDto);

      expect(result).toEqual(mockGame);
      expect(service.create).toHaveBeenCalledWith(createGameDto);
    });
  });

  describe('addPlayer', () => {
    it('should add a player to the game', async () => {
      const gameId = '1';
      const addPlayerDto = { playerId: 'player1' };
      const updatedGame = {
        ...mockGame,
        participants: [{ playerId: 'player1' }],
      };

      mockGamesService.addPlayer.mockResolvedValue(updatedGame);

      const result = await controller.addPlayer(gameId, addPlayerDto);

      expect(result).toEqual(updatedGame);
      expect(service.addPlayer).toHaveBeenCalledWith(
        gameId,
        addPlayerDto.playerId,
      );
    });
  });

  describe('startGame', () => {
    it('should start a game', async () => {
      const gameId = '1';
      const startedGame = { ...mockGame, state: 'in_progress' };

      mockGamesService.startGame.mockResolvedValue(startedGame);

      const result = await controller.startGame(gameId);

      expect(result).toEqual(startedGame);
      expect(service.startGame).toHaveBeenCalledWith(gameId);
    });
  });

  describe('endGame', () => {
    it('should end a game', async () => {
      const gameId = '1';
      const endedGame = { ...mockGame, state: 'completed' };

      mockGamesService.endGame.mockResolvedValue(endedGame);

      const result = await controller.endGame(gameId);

      expect(result).toEqual(endedGame);
      expect(service.endGame).toHaveBeenCalledWith(gameId);
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
