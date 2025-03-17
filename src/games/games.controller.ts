import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { GamesService } from './games.service';
import { Game } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';

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
}
