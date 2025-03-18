import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateGameRulesDto {
  @ApiProperty({
    description: 'Version number following semantic versioning (e.g., 1.0.0)',
    example: '1.0.0',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+\.\d+\.\d+$/, {
    message: 'Version must follow semantic versioning (e.g., 1.0.0)',
  })
  version: string;

  @ApiProperty({
    description: 'Title of the rules version',
    example: 'Standard Rules v1.0',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the rules',
    example: 'Complete set of rules for playing the game...',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'JSON structure containing the actual rules',
    example: {
      setup: ['Step 1', 'Step 2'],
      gameplay: ['Rule 1', 'Rule 2'],
      scoring: ['Point 1', 'Point 2'],
    },
  })
  @IsObject()
  @IsNotEmpty()
  rulesContent: Record<string, any>;

  @ApiProperty({
    description: 'Whether this should be the active version',
    example: true,
    required: false,
  })
  @IsOptional()
  isActive?: boolean;
}
