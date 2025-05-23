import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, ArrayMinSize } from 'class-validator';

export class AddGamesDto {
  @ApiProperty({
    description: 'ID of the host who owns this session',
    example: 1,
  })
  @IsNumber()
  hostId: number;

  @ApiProperty({
    description: 'Array of game IDs to add to the session',
    example: [1, 2, 3],
    type: [Number],
    minItems: 1,
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  gameIds: number[];
}
