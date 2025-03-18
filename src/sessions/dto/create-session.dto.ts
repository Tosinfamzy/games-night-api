import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({ description: 'IDs of the games for this session' })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsNotEmpty()
  gameIds: number[];

  @ApiProperty({ description: 'Name of the session' })
  @IsString()
  @IsNotEmpty()
  sessionName: string;

  @ApiProperty({ description: 'Whether the session is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
