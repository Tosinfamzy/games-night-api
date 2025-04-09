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
    description: 'Name of the session',
    example: 'Friday Night Games',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  sessionName: string;

  @ApiProperty({
    description: 'ID of the host player creating the session',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  hostId: number;

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
