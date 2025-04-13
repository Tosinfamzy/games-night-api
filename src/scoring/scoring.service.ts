import { Injectable, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from './entities/scoring.entity';
import { Player } from 'src/players/entities/player.entity';
import { Team } from 'src/teams/entities/team.entity';
import { Session } from 'src/sessions/entities/session.entity';
import { Game } from 'src/games/entities/game.entity';
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
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @Inject(forwardRef(() => ScoreGateway))
    private readonly scoreGateway: ScoreGateway,
  ) {}

  async addPointsToPlayer(playerId: number, gameId: number, points: number): Promise<Score> {
    const player = await this.playerRepository.findOne({
      where: { id: playerId },
      relations: ['session'],
    });
    if (!player) throw new Error('Player not found');

    const game = await this.gameRepository.findOne({
      where: { id: gameId },
    });
    if (!game) throw new Error('Game not found');

    const session = player.session;
    const score = this.scoreRepository.create({ player, session, game, points });
    await this.scoreRepository.save(score);

    this.scoreGateway.notifyScoreUpdate(session.id);
    return score;
  }

  async addPointsToTeam(teamId: number, gameId: number, points: number): Promise<Score> {
    const team = await this.teamRepository.findOne({
      where: { id: teamId },
      relations: ['session'],
    });
    if (!team) throw new Error('Team not found');

    const game = await this.gameRepository.findOne({
      where: { id: gameId },
    });
    if (!game) throw new Error('Game not found');

    const session = team.session;
    const score = this.scoreRepository.create({ team, session, game, points });
    await this.scoreRepository.save(score);

    this.scoreGateway.notifyScoreUpdate(session.id);
    return score;
  }

  async getGameLeaderboard(sessionId: string, gameId: number) {
    return this.scoreRepository
      .createQueryBuilder('score')
      .leftJoinAndSelect('score.player', 'player')
      .leftJoinAndSelect('score.team', 'team')
      .where('score.sessionId = :sessionId', { sessionId })
      .andWhere('score.gameId = :gameId', { gameId })
      .select([
        'player.name AS playerName',
        'team.name AS teamName',
        'SUM(score.points) AS totalPoints',
      ])
      .groupBy('player.id, team.id')
      .orderBy('totalPoints', 'DESC')
      .getRawMany();
  }

  async getSessionAggregatedScores(sessionId: string) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['games'],
    });
    if (!session) throw new NotFoundException(`Session with ID ${sessionId} not found`);

    const playerScores = await this.scoreRepository
      .createQueryBuilder('score')
      .leftJoinAndSelect('score.player', 'player')
      .leftJoinAndSelect('score.game', 'game')
      .where('score.sessionId = :sessionId', { sessionId })
      .andWhere('score.player IS NOT NULL')
      .select([
        'player.id AS playerId',
        'player.name AS playerName',
        'game.id AS gameId',
        'game.name AS gameName',
        'SUM(score.points) AS gamePoints',
      ])
      .groupBy('player.id, player.name, game.id, game.name')
      .getRawMany();

    const teamScores = await this.scoreRepository
      .createQueryBuilder('score')
      .leftJoinAndSelect('score.team', 'team')
      .leftJoinAndSelect('score.game', 'game')
      .where('score.sessionId = :sessionId', { sessionId })
      .andWhere('score.team IS NOT NULL')
      .select([
        'team.id AS teamId',
        'team.name AS teamName',
        'game.id AS gameId',
        'game.name AS gameName',
        'SUM(score.points) AS gamePoints',
      ])
      .groupBy('team.id, team.name, game.id, game.name')
      .getRawMany();

    // Calculate total scores across all games
    const playerTotalScores = playerScores.reduce((acc, score) => {
      if (!acc[score.playerId]) {
        acc[score.playerId] = {
          playerId: score.playerId,
          playerName: score.playerName,
          totalPoints: 0,
          gameScores: [],
        };
      }
      acc[score.playerId].totalPoints += parseInt(score.gamePoints);
      acc[score.playerId].gameScores.push({
        gameId: score.gameId,
        gameName: score.gameName,
        points: parseInt(score.gamePoints),
      });
      return acc;
    }, {});

    const teamTotalScores = teamScores.reduce((acc, score) => {
      if (!acc[score.teamId]) {
        acc[score.teamId] = {
          teamId: score.teamId,
          teamName: score.teamName,
          totalPoints: 0,
          gameScores: [],
        };
      }
      acc[score.teamId].totalPoints += parseInt(score.gamePoints);
      acc[score.teamId].gameScores.push({
        gameId: score.gameId,
        gameName: score.gameName,
        points: parseInt(score.gamePoints),
      });
      return acc;
    }, {});

    return {
      players: Object.values(playerTotalScores),
      teams: Object.values(teamTotalScores),
    };
  }
}
