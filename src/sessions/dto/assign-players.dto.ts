import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class PlayerDto {
  @ApiProperty({ description: 'Name of the player' })
  @IsString()
  name: string;
}

export class AssignPlayersDto {
  @ApiProperty({
    description: 'Array of players to add to the session',
    type: [PlayerDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlayerDto)
  players: PlayerDto[];
}
