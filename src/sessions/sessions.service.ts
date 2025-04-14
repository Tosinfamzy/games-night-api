import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Session, SessionStatus } from './entities/session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { AssignPlayersDto } from './dto/assign-players.dto';
import { AddGamesDto } from './dto/add-games.dto';
import { Player, PlayerType } from '../players/entities/player.entity';
import { Game } from '../games/entities/game.entity';
import { Team } from '../teams/entities/team.entity';
import { SessionsGateway } from './sessions.gateway';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    private readonly sessionsGateway: SessionsGateway,
  ) {}

  private generateJoinCode(): string {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }

  private async createUniqueJoinCode(): Promise<string> {
    let joinCode: string;
    let existingSession: Session;

    for (let i = 0; i < 10; i++) {
      joinCode = this.generateJoinCode();
      existingSession = await this.sessionRepository.findOne({
        where: { joinCode },
      });

      if (!existingSession) {
        return joinCode;
      }
    }

    throw new ConflictException(
      'Failed to generate a unique join code. Please try again.',
    );
  }

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    const host = await this.playerRepository.findOne({
      where: { id: createSessionDto.hostId },
    });

    if (!host) {
      throw new NotFoundException('Host player not found');
    }

    if (host.type !== PlayerType.HOST) {
      throw new ForbiddenException('Only hosts can create sessions');
    }

    const joinCode = await this.createUniqueJoinCode();

    const session = this.sessionRepository.create({
      sessionName: createSessionDto.sessionName,
      players: [host],
      hostId: host.id,
      isActive: true,
      status: SessionStatus.PENDING,
      joinCode,
    });

    if (createSessionDto.gameIds) {
      const games = await this.gameRepository.find({
        where: { id: In(createSessionDto.gameIds) },
      });

      if (games.length !== createSessionDto.gameIds.length) {
        throw new NotFoundException(
          `One or more games with IDs ${createSessionDto.gameIds.join(', ')} not found`,
        );
      }

      session.games = games;
    }

    return this.sessionRepository.save(session);
  }

  private async validateHostAccess(
    sessionId: string,
    hostId: number,
  ): Promise<void> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    if (session.hostId !== hostId) {
      throw new ForbiddenException('You do not have access to this session');
    }
  }

  async findAll(hostId: number): Promise<Session[]> {
    const host = await this.playerRepository.findOne({
      where: { id: hostId },
    });

    if (!host) {
      throw new NotFoundException('Host not found');
    }

    if (host.type !== PlayerType.HOST) {
      throw new ForbiddenException('Only hosts can view sessions');
    }

    return this.sessionRepository.find({
      where: { hostId },
      relations: ['games', 'players', 'teams'],
    });
  }

  async findOne(id: string, hostId: number): Promise<Session> {
    const host = await this.playerRepository.findOne({
      where: { id: hostId },
    });

    if (!host) {
      throw new NotFoundException('Host not found');
    }

    if (host.type !== PlayerType.HOST) {
      throw new ForbiddenException('Only hosts can view sessions');
    }

    const session = await this.sessionRepository.findOne({
      where: { id, hostId },
      relations: ['games', 'players', 'teams', 'teams.players'],
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    return session;
  }

  async addGames(id: string, addGamesDto: AddGamesDto): Promise<Session> {
    const session = await this.findOne(id, addGamesDto.hostId);

    if (session.status !== SessionStatus.PENDING) {
      throw new BadRequestException('Can only add games to a pending session');
    }

    const games = await this.gameRepository.find({
      where: { id: In(addGamesDto.gameIds) },
    });

    if (games.length !== addGamesDto.gameIds.length) {
      throw new NotFoundException(
        `One or more games with IDs ${addGamesDto.gameIds.join(', ')} not found`,
      );
    }

    session.games = [...(session.games || []), ...games];
    return this.sessionRepository.save(session);
  }

  async update(
    id: string,
    updateSessionDto: UpdateSessionDto,
  ): Promise<Session> {
    await this.findOne(id, updateSessionDto.hostId);
    const session = await this.sessionRepository.preload({
      id,
      ...updateSessionDto,
    });
    return this.sessionRepository.save(session);
  }

  async remove(id: string, hostId: number): Promise<void> {
    const session = await this.findOne(id, hostId);
    await this.sessionRepository.remove(session);
  }

  async assignPlayers(
    id: string,
    assignPlayersDto: AssignPlayersDto,
  ): Promise<Session> {
    const session = await this.findOne(id, assignPlayersDto.hostId);

    const newPlayers = await Promise.all(
      assignPlayersDto.players.map((playerDto) => {
        const player = this.playerRepository.create({
          name: playerDto.name,
          session,
        });
        return this.playerRepository.save(player);
      }),
    );

    session.players = [...(session.players || []), ...newPlayers];
    return this.sessionRepository.save(session);
  }

  async createRandomTeams(
    id: string,
    numberOfTeams: number,
    hostId: number,
  ): Promise<Session> {
    const session = await this.findOne(id, hostId);

    if (!session.players || session.players.length === 0) {
      throw new BadRequestException('No players in session to create teams');
    }

    if (numberOfTeams <= 0 || numberOfTeams > session.players.length) {
      throw new BadRequestException('Invalid number of teams');
    }

    if (session.teams) {
      await this.teamRepository.remove(session.teams);
    }

    const shuffledPlayers = [...session.players].sort(
      () => Math.random() - 0.5,
    );
    const playersPerTeam = Math.floor(session.players.length / numberOfTeams);
    const extraPlayers = session.players.length % numberOfTeams;

    const teams: Team[] = [];
    let playerIndex = 0;

    for (let i = 0; i < numberOfTeams; i++) {
      const teamSize = i < extraPlayers ? playersPerTeam + 1 : playersPerTeam;
      const teamPlayers = shuffledPlayers.slice(
        playerIndex,
        playerIndex + teamSize,
      );
      playerIndex += teamSize;

      const team = this.teamRepository.create({
        name: `Team ${i + 1}`,
        session,
        players: teamPlayers,
      });
      teams.push(await this.teamRepository.save(team));
    }

    session.teams = teams;
    return this.sessionRepository.save(session);
  }

  async createCustomTeams(
    id: string,
    teams: { teamName: string; playerIds: number[] }[],
    hostId: number,
  ): Promise<Session> {
    const session = await this.findOne(id, hostId);

    if (session.teams) {
      await this.teamRepository.remove(session.teams);
    }

    const newTeams = await Promise.all(
      teams.map(async (teamData) => {
        const players = await this.playerRepository.findByIds(
          teamData.playerIds,
        );
        if (players.length !== teamData.playerIds.length) {
          throw new BadRequestException('Some player IDs are invalid');
        }

        const team = this.teamRepository.create({
          name: teamData.teamName,
          session,
          players,
        });
        return this.teamRepository.save(team);
      }),
    );

    session.teams = newTeams;
    return this.sessionRepository.save(session);
  }

  async startSession(id: string, hostId: number): Promise<Session> {
    const session = await this.findOne(id, hostId);

    if (session.status !== SessionStatus.PENDING) {
      throw new BadRequestException(
        'Session can only be started from PENDING status',
      );
    }

    if (!session.games || session.games.length === 0) {
      throw new BadRequestException('Cannot start session without games');
    }

    if (!session.players || session.players.length === 0) {
      throw new BadRequestException('Cannot start session without players');
    }

    session.status = SessionStatus.IN_PROGRESS;
    session.currentGame = session.games[0];
    const updatedSession = await this.sessionRepository.save(session);

    this.sessionsGateway.notifySessionUpdate(id, 'sessionStarted', {
      status: SessionStatus.IN_PROGRESS,
      currentGame: session.currentGame,
    });

    return updatedSession;
  }

  async endSession(id: string, hostId: number): Promise<Session> {
    const session = await this.findOne(id, hostId);

    if (session.status === SessionStatus.COMPLETED) {
      throw new BadRequestException('Session is already completed');
    }

    session.status = SessionStatus.COMPLETED;
    session.isActive = false;
    const updatedSession = await this.sessionRepository.save(session);

    this.sessionsGateway.notifySessionUpdate(id, 'sessionEnded', {
      status: SessionStatus.COMPLETED,
    });

    return updatedSession;
  }

  async moveToNextGame(id: string, hostId: number): Promise<Session> {
    const session = await this.findOne(id, hostId);

    if (session.status !== SessionStatus.IN_PROGRESS) {
      throw new BadRequestException(
        'Session must be in progress to move to next game',
      );
    }

    const currentGameIndex = session.games.findIndex(
      (game) => game.id === session.currentGameId,
    );

    if (
      currentGameIndex === -1 ||
      currentGameIndex === session.games.length - 1
    ) {
      throw new BadRequestException('No more games available in this session');
    }

    session.currentGame = session.games[currentGameIndex + 1];
    const updatedSession = await this.sessionRepository.save(session);

    this.sessionsGateway.notifySessionUpdate(id, 'gameChanged', {
      currentGame: session.currentGame,
    });

    return updatedSession;
  }

  async addPlayerToTeam(teamId: number, playerId: number): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id: teamId },
      relations: ['players', 'session'],
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    const player = await this.playerRepository.findOne({
      where: { id: playerId },
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${playerId} not found`);
    }

    if (!team.players) {
      team.players = [];
    }

    team.players.push(player);
    const updatedTeam = await this.teamRepository.save(team);

    this.sessionsGateway.notifySessionUpdate(team.session.id, 'teamUpdated', {
      teamId,
      players: team.players,
    });

    return updatedTeam;
  }

  async removePlayerFromTeam(teamId: number, playerId: number): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id: teamId },
      relations: ['players', 'session'],
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    team.players = team.players.filter((player) => player.id !== playerId);
    const updatedTeam = await this.teamRepository.save(team);

    this.sessionsGateway.notifySessionUpdate(team.session.id, 'teamUpdated', {
      teamId,
      players: team.players,
    });

    return updatedTeam;
  }

  async joinSessionByCode(
    joinCode: string,
    playerId: number,
  ): Promise<Session> {
    const player = await this.playerRepository.findOne({
      where: { id: playerId },
    });

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    const session = await this.sessionRepository.findOne({
      where: { joinCode, isActive: true },
      relations: ['players'],
    });

    if (!session) {
      throw new NotFoundException(
        'Active session with this join code not found',
      );
    }

    if (session.status === SessionStatus.COMPLETED) {
      throw new BadRequestException('Cannot join a completed session');
    }

    const isPlayerInSession = session.players.some((p) => p.id === player.id);
    if (isPlayerInSession) {
      throw new BadRequestException('Player is already in this session');
    }

    player.session = session;
    await this.playerRepository.save(player);

    this.sessionsGateway.notifySessionUpdate(session.id, 'playerJoined', {
      playerId: player.id,
      playerName: player.name,
    });

    return this.sessionRepository.findOne({
      where: { id: session.id },
      relations: ['games', 'players', 'teams', 'teams.players'],
    });
  }

  async findSessionByCode(joinCode: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { joinCode, isActive: true },
      select: ['id', 'sessionName', 'hostId', 'status', 'joinCode'],
    });

    if (!session) {
      throw new NotFoundException(
        'Active session with this join code not found',
      );
    }

    return session;
  }
}
