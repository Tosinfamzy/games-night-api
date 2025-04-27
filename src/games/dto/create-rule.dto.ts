import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateRuleDto {
  @ApiProperty({
    description: 'Name of the rule',
    example: 'No Stacking',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of what the rule does',
    example: 'Players cannot stack +2 or +4 cards',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Whether this rule is enabled by default',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isDefaultEnabled?: boolean;
}
