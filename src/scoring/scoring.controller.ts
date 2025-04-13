import { Controller, Post, Get, Body, Param, BadRequestException } from '@nestjs/common';
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

  @ApiOperation({ summary: 'Add points to a player in a specific game' })
  @ApiResponse({
    status: 201,
    description: 'Points added successfully',
    type: Score,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: PlayerScoreDto })
  @Post('/player')
  async addPointsToPlayer(@Body() body: PlayerScoreDto): Promise<Score> {
    return this.scoringService.addPointsToPlayer(body.playerId, body.gameId, body.points);
  }

  @ApiOperation({ summary: 'Add points to a team in a specific game' })
  @ApiResponse({
    status: 201,
    description: 'Points added successfully',
    type: Score,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: TeamScoreDto })
  @Post('/team')
  async addPointsToTeam(@Body() body: TeamScoreDto): Promise<Score> {
    return this.scoringService.addPointsToTeam(body.teamId, body.gameId, body.points);
  }

  @ApiOperation({ summary: 'Get leaderboard for a specific game in a session' })
  @ApiResponse({
    status: 200,
    description: 'Returned game leaderboard successfully',
  })
  @ApiParam({ name: 'sessionId', description: 'The session ID (UUID)', type: String })
  @ApiParam({ name: 'gameId', description: 'The game ID', type: Number })
  @Get('/leaderboard/:sessionId/:gameId')
  async getGameLeaderboard(
    @Param('sessionId') sessionId: string,
    @Param('gameId') gameId: number,
  ) {
    if (!this.isValidUuid(sessionId)) {
      throw new BadRequestException('sessionId must be a valid UUID');
    }
    return this.scoringService.getGameLeaderboard(sessionId, gameId);
  }

  @ApiOperation({ summary: 'Get aggregated scores for all games in a session' })
  @ApiResponse({
    status: 200,
    description: 'Returned session aggregated scores successfully',
  })
  @ApiParam({ name: 'sessionId', description: 'The session ID (UUID)', type: String })
  @Get('/session/:sessionId')
  async getSessionAggregatedScores(@Param('sessionId') sessionId: string) {
    if (!this.isValidUuid(sessionId)) {
      throw new BadRequestException('sessionId must be a valid UUID');
    }
    return this.scoringService.getSessionAggregatedScores(sessionId);
  }

  @ApiOperation({ summary: 'Subscribe to session updates' })
  @ApiResponse({ status: 200, description: 'Subscribed successfully' })
  @ApiParam({ name: 'sessionId', description: 'The session ID (UUID)', type: String })
  @Get('/subscribe/:sessionId')
  subscribe(@Param('sessionId') sessionId: string) {
    if (!this.isValidUuid(sessionId)) {
      throw new BadRequestException('sessionId must be a valid UUID');
    }
    this.scoreGateway.notifyScoreUpdate(sessionId);
    return { message: `Subscribed to session ${sessionId}` };
  }
  
  // Helper method to validate UUID format
  private isValidUuid(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
