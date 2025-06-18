const mockSessionsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  addGame: jest.fn(),
  removeGame: jest.fn(),
  getActiveSession: jest.fn(),
  endSession: jest.fn(),
};

class MockSessionsController {
  constructor(private readonly sessionsService: any) {}

  async create(createSessionDto: any) {
    return this.sessionsService.create(createSessionDto);
  }

  async findAll() {
    return this.sessionsService.findAll();
  }

  async findOne(id: string) {
    return this.sessionsService.findOne(id);
  }

  async update(id: string, updateSessionDto: any) {
    return this.sessionsService.update(id, updateSessionDto);
  }

  async remove(id: string) {
    return this.sessionsService.remove(id);
  }

  async addGame(id: string, gameId: string) {
    return this.sessionsService.addGame(id, gameId);
  }

  async removeGame(id: string, gameId: string) {
    return this.sessionsService.removeGame(id, gameId);
  }

  async getActiveSession() {
    return this.sessionsService.getActiveSession();
  }

  async endSession(id: string) {
    return this.sessionsService.endSession(id);
  }
}

describe('SessionsController', () => {
  let controller: MockSessionsController;
  let service: any;

  const mockSession = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Session',
    isActive: true,
    players: [],
    teams: [],
    games: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    service = mockSessionsService;
    controller = new MockSessionsController(service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new session', async () => {
      const createSessionDto = {
        name: 'New Session',
      };

      mockSessionsService.create.mockResolvedValue(mockSession);

      const result = await controller.create(createSessionDto);

      expect(result).toEqual(mockSession);
      expect(service.create).toHaveBeenCalledWith(createSessionDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of sessions', async () => {
      const expectedResult = [mockSession];
      mockSessionsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single session', async () => {
      const sessionId = '123e4567-e89b-12d3-a456-426614174000';
      mockSessionsService.findOne.mockResolvedValue(mockSession);

      const result = await controller.findOne(sessionId);

      expect(result).toEqual(mockSession);
      expect(service.findOne).toHaveBeenCalledWith(sessionId);
    });
  });

  describe('update', () => {
    it('should update a session', async () => {
      const sessionId = '123e4567-e89b-12d3-a456-426614174000';
      const updateSessionDto = { name: 'Updated Session' };
      const updatedSession = { ...mockSession, ...updateSessionDto };

      mockSessionsService.update.mockResolvedValue(updatedSession);

      const result = await controller.update(sessionId, updateSessionDto);

      expect(result).toEqual(updatedSession);
      expect(service.update).toHaveBeenCalledWith(sessionId, updateSessionDto);
    });
  });

  describe('remove', () => {
    it('should remove a session', async () => {
      const sessionId = '123e4567-e89b-12d3-a456-426614174000';
      mockSessionsService.remove.mockResolvedValue(undefined);

      await controller.remove(sessionId);

      expect(service.remove).toHaveBeenCalledWith(sessionId);
    });
  });

  describe('addGame', () => {
    it('should add a game to a session', async () => {
      const sessionId = '123e4567-e89b-12d3-a456-426614174000';
      const gameId = 'game1';
      const updatedSession = { ...mockSession, games: [{ id: gameId }] };

      mockSessionsService.addGame.mockResolvedValue(updatedSession);

      const result = await controller.addGame(sessionId, gameId);

      expect(result).toEqual(updatedSession);
      expect(service.addGame).toHaveBeenCalledWith(sessionId, gameId);
    });
  });

  describe('getActiveSession', () => {
    it('should return the active session', async () => {
      mockSessionsService.getActiveSession.mockResolvedValue(mockSession);

      const result = await controller.getActiveSession();

      expect(result).toEqual(mockSession);
      expect(service.getActiveSession).toHaveBeenCalled();
    });
  });

  describe('endSession', () => {
    it('should end a session', async () => {
      const sessionId = '123e4567-e89b-12d3-a456-426614174000';
      const endedSession = { ...mockSession, isActive: false };

      mockSessionsService.endSession.mockResolvedValue(endedSession);

      const result = await controller.endSession(sessionId);

      expect(result).toEqual(endedSession);
      expect(service.endSession).toHaveBeenCalledWith(sessionId);
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
