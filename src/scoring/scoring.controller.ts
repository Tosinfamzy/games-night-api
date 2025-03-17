import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ScoringService } from './scoring.service';
import { ScoreGateway } from 'src/gateways/score.gateway';
import { PlayerScoreDto, TeamScoreDto } from './dto/score.dto';
import { Score } from './entities/scoring.entity';

@ApiTags('scoring')
@Controller('scoring')
export class ScoringController {
  constructor(
    private readonly scoringService: ScoringService,
    private readonly scoreGateway: ScoreGateway,
  ) {}

  @ApiOperation({ summary: 'Add points to a player' })
  @ApiResponse({
    status: 201,
    description: 'Points added successfully',
    type: Score,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: PlayerScoreDto })
  @Post('/player')
  async addPointsToPlayer(@Body() body: PlayerScoreDto): Promise<Score> {
    return this.scoringService.addPointsToPlayer(body.playerId, body.points);
  }

  @ApiOperation({ summary: 'Add points to a team' })
  @ApiResponse({
    status: 201,
    description: 'Points added successfully',
    type: Score,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: TeamScoreDto })
  @Post('/team')
  async addPointsToTeam(@Body() body: TeamScoreDto): Promise<Score> {
    return this.scoringService.addPointsToTeam(body.teamId, body.points);
  }

  @ApiOperation({ summary: 'Get leaderboard for a session' })
  @ApiResponse({
    status: 200,
    description: 'Returned leaderboard successfully',
  })
  @ApiParam({ name: 'sessionId', description: 'The session ID', type: Number })
  @Get('/leaderboard/:sessionId')
  async getLeaderboard(@Param('sessionId') sessionId: number) {
    return this.scoringService.getLeaderboard(sessionId);
  }

  @ApiOperation({ summary: 'Subscribe to session updates' })
  @ApiResponse({ status: 200, description: 'Subscribed successfully' })
  @ApiParam({ name: 'sessionId', description: 'The session ID', type: Number })
  @Get('/subscribe/:sessionId')
  subscribe(@Param('sessionId') sessionId: number) {
    this.scoreGateway.notifyScoreUpdate(sessionId);
    return { message: `Subscribed to session ${sessionId}` };
  }
}
