import { Body, Controller, Get, Post } from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  async getAllGames() {
    return this.gamesService.findAll();
  }

  @Post()
  async createGame(@Body() body: { name: string; rules?: string }) {
    return this.gamesService.create(body.name, body.rules);
  }
}
