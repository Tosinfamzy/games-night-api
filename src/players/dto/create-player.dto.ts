import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsEnum, IsOptional } from 'class-validator';
import { PlayerType } from '../entities/player.entity';

export class CreatePlayerDto {
  @ApiProperty({
    description: 'Name of the player',
    example: 'John Doe',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Type of player (host or participant)',
    enum: PlayerType,
    example: PlayerType.PARTICIPANT,
    required: false,
  })
  @IsEnum(PlayerType)
  @IsOptional()
  type?: PlayerType;
}
