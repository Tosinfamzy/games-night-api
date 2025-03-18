import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  HttpStatus,
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
import { Player } from './entities/player.entity';

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
          sessionId: 1,
        },
        description: 'Example of adding a new player',
      },
    },
  })
  async addPlayer(@Body() body: { sessionId: number; name: string }) {
    return this.playerService.addPlayer(body.sessionId, body.name);
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
}
