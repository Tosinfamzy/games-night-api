import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { GamesService } from './games.service';
import { Game, GameState } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { GameSetupDto } from './dto/game-setup.dto';
import { PlayerReadyDto } from './dto/player-ready.dto';

@ApiTags('games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @ApiOperation({ summary: 'Get all games' })
  @ApiResponse({ status: 200, description: 'Return all games', type: [Game] })
  @Get()
  async findAll(): Promise<Game[]> {
    return this.gamesService.findAll();
  }

  @ApiOperation({ summary: 'Create a new game' })
  @ApiResponse({
    status: 201,
    description: 'Game created successfully',
    type: Game,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateGameDto })
  @Post()
  async create(@Body() createGameDto: CreateGameDto): Promise<Game> {
    return this.gamesService.create(createGameDto.name, createGameDto.rules);
  }

  @ApiOperation({ summary: 'Setup game configuration' })
  @ApiResponse({
    status: 200,
    description: 'Game setup completed successfully',
    type: Game,
  })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiBody({ type: GameSetupDto })
  @Post(':id/setup')
  async setupGame(
    @Param('id') id: number,
    @Body() setupDto: GameSetupDto,
  ): Promise<Game> {
    return this.gamesService.setupGame(id, setupDto);
  }

  @ApiOperation({ summary: 'Mark player as ready' })
  @ApiResponse({
    status: 200,
    description: 'Player ready status updated',
    type: Game,
  })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiBody({ type: PlayerReadyDto })
  @Post(':id/ready')
  async playerReady(
    @Param('id') id: number,
    @Body() readyDto: PlayerReadyDto,
  ): Promise<Game> {
    return this.gamesService.playerReady(id, readyDto.playerId);
  }

  @ApiOperation({ summary: 'Start the game' })
  @ApiResponse({
    status: 200,
    description: 'Game started successfully',
    type: Game,
  })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @Post(':id/start')
  async startGame(@Param('id') id: number): Promise<Game> {
    return this.gamesService.startGame(id);
  }

  @ApiOperation({ summary: 'Complete the game' })
  @ApiResponse({
    status: 200,
    description: 'Game completed successfully',
    type: Game,
  })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @Post(':id/complete')
  async completeGame(@Param('id') id: number): Promise<Game> {
    return this.gamesService.completeGame(id);
  }

  @ApiOperation({ summary: 'Update game state' })
  @ApiResponse({
    status: 200,
    description: 'Game state updated successfully',
    type: Game,
  })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @Put(':id/state')
  async updateGameState(
    @Param('id') id: number,
    @Body('state') state: GameState,
  ): Promise<Game> {
    return this.gamesService.updateGameState(id, state);
  }
}
