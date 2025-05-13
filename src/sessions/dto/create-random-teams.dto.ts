import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Min, Max } from 'class-validator';

export class CreateRandomTeamsDto {
  @ApiProperty({
    description: 'Number of teams to create randomly',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  numberOfTeams: number;
}
