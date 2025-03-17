import { Controller, Get, Post, Body } from '@nestjs/common';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  async getAllSessions() {
    return this.sessionsService.getSessions();
  }

  @Post()
  async createSession(@Body() body: { gameId: number }) {
    return this.sessionsService.createSession(body.gameId);
  }
}
