import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateHostPlayerDto {
  @ApiProperty({
    description: 'Name of the host player',
    example: 'John Doe',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Session ID to create the host for',
    example: 1,
  })
  @IsString()
  sessionId: string;
} 