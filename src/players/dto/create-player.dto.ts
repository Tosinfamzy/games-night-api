import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsEnum, IsOptional, IsUUID } from 'class-validator';
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
    description: 'Session ID to join',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'sessionId must be a valid UUID' })
  @IsNotEmpty()
  sessionId: string;

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
