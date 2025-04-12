import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GameRulesService } from './game-rules.service';
import { CreateGameRulesDto } from './dto/create-game-rules.dto';
import { GameRules } from './entities/game-rules.entity';

@ApiTags('game-rules')
@Controller('games/:gameId/rules')
export class GameRulesController {
  constructor(private readonly gameRulesService: GameRulesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new game rules version' })
  @ApiParam({ name: 'gameId', description: 'ID of the game' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Game rules created successfully',
    type: GameRules,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Game not found',
  })
  async create(
    @Param('gameId') gameId: string,
    @Body() createGameRulesDto: CreateGameRulesDto,
  ): Promise<GameRules> {
    const parsedId = parseInt(gameId, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('gameId must be a valid number');
    }
    return this.gameRulesService.create(parsedId, createGameRulesDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all versions of game rules' })
  @ApiParam({ name: 'gameId', description: 'ID of the game' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all versions of game rules',
    type: [GameRules],
  })
  async findAll(@Param('gameId') gameId: string): Promise<GameRules[]> {
    const parsedId = parseInt(gameId, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('gameId must be a valid number');
    }
    return this.gameRulesService.findAll(parsedId);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active version of game rules' })
  @ApiParam({ name: 'gameId', description: 'ID of the game' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns active version of game rules',
    type: GameRules,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No active rules found',
  })
  async findActive(@Param('gameId') gameId: string): Promise<GameRules> {
    const parsedId = parseInt(gameId, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('gameId must be a valid number');
    }
    return this.gameRulesService.findActive(parsedId);
  }

  @Get(':version')
  @ApiOperation({ summary: 'Get specific version of game rules' })
  @ApiParam({ name: 'gameId', description: 'ID of the game' })
  @ApiParam({ name: 'version', description: 'Version number (e.g., 1.0.0)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns specific version of game rules',
    type: GameRules,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Version not found',
  })
  async findOne(
    @Param('gameId') gameId: string,
    @Param('version') version: string,
  ): Promise<GameRules> {
    const parsedId = parseInt(gameId, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('gameId must be a valid number');
    }
    return this.gameRulesService.findOne(parsedId, version);
  }

  @Post(':version/activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set specific version as active' })
  @ApiParam({ name: 'gameId', description: 'ID of the game' })
  @ApiParam({ name: 'version', description: 'Version number to activate' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Version activated successfully',
    type: GameRules,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Version not found',
  })
  async setActive(
    @Param('gameId') gameId: string,
    @Param('version') version: string,
  ): Promise<GameRules> {
    const parsedId = parseInt(gameId, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('gameId must be a valid number');
    }
    return this.gameRulesService.setActive(parsedId, version);
  }

  @Get(':version1/compare/:version2')
  @ApiOperation({ summary: 'Compare two versions of game rules' })
  @ApiParam({ name: 'gameId', description: 'ID of the game' })
  @ApiParam({ name: 'version1', description: 'First version to compare' })
  @ApiParam({ name: 'version2', description: 'Second version to compare' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns differences between versions',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'One or both versions not found',
  })
  async compareVersions(
    @Param('gameId') gameId: string,
    @Param('version1') version1: string,
    @Param('version2') version2: string,
  ) {
    const parsedId = parseInt(gameId, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('gameId must be a valid number');
    }
    return this.gameRulesService.compareVersions(parsedId, version1, version2);
  }
}
