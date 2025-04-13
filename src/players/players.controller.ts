import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player, PlayerType } from './entities/player.entity';
import { CreateHostPlayerDto } from './dto/create-host-player.dto';

@ApiTags('players')
@Controller('players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new player to a session' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Player added successfully',
    type: Player,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  @ApiBody({
    type: CreatePlayerDto,
    examples: {
      example1: {
        value: {
          name: 'John Doe',
          sessionId: '123e4567-e89b-12d3-a456-426614174000',
          type: PlayerType.PARTICIPANT,
        },
        description: 'Example of adding a new participant',
      },
      example2: {
        value: {
          name: 'Jane Host',
          sessionId: '123e4567-e89b-12d3-a456-426614174000',
          type: PlayerType.HOST,
        },
        description: 'Example of adding a host',
      },
    },
  })
  async addPlayer(
    @Body() body: { sessionId: string; name: string; type?: PlayerType },
  ) {
    if (!this.isValidUuid(body.sessionId)) {
      throw new BadRequestException('sessionId must be a valid UUID');
    }
    return this.playerService.addPlayer(body.sessionId, body.name, body.type);
  }

  @Post('host')
  @ApiOperation({ summary: 'Create a new host player' })
  @ApiBody({ type: CreateHostPlayerDto })
  @ApiResponse({
    status: 201,
    description: 'The host player has been successfully created.',
    type: Player,
  })
  @ApiResponse({
    status: 404,
    description: 'Session not found.',
  })
  createHost(
    @Body() createHostPlayerDto: CreateHostPlayerDto,
  ): Promise<Player> {
    return this.playerService.createHost(createHostPlayerDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a player by ID' })
  @ApiParam({ name: 'id', description: 'Player ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Player found successfully',
    type: Player,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  async getPlayer(@Param('id') id: string) {
    return this.playerService.findOne(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a player from a session' })
  @ApiParam({ name: 'id', description: 'Player ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Player removed successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Player not found',
  })
  async removePlayer(@Param('id') id: string) {
    return this.playerService.remove(+id);
  }

  // Helper method to validate UUID format
  private isValidUuid(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
