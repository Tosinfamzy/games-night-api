import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Session, SessionStatus } from './entities/session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { AssignPlayersDto } from './dto/assign-players.dto';
import { AddGamesDto } from './dto/add-games.dto';
import { Player } from '../players/entities/player.entity';
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

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    const session = this.sessionRepository.create({
      sessionName: createSessionDto.sessionName,
      isActive: createSessionDto.isActive,
      status: SessionStatus.PENDING,
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

  async addGames(id: number, addGamesDto: AddGamesDto): Promise<Session> {
    const session = await this.findOne(id);

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

    // Add new games to existing games
    session.games = [...(session.games || []), ...games];
    return this.sessionRepository.save(session);
  }

  async findAll(): Promise<Session[]> {
    return this.sessionRepository.find({
      relations: ['games', 'players', 'teams'],
    });
  }

  async findOne(id: number): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: ['games', 'players', 'teams', 'teams.players'],
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    return session;
  }

  async update(
    id: number,
    updateSessionDto: UpdateSessionDto,
  ): Promise<Session> {
    const session = await this.findOne(id);
    Object.assign(session, updateSessionDto);
    return this.sessionRepository.save(session);
  }

  async remove(id: number): Promise<void> {
    const session = await this.findOne(id);
    await this.sessionRepository.remove(session);
  }

  async assignPlayers(
    id: number,
    assignPlayersDto: AssignPlayersDto,
  ): Promise<Session> {
    const session = await this.findOne(id);

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

  async createRandomTeams(id: number, numberOfTeams: number): Promise<Session> {
    const session = await this.findOne(id);

    if (!session.players || session.players.length === 0) {
      throw new BadRequestException('No players in session to create teams');
    }

    if (numberOfTeams <= 0 || numberOfTeams > session.players.length) {
      throw new BadRequestException('Invalid number of teams');
    }

    // Clear existing teams
    if (session.teams) {
      await this.teamRepository.remove(session.teams);
    }

    // Shuffle players
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
    id: number,
    teams: { teamName: string; playerIds: number[] }[],
  ): Promise<Session> {
    const session = await this.findOne(id);

    // Clear existing teams
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

  async startSession(id: number): Promise<Session> {
    const session = await this.findOne(id);

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

  async endSession(id: number): Promise<Session> {
    const session = await this.findOne(id);

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

  async moveToNextGame(id: number): Promise<Session> {
    const session = await this.findOne(id);

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
}
