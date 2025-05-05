import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { Session } from 'src/sessions/entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { TeamsGateway } from 'src/gateways/teams.gateway';
import { Player } from 'src/players/entities/player.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @Inject(forwardRef(() => TeamsGateway))
    private readonly teamsGateway: TeamsGateway,
  ) {}

  async createTeam(sessionId: string, name: string): Promise<Team> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });
    if (!session) throw new Error('Session not found');

    const team = this.teamRepository.create({ name, session });
    const savedTeam = await this.teamRepository.save(team);

    // Notify session participants that a new team was created
    this.teamsGateway.notifyTeamUpdate(savedTeam.id, 'teamCreated', {
      id: savedTeam.id,
      name: savedTeam.name,
      sessionId,
    });

    return savedTeam;
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['players', 'session'],
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return team;
  }

  async findAll(): Promise<Team[]> {
    return this.teamRepository.find({
      relations: ['players', 'session'],
    });
  }

  async findBySessionId(sessionId: string): Promise<Team[]> {
    return this.teamRepository.find({
      where: {
        session: { id: sessionId },
      },
      relations: ['players'],
    });
  }

  async addPlayerToTeam(teamId: number, playerId: number): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id: teamId },
      relations: ['players'],
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

    // Update player's team
    player.team = team;
    await this.playerRepository.save(player);

    // Reload the team with updated players
    const updatedTeam = await this.teamRepository.findOne({
      where: { id: teamId },
      relations: ['players'],
    });

    // Notify team members about the new player
    this.teamsGateway.notifyTeamUpdate(teamId, 'playerJoined', {
      playerId,
      playerName: player.name,
      teamId,
    });

    return updatedTeam;
  }

  async removePlayerFromTeam(teamId: number, playerId: number): Promise<void> {
    const player = await this.playerRepository.findOne({
      where: { id: playerId },
      relations: ['team'],
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${playerId} not found`);
    }

    if (!player.team || player.team.id !== teamId) {
      throw new Error(
        `Player with ID ${playerId} is not in team with ID ${teamId}`,
      );
    }

    // Store player name before removing from team
    const playerName = player.name;

    // Remove player from team
    player.team = null;
    await this.playerRepository.save(player);

    // Notify team members about the player leaving
    this.teamsGateway.notifyTeamUpdate(teamId, 'playerLeft', {
      playerId,
      playerName,
      teamId,
    });
  }

  async deleteTeam(teamId: number): Promise<void> {
    const team = await this.teamRepository.findOne({
      where: { id: teamId },
      relations: ['players', 'session'],
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    const sessionId = team.session?.id;

    // Remove team reference from all players
    if (team.players) {
      for (const player of team.players) {
        player.team = null;
        await this.playerRepository.save(player);
      }
    }

    // Delete the team
    await this.teamRepository.remove(team);

    // Notify about team deletion
    this.teamsGateway.notifyTeamUpdate(teamId, 'teamDeleted', {
      teamId,
      sessionId,
    });
  }
}
