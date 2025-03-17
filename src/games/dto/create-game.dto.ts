import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateGameDto {
  @ApiProperty({ description: 'The name of the game', example: 'Charades' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Rules of the game',
    example: 'Act out a word without speaking',
    required: false,
  })
  @IsString()
  @IsOptional()
  rules?: string;
}
