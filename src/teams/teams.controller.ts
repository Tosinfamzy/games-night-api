import { Body, Controller, Post } from '@nestjs/common';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}
  @Post()
  async createTeam(@Body() body: { sessionId: number; name: string }) {
    return this.teamsService.createTeam(body.sessionId, body.name);
  }
}
