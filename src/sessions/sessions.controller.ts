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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { AssignPlayersDto } from './dto/assign-players.dto';
import { Session } from './entities/session.entity';

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
  findAll(): Promise<Session[]> {
    return this.sessionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get session details by ID' })
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
}
