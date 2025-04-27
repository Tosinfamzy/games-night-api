import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { GameType } from '../entities/game.entity';

export class CreateGameDto {
  @ApiProperty({ description: 'The name of the game', example: 'UNO' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Type of game',
    enum: GameType,
    example: GameType.UNO,
  })
  @IsEnum(GameType)
  type: GameType;

  @ApiProperty({
    description: 'Description of the game',
    example: 'A classic card game where players race to empty their hands',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
