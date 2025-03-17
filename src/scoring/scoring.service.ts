import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from './entities/scoring.entity';
import { Player } from 'src/players/entities/player.entity';
import { Team } from 'src/teams/entities/team.entity';
import { Session } from 'src/sessions/entities/session.entity';
import { ScoreGateway } from 'src/gateways/score.gateway';

@Injectable()
export class ScoringService {
  constructor(
    @InjectRepository(Score)
    private scoreRepository: Repository<Score>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @Inject(forwardRef(() => ScoreGateway))
    private readonly scoreGateway: ScoreGateway,
  ) {}

  async addPointsToPlayer(playerId: number, points: number): Promise<Score> {
    const player = await this.playerRepository.findOne({
      where: { id: playerId },
      relations: ['session'],
    });
    if (!player) throw new Error('Player not found');

    const session = player.session;
    const score = this.scoreRepository.create({ player, session, points });
    await this.scoreRepository.save(score);

    this.scoreGateway.notifyScoreUpdate(session.id);
    return score;
  }

  async addPointsToTeam(teamId: number, points: number): Promise<Score> {
    const team = await this.teamRepository.findOne({
      where: { id: teamId },
      relations: ['session'],
    });
    if (!team) throw new Error('Team not found');

    const session = team.session;
    const score = this.scoreRepository.create({ team, session, points });
    await this.scoreRepository.save(score);

    this.scoreGateway.notifyScoreUpdate(session.id);
    return score;
  }

  async getLeaderboard(sessionId: number) {
    return this.scoreRepository
      .createQueryBuilder('score')
      .leftJoinAndSelect('score.player', 'player')
      .leftJoinAndSelect('score.team', 'team')
      .where('score.sessionId = :sessionId', { sessionId })
      .select([
        'player.name AS playerName',
        'team.name AS teamName',
        'SUM(score.points) AS totalPoints',
      ])
      .groupBy('player.id, team.id')
      .orderBy('totalPoints', 'DESC')
      .getRawMany();
  }
}
