import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateSessionDto {
  @ApiProperty({ description: 'Name of the session', required: false })
  @IsString()
  @IsOptional()
  sessionName?: string;

  @ApiProperty({
    description: 'Whether the session is active',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
