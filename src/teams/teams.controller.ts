import { Body, Controller, Post, Get, Param, Delete, BadRequestException, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { AddPlayerToTeamDto } from './dto/add-player-to-team.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new team' })
  @ApiResponse({ status: 201, description: 'Team successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid session ID format' })
  async createTeam(@Body() body: { sessionId: string; name: string }) {
    if (!this.isValidUuid(body.sessionId)) {
      throw new BadRequestException('sessionId must be a valid UUID');
    }
    return this.teamsService.createTeam(body.sessionId, body.name);
  }

  @Get()
  @ApiOperation({ summary: 'Get all teams' })
  async findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get team by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.teamsService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Invalid team ID');
    }
  }

  @Get('session/:sessionId')
  @ApiOperation({ summary: 'Get teams by session ID' })
  @ApiParam({ name: 'sessionId', type: 'string' })
  async findBySessionId(@Param('sessionId') sessionId: string) {
    if (!this.isValidUuid(sessionId)) {
      throw new BadRequestException('sessionId must be a valid UUID');
    }
    return this.teamsService.findBySessionId(sessionId);
  }

  @Post(':id/players')
  @ApiOperation({ summary: 'Add a player to a team' })
  @ApiParam({ name: 'id', type: 'number' })
  async addPlayerToTeam(
    @Param('id', ParseIntPipe) teamId: number,
    @Body() addPlayerDto: AddPlayerToTeamDto
  ) {
    try {
      return await this.teamsService.addPlayerToTeam(teamId, addPlayerDto.playerId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id/players/:playerId')
  @ApiOperation({ summary: 'Remove a player from a team' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiParam({ name: 'playerId', type: 'number' })
  async removePlayerFromTeam(
    @Param('id', ParseIntPipe) teamId: number,
    @Param('playerId', ParseIntPipe) playerId: number
  ) {
    try {
      await this.teamsService.removePlayerFromTeam(teamId, playerId);
      return { success: true, message: 'Player removed from team' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a team' })
  @ApiParam({ name: 'id', type: 'number' })
  async deleteTeam(@Param('id', ParseIntPipe) teamId: number) {
    try {
      await this.teamsService.deleteTeam(teamId);
      return { success: true, message: 'Team deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  private isValidUuid(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
