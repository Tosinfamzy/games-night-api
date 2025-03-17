import { Controller, Post, Body } from '@nestjs/common';
import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}

  @Post()
  async addPlayer(@Body() body: { sessionId: number; name: string }) {
    return this.playerService.addPlayer(body.sessionId, body.name);
  }
}
