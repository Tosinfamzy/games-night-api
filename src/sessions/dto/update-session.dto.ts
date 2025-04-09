import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';

export class UpdateSessionDto {
  @ApiProperty({
    description: 'ID of the host who owns this session',
    example: 1,
  })
  @IsNumber()
  hostId: number;

  @ApiProperty({
    description: 'New name for the game session',
    example: 'Saturday Night Bash',
    minLength: 3,
    maxLength: 100,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  sessionName?: string;

  @ApiProperty({
    description: 'Whether the session is currently active',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
