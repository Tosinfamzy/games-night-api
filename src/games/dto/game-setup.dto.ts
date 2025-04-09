import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsObject, ValidateNested } from 'class-validator';

export class GameSetupDto {
  @ApiProperty({
    description: 'Total number of rounds for the game',
    example: 5,
  })
  @IsNumber()
  totalRounds: number;

  @ApiProperty({
    description: 'Game setup configuration',
    example: { timeLimit: 60 },
  })
  @IsObject()
  @ValidateNested()
  setup: Record<string, any>;
}
