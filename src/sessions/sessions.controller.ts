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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
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
  @ApiOperation({ summary: 'Create a new game session' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Session created successfully',
    type: Session,
  })
  create(@Body() createSessionDto: CreateSessionDto): Promise<Session> {
    return this.sessionsService.create(createSessionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sessions' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all sessions',
    type: [Session],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findAll(): Promise<Session[]> {
    try {
      return await this.sessionsService.findAll();
    } catch (error) {
      console.error('Controller error fetching sessions:', error);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a session by ID' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Session details',
    type: Session,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  findOne(@Param('id') id: string): Promise<Session> {
    return this.sessionsService.findOne(+id);
  }

  @Get(':id/players')
  @ApiOperation({ summary: 'Get all players in a session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of players in the session',
    type: [Player],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  async getSessionPlayers(@Param('id') id: string): Promise<Player[]> {
    const session = await this.sessionsService.findOne(+id);
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
  update(
    @Param('id') id: string,
    @Body() updateSessionDto: UpdateSessionDto,
  ): Promise<Session> {
    return this.sessionsService.update(+id, updateSessionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete/End a session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Session deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.sessionsService.remove(+id);
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
    return this.sessionsService.assignPlayers(+id, assignPlayersDto);
  }

  @Post(':id/teams/random')
  @ApiOperation({ summary: 'Create random teams in a session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
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
  createRandomTeams(
    @Param('id') id: string,
    @Body('numberOfTeams') numberOfTeams: number,
  ): Promise<Session> {
    return this.sessionsService.createRandomTeams(+id, numberOfTeams);
  }

  @Post(':id/teams/custom')
  @ApiOperation({ summary: 'Create custom teams in a session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
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
  createCustomTeams(
    @Param('id') id: string,
    @Body('teams') teams: { teamName: string; playerIds: number[] }[],
  ): Promise<Session> {
    return this.sessionsService.createCustomTeams(+id, teams);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start a session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Session started successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid session state',
  })
  startSession(@Param('id') id: string): Promise<Session> {
    return this.sessionsService.startSession(+id);
  }

  @Post(':id/end')
  @ApiOperation({ summary: 'End a session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Session ended successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid session state',
  })
  endSession(@Param('id') id: string): Promise<Session> {
    return this.sessionsService.endSession(+id);
  }

  @Post(':id/next-game')
  @ApiOperation({ summary: 'Move to the next game in the session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Moved to next game successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'No more games available',
  })
  moveToNextGame(@Param('id') id: string): Promise<Session> {
    return this.sessionsService.moveToNextGame(+id);
  }

  @Put('teams/:id/players')
  @ApiOperation({ summary: 'Add a player to a team' })
  @ApiParam({ name: 'id', description: 'Team ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Player added to team successfully',
  })
  addPlayerToTeam(@Param('id') id: string, @Body() body: { playerId: number }) {
    return this.sessionsService.addPlayerToTeam(+id, body.playerId);
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
    return this.sessionsService.removePlayerFromTeam(+id, +playerId);
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
    return this.sessionsService.addGames(+id, addGamesDto);
  }
}
