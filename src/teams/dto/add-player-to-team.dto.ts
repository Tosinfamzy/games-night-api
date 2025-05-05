import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class AddPlayerToTeamDto {
  @ApiProperty({
    description: 'Player ID to add to the team',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  playerId: number;
}
