import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GameSetupDto {
  @ApiProperty({
    description: 'Total number of rounds for the game',
    example: 5,
  })
  @IsNumber()
  totalRounds: number;

  @ApiProperty({
    description: 'Additional game configuration in JSON format',
    example: { timeLimit: 60, difficulty: 'medium' },
    required: false,
  })
  @IsOptional()
  @IsString()
  config?: string;
}
