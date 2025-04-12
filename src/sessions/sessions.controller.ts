import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Put,
  Query,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { AssignPlayersDto } from './dto/assign-players.dto';
import { Session } from './entities/session.entity';
import { AddGamesDto } from './dto/add-games.dto';
import { Player } from '../players/entities/player.entity';

@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new game session (Host only)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Session created successfully',
    type: Session,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Host player not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Only hosts can create sessions',
  })
  create(@Body() createSessionDto: CreateSessionDto): Promise<Session> {
    return this.sessionsService.create(createSessionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sessions for a host' })
  @ApiQuery({
    name: 'hostId',
    description: 'ID of the host',
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all sessions for the host',
    type: [Session],
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Only hosts can view sessions',
  })
  findAll(@Query('hostId') hostId: string): Promise<Session[]> {
    if (!hostId) {
      throw new BadRequestException('hostId parameter is required');
    }

    const parsedId = parseInt(hostId, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('hostId must be a valid number');
    }
    return this.sessionsService.findAll(parsedId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a session by ID' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiQuery({
    name: 'hostId',
    description: 'ID of the host',
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Session details',
    type: Session,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Only hosts can view sessions',
  })
  findOne(
    @Param('id') id: string,
    @Query('hostId') hostId: string,
  ): Promise<Session> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('id must be a valid number');
    }
    const parsedHostId = parseInt(hostId, 10);
    if (isNaN(parsedHostId)) {
      throw new BadRequestException('hostId must be a valid number');
    }
    return this.sessionsService.findOne(parsedId, parsedHostId);
  }

  @Get(':id/players')
  @ApiOperation({ summary: 'Get all players in a session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiQuery({
    name: 'hostId',
    description: 'ID of the host',
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of players in the session',
    type: [Player],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Only the host can view session players',
  })
  async getSessionPlayers(
    @Param('id') id: string,
    @Query('hostId') hostId: string,
  ): Promise<Player[]> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('id must be a valid number');
    }
    const parsedHostId = parseInt(hostId, 10);
    if (isNaN(parsedHostId)) {
      throw new BadRequestException('hostId must be a valid number');
    }
    const session = await this.sessionsService.findOne(parsedId, parsedHostId);
    return session.players;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update session details' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Session updated successfully',
    type: Session,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Only the host can update their sessions',
  })
  update(
    @Param('id') id: string,
    @Body() updateSessionDto: UpdateSessionDto,
  ): Promise<Session> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('id must be a valid number');
    }
    return this.sessionsService.update(parsedId, updateSessionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete/End a session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiQuery({
    name: 'hostId',
    description: 'ID of the host',
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Session deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Only the host can delete their sessions',
  })
  remove(
    @Param('id') id: string,
    @Query('hostId') hostId: string,
  ): Promise<void> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('id must be a valid number');
    }
    const parsedHostId = parseInt(hostId, 10);
    if (isNaN(parsedHostId)) {
      throw new BadRequestException('hostId must be a valid number');
    }
    return this.sessionsService.remove(parsedId, parsedHostId);
  }

  @Post(':id/players')
  @ApiOperation({ summary: 'Assign players to a session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Players assigned successfully',
    type: Session,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  assignPlayers(
    @Param('id') id: string,
    @Body() assignPlayersDto: AssignPlayersDto,
  ): Promise<Session> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('id must be a valid number');
    }
    return this.sessionsService.assignPlayers(parsedId, assignPlayersDto);
  }

  @Post(':id/teams/random')
  @ApiOperation({ summary: 'Create random teams in a session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiQuery({
    name: 'hostId',
    description: 'ID of the host',
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Teams created successfully',
    type: Session,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid number of teams',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Only the host can create teams in their sessions',
  })
  createRandomTeams(
    @Param('id') id: string,
    @Body('numberOfTeams') numberOfTeams: number,
    @Query('hostId') hostId: string,
  ): Promise<Session> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('id must be a valid number');
    }
    const parsedHostId = parseInt(hostId, 10);
    if (isNaN(parsedHostId)) {
      throw new BadRequestException('hostId must be a valid number');
    }
    return this.sessionsService.createRandomTeams(
      parsedId,
      numberOfTeams,
      parsedHostId,
    );
  }

  @Post(':id/teams/custom')
  @ApiOperation({ summary: 'Create custom teams in a session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiQuery({
    name: 'hostId',
    description: 'ID of the host',
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Teams created successfully',
    type: Session,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid team configuration',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Only the host can create teams in their sessions',
  })
  createCustomTeams(
    @Param('id') id: string,
    @Body('teams') teams: { teamName: string; playerIds: number[] }[],
    @Query('hostId') hostId: string,
  ): Promise<Session> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('id must be a valid number');
    }
    const parsedHostId = parseInt(hostId, 10);
    if (isNaN(parsedHostId)) {
      throw new BadRequestException('hostId must be a valid number');
    }
    return this.sessionsService.createCustomTeams(
      parsedId,
      teams,
      parsedHostId,
    );
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start a session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiQuery({
    name: 'hostId',
    description: 'ID of the host',
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Session started successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid session state',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Only the host can start their sessions',
  })
  startSession(
    @Param('id') id: string,
    @Query('hostId') hostId: string,
  ): Promise<Session> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('id must be a valid number');
    }
    const parsedHostId = parseInt(hostId, 10);
    if (isNaN(parsedHostId)) {
      throw new BadRequestException('hostId must be a valid number');
    }
    return this.sessionsService.startSession(parsedId, parsedHostId);
  }

  @Post(':id/end')
  @ApiOperation({ summary: 'End a session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiQuery({
    name: 'hostId',
    description: 'ID of the host',
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Session ended successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid session state',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Only the host can end their sessions',
  })
  endSession(
    @Param('id') id: string,
    @Query('hostId') hostId: string,
  ): Promise<Session> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('id must be a valid number');
    }
    const parsedHostId = parseInt(hostId, 10);
    if (isNaN(parsedHostId)) {
      throw new BadRequestException('hostId must be a valid number');
    }
    return this.sessionsService.endSession(parsedId, parsedHostId);
  }

  @Post(':id/next-game')
  @ApiOperation({ summary: 'Move to the next game in the session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiQuery({
    name: 'hostId',
    description: 'ID of the host',
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Moved to next game successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'No more games available',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Only the host can change games in their sessions',
  })
  moveToNextGame(
    @Param('id') id: string,
    @Query('hostId') hostId: string,
  ): Promise<Session> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('id must be a valid number');
    }
    const parsedHostId = parseInt(hostId, 10);
    if (isNaN(parsedHostId)) {
      throw new BadRequestException('hostId must be a valid number');
    }
    return this.sessionsService.moveToNextGame(parsedId, parsedHostId);
  }

  @Put('teams/:id/players')
  @ApiOperation({ summary: 'Add a player to a team' })
  @ApiParam({ name: 'id', description: 'Team ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Player added to team successfully',
  })
  addPlayerToTeam(@Param('id') id: string, @Body() body: { playerId: number }) {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('id must be a valid number');
    }
    return this.sessionsService.addPlayerToTeam(parsedId, body.playerId);
  }

  @Delete('teams/:id/players/:playerId')
  @ApiOperation({ summary: 'Remove a player from a team' })
  @ApiParam({ name: 'id', description: 'Team ID' })
  @ApiParam({ name: 'playerId', description: 'Player ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Player removed from team successfully',
  })
  removePlayerFromTeam(
    @Param('id') id: string,
    @Param('playerId') playerId: string,
  ) {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('id must be a valid number');
    }
    const parsedPlayerId = parseInt(playerId, 10);
    if (isNaN(parsedPlayerId)) {
      throw new BadRequestException('playerId must be a valid number');
    }
    return this.sessionsService.removePlayerFromTeam(parsedId, parsedPlayerId);
  }

  @Post(':id/games')
  @ApiOperation({ summary: 'Add games to an existing session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Games added successfully',
    type: Session,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot add games to non-pending session',
  })
  addGames(
    @Param('id') id: string,
    @Body() addGamesDto: AddGamesDto,
  ): Promise<Session> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('id must be a valid number');
    }
    return this.sessionsService.addGames(parsedId, addGamesDto);
  }
}
