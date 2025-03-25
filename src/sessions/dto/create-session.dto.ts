import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  ArrayMinSize,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({
    description: 'Array of game IDs that will be played in this session',
    example: [1, 2, 3],
    type: [Number],
    minItems: 1,
    required: false,
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsOptional()
  gameIds?: number[];

  @ApiProperty({
    description: 'Name of the game session',
    example: 'Friday Night Games',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  sessionName: string;

  @ApiProperty({
    description: 'Whether the session is currently active',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
