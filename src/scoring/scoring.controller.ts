import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ScoringService } from './scoring.service';

@Controller('scoring')
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

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
}
