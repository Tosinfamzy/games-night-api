import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameAnalytics } from './entities/game-analytics.entity';
import { Game } from '../games/entities/game.entity';
import { Session } from '../sessions/entities/session.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(GameAnalytics)
    private analyticsRepository: Repository<GameAnalytics>,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async updateGameAnalytics(gameId: number): Promise<GameAnalytics> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
    });

    if (!game) {
      throw new NotFoundException(`Game with ID ${gameId} not found`);
    }

    const sessions = await this.sessionRepository
      .createQueryBuilder('session')
      .innerJoin('session.games', 'game')
      .leftJoinAndSelect('session.players', 'players')
      .where('game.id = :gameId', { gameId })
      .getMany();

    const analytics = await this.calculateAnalytics(game, sessions);
    return this.saveAnalytics(game, analytics);
  }

  async getGameAnalytics(gameId: number): Promise<GameAnalytics> {
    const analytics = await this.analyticsRepository.findOne({
      where: { game: { id: gameId } },
      relations: ['game'],
    });

    if (!analytics) {
      return this.updateGameAnalytics(gameId);
    }

    return analytics;
  }

  private async calculateAnalytics(
    game: Game,
    sessions: Session[],
  ): Promise<Partial<GameAnalytics>> {
    const totalPlays = sessions.length;
    const totalDuration = sessions.reduce((sum, session) => {
      const duration = session.endTime
        ? (session.endTime.getTime() - session.startTime.getTime()) /
          (1000 * 60)
        : 0;
      return sum + duration;
    }, 0);
    const averageDuration = totalPlays > 0 ? totalDuration / totalPlays : 0;

    const totalPlayers = sessions.reduce(
      (sum, session) => sum + (session.players?.length || 0),
      0,
    );
    const averagePlayers = totalPlays > 0 ? totalPlayers / totalPlays : 0;

    const statistics = {
      winRates: this.calculateWinRates(sessions),
      difficultyLevels: this.analyzeDifficultyLevels(sessions),
      playerEngagement: this.analyzePlayerEngagement(sessions),
      timeDistribution: this.analyzeTimeDistribution(sessions),
    };

    return {
      totalPlays,
      averageDuration,
      averagePlayers,
      statistics,
    };
  }

  private async saveAnalytics(
    game: Game,
    analytics: Partial<GameAnalytics>,
  ): Promise<GameAnalytics> {
    let gameAnalytics = await this.analyticsRepository.findOne({
      where: { game: { id: game.id } },
    });

    if (!gameAnalytics) {
      gameAnalytics = this.analyticsRepository.create({
        game,
        ...analytics,
      });
    } else {
      Object.assign(gameAnalytics, analytics);
    }

    return this.analyticsRepository.save(gameAnalytics);
  }

  private calculateWinRates(sessions: Session[]): Record<string, number> {
    const winRates: Record<string, number> = {};
    const playerWins: Record<string, number> = {};
    const playerGames: Record<string, number> = {};

    sessions.forEach((session) => {
      session.players?.forEach((player) => {
        playerGames[player.name] = (playerGames[player.name] || 0) + 1;
        if (session.winner === player.name) {
          playerWins[player.name] = (playerWins[player.name] || 0) + 1;
        }
      });
    });

    Object.keys(playerGames).forEach((player) => {
      winRates[player] = playerWins[player] / playerGames[player];
    });

    return winRates;
  }

  private analyzeDifficultyLevels(sessions: Session[]): Record<string, number> {
    const levels: Record<string, number> = {
      easy: 0,
      medium: 0,
      hard: 0,
    };

    sessions.forEach((session) => {
      if (session.difficulty) {
        levels[session.difficulty] = (levels[session.difficulty] || 0) + 1;
      }
    });

    const total = Object.values(levels).reduce((sum, count) => sum + count, 0);
    if (total > 0) {
      Object.keys(levels).forEach((level) => {
        levels[level] = levels[level] / total;
      });
    }

    return levels;
  }

  private analyzePlayerEngagement(sessions: Session[]): Record<string, number> {
    const engagement: Record<string, number> = {};

    sessions.forEach((session) => {
      session.players?.forEach((player) => {
        const duration = session.endTime
          ? (session.endTime.getTime() - session.startTime.getTime()) /
            (1000 * 60)
          : 0;
        engagement[player.name] = (engagement[player.name] || 0) + duration;
      });
    });

    return engagement;
  }

  private analyzeTimeDistribution(sessions: Session[]): Record<string, number> {
    const distribution: Record<string, number> = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0,
    };

    sessions.forEach((session) => {
      if (session.startTime) {
        const hour = session.startTime.getHours();
        if (hour >= 5 && hour < 12) distribution.morning++;
        else if (hour >= 12 && hour < 17) distribution.afternoon++;
        else if (hour >= 17 && hour < 22) distribution.evening++;
        else distribution.night++;
      }
    });

    const total = Object.values(distribution).reduce(
      (sum, count) => sum + count,
      0,
    );
    if (total > 0) {
      Object.keys(distribution).forEach((time) => {
        distribution[time] = distribution[time] / total;
      });
    }

    return distribution;
  }
}
