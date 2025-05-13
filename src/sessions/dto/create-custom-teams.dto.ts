import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  ValidateNested,
  IsInt,
  IsPositive,
  ArrayMinSize,
} from 'class-validator';

class TeamConfig {
  @ApiProperty({
    description: 'Name of the team',
    example: 'Team Alpha',
  })
  @IsString()
  teamName: string;

  @ApiProperty({
    description: 'Array of player IDs to assign to the team',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @ArrayMinSize(1)
  playerIds: number[];
}

export class CreateCustomTeamsDto {
  @ApiProperty({
    description: 'Array of team configurations with player assignments',
    type: [TeamConfig],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamConfig)
  @ArrayMinSize(1)
  teams: TeamConfig[];
}
