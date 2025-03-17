import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PlayerScoreDto {
  @ApiProperty({
    description: 'The ID of the player to add points to',
    example: 1,
  })
  @IsNumber()
  playerId: number;

  @ApiProperty({ description: 'The number of points to add', example: 5 })
  @IsNumber()
  points: number;
}

export class TeamScoreDto {
  @ApiProperty({
    description: 'The ID of the team to add points to',
    example: 1,
  })
  @IsNumber()
  teamId: number;

  @ApiProperty({ description: 'The number of points to add', example: 10 })
  @IsNumber()
  points: number;
}
