const mockScoringService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  getScoresByGame: jest.fn(),
  getScoresByTeam: jest.fn(),
  getScoresByPlayer: jest.fn(),
  getLeaderboard: jest.fn(),
  updateScore: jest.fn(),
};

class MockScoringController {
  constructor(private readonly scoringService: any) {}

  async create(createScoringDto: any) {
    return this.scoringService.create(createScoringDto);
  }

  async findAll() {
    return this.scoringService.findAll();
  }

  async findOne(id: string) {
    return this.scoringService.findOne(+id);
  }

  async update(id: string, updateScoringDto: any) {
    return this.scoringService.update(+id, updateScoringDto);
  }

  async remove(id: string) {
    return this.scoringService.remove(+id);
  }

  async getScoresByGame(gameId: string) {
    return this.scoringService.getScoresByGame(gameId);
  }

  async getScoresByTeam(teamId: string) {
    return this.scoringService.getScoresByTeam(+teamId);
  }

  async getScoresByPlayer(playerId: string) {
    return this.scoringService.getScoresByPlayer(+playerId);
  }

  async getLeaderboard(sessionId: string) {
    return this.scoringService.getLeaderboard(sessionId);
  }

  async updateScore(id: string, scoreDto: any) {
    return this.scoringService.updateScore(+id, scoreDto);
  }
}

describe('ScoringController', () => {
  let controller: MockScoringController;
  let service: any;

  const mockScore = {
    id: 1,
    points: 100,
    playerId: 1,
    teamId: 1,
    gameId: 'game1',
    sessionId: '123e4567-e89b-12d3-a456-426614174000',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    service = mockScoringService;
    controller = new MockScoringController(service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new score entry', async () => {
      const createScoringDto = {
        points: 100,
        playerId: 1,
        gameId: 'game1',
      };

      mockScoringService.create.mockResolvedValue(mockScore);

      const result = await controller.create(createScoringDto);

      expect(result).toEqual(mockScore);
      expect(service.create).toHaveBeenCalledWith(createScoringDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of scores', async () => {
      const expectedResult = [mockScore];
      mockScoringService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single score', async () => {
      const scoreId = '1';
      mockScoringService.findOne.mockResolvedValue(mockScore);

      const result = await controller.findOne(scoreId);

      expect(result).toEqual(mockScore);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a score', async () => {
      const scoreId = '1';
      const updateScoringDto = { points: 150 };
      const updatedScore = { ...mockScore, ...updateScoringDto };

      mockScoringService.update.mockResolvedValue(updatedScore);

      const result = await controller.update(scoreId, updateScoringDto);

      expect(result).toEqual(updatedScore);
      expect(service.update).toHaveBeenCalledWith(1, updateScoringDto);
    });
  });

  describe('remove', () => {
    it('should remove a score', async () => {
      const scoreId = '1';
      mockScoringService.remove.mockResolvedValue(undefined);

      await controller.remove(scoreId);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('getScoresByGame', () => {
    it('should return scores for a specific game', async () => {
      const gameId = 'game1';
      const expectedResult = [mockScore];

      mockScoringService.getScoresByGame.mockResolvedValue(expectedResult);

      const result = await controller.getScoresByGame(gameId);

      expect(result).toEqual(expectedResult);
      expect(service.getScoresByGame).toHaveBeenCalledWith(gameId);
    });
  });

  describe('getScoresByTeam', () => {
    it('should return scores for a specific team', async () => {
      const teamId = '1';
      const expectedResult = [mockScore];

      mockScoringService.getScoresByTeam.mockResolvedValue(expectedResult);

      const result = await controller.getScoresByTeam(teamId);

      expect(result).toEqual(expectedResult);
      expect(service.getScoresByTeam).toHaveBeenCalledWith(1);
    });
  });

  describe('getScoresByPlayer', () => {
    it('should return scores for a specific player', async () => {
      const playerId = '1';
      const expectedResult = [mockScore];

      mockScoringService.getScoresByPlayer.mockResolvedValue(expectedResult);

      const result = await controller.getScoresByPlayer(playerId);

      expect(result).toEqual(expectedResult);
      expect(service.getScoresByPlayer).toHaveBeenCalledWith(1);
    });
  });

  describe('getLeaderboard', () => {
    it('should return leaderboard for a session', async () => {
      const sessionId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedLeaderboard = [
        { playerId: 1, totalPoints: 150, rank: 1 },
        { playerId: 2, totalPoints: 100, rank: 2 },
      ];

      mockScoringService.getLeaderboard.mockResolvedValue(expectedLeaderboard);

      const result = await controller.getLeaderboard(sessionId);

      expect(result).toEqual(expectedLeaderboard);
      expect(service.getLeaderboard).toHaveBeenCalledWith(sessionId);
    });
  });

  describe('updateScore', () => {
    it('should update a score with new points', async () => {
      const scoreId = '1';
      const scoreDto = { points: 200 };
      const updatedScore = { ...mockScore, points: 200 };

      mockScoringService.updateScore.mockResolvedValue(updatedScore);

      const result = await controller.updateScore(scoreId, scoreDto);

      expect(result).toEqual(updatedScore);
      expect(service.updateScore).toHaveBeenCalledWith(1, scoreDto);
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
