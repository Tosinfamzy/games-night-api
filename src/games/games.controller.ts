import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
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
import { AddPlayerDto } from './dto/add-player.dto';
import { GameParticipant, ParticipantStatus } from './entities/game-participant.entity';

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

  @Get(':id/players')
  @ApiOperation({ summary: 'Get all players in a specific game' })
  @ApiResponse({
    status: 200,
    description: 'Returns all players in the game with their status and session info',
    schema: {
      type: 'object',
      properties: {
        players: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              status: { 
                type: 'string',
                enum: Object.values(ParticipantStatus)
              },
              joinedAt: { type: 'string', format: 'date-time' },
              session: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  sessionName: { type: 'string' }
                }
              }
            }
          }
        },
        total: { type: 'number' }
      }
    }
  })
  @ApiParam({ name: 'id', description: 'Game ID' })
  async getGamePlayers(@Param('id') id: string) {
    return this.gamesService.getGamePlayers(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new game' })
  @ApiResponse({
    status: 201,
    description: 'Game created successfully',
    type: Game,
  })
  @ApiBody({
    type: CreateGameDto,
    description: 'Game creation data',
  })
  async create(@Body() createGameDto: CreateGameDto): Promise<Game> {
    return this.gamesService.create(createGameDto.name, createGameDto.rules);
  }

  @Put(':id/setup')
  @ApiOperation({ summary: 'Setup a game with initial configuration' })
  @ApiResponse({
    status: 200,
    description: 'Game setup successfully',
    type: Game,
  })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiBody({ type: GameSetupDto })
  async setup(
    @Param('id') id: string,
    @Body() setupDto: GameSetupDto,
  ): Promise<Game> {
    return this.gamesService.setupGame(+id, setupDto);
  }

  @Post(':id/players')
  @ApiOperation({ summary: 'Add a player to a game' })
  @ApiResponse({
    status: 201,
    description: 'Player added to game successfully',
    type: GameParticipant,
  })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiBody({ type: AddPlayerDto })
  async addPlayer(
    @Param('id') id: string,
    @Body() addPlayerDto: AddPlayerDto,
  ): Promise<GameParticipant> {
    return this.gamesService.addPlayer(+id, addPlayerDto.playerId);
  }

  @Put(':id/players/:playerId/ready')
  @ApiOperation({ summary: 'Mark a player as ready in a game' })
  @ApiResponse({
    status: 200,
    description: 'Player marked as ready successfully',
    type: GameParticipant,
  })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiParam({ name: 'playerId', description: 'Player ID' })
  async playerReady(
    @Param('id') id: string,
    @Param('playerId') playerId: string,
  ): Promise<GameParticipant> {
    return this.gamesService.playerReady(+id, +playerId);
  }

  @Delete(':id/players/:playerId')
  @ApiOperation({ summary: 'Remove a player from a game' })
  @ApiResponse({
    status: 200,
    description: 'Player removed from game successfully',
  })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiParam({ name: 'playerId', description: 'Player ID' })
  async removePlayer(
    @Param('id') id: string,
    @Param('playerId') playerId: string,
  ): Promise<void> {
    return this.gamesService.removePlayer(+id, +playerId);
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
