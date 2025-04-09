import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  ValidateNested,
  IsString,
  MinLength,
  MaxLength,
  ArrayMinSize,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class PlayerDto {
  @ApiProperty({
    description: 'Name of the player',
    example: 'John Doe',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;
}

export class AssignPlayersDto {
  @ApiProperty({
    description: 'ID of the host who owns this session',
    example: 1,
  })
  @IsNumber()
  hostId: number;

  @ApiProperty({
    description: 'Array of players to add to the session',
    type: [PlayerDto],
    example: [
      { name: 'John Doe' },
      { name: 'Jane Smith' },
      { name: 'Mike Johnson' },
    ],
    minItems: 1,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PlayerDto)
  players: PlayerDto[];
}
