import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  async createTeam(@Body() body: { sessionId: string; name: string }) {
    if (!this.isValidUuid(body.sessionId)) {
      throw new BadRequestException('sessionId must be a valid UUID');
    }
    return this.teamsService.createTeam(body.sessionId, body.name);
  }

  private isValidUuid(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
