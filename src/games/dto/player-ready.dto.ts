import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PlayerReadyDto {
  @ApiProperty({
    description: 'ID of the player marking themselves as ready',
    example: 1,
  })
  @IsNumber()
  playerId: number;
}
