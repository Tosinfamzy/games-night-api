import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddPlayerDto {
  @ApiProperty({
    description: 'ID of the player to add to the game',
    example: 1,
  })
  @IsNumber()
  playerId: number;
} 