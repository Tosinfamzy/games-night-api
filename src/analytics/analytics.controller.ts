import { Controller, Get, Param, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { GameAnalytics } from './entities/game-analytics.entity';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('games/:gameId')
  @ApiOperation({ summary: 'Get analytics for a specific game' })
  @ApiParam({ name: 'gameId', description: 'ID of the game' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns game analytics',
    type: GameAnalytics,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Game not found',
  })
  async getGameAnalytics(
    @Param('gameId') gameId: string,
  ): Promise<GameAnalytics> {
    return this.analyticsService.getGameAnalytics(+gameId);
  }

  @Get('games/:gameId/update')
  @ApiOperation({ summary: 'Force update analytics for a specific game' })
  @ApiParam({ name: 'gameId', description: 'ID of the game' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns updated game analytics',
    type: GameAnalytics,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Game not found',
  })
  async updateGameAnalytics(
    @Param('gameId') gameId: string,
  ): Promise<GameAnalytics> {
    return this.analyticsService.updateGameAnalytics(+gameId);
  }
}
