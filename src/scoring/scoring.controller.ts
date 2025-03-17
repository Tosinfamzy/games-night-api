import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { ScoreGateway } from 'src/gateways/score.gateway';

@Controller('scoring')
export class ScoringController {
  constructor(
    private readonly scoringService: ScoringService,
    private readonly scoreGateway: ScoreGateway,
  ) {}

  @Post('/player')
  async addPointsToPlayer(@Body() body: { playerId: number; points: number }) {
    return this.scoringService.addPointsToPlayer(body.playerId, body.points);
  }

  @Post('/team')
  async addPointsToTeam(@Body() body: { teamId: number; points: number }) {
    return this.scoringService.addPointsToTeam(body.teamId, body.points);
  }

  @Get('/leaderboard/:sessionId')
  async getLeaderboard(@Param('sessionId') sessionId: number) {
    return this.scoringService.getLeaderboard(sessionId);
  }

  @Get('/subscribe/:sessionId')
  subscribe(@Param('sessionId') sessionId: number) {
    this.scoreGateway.notifyScoreUpdate(sessionId);
    return { message: `Subscribed to session ${sessionId}` };
  }
}
