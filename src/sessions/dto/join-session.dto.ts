import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class JoinSessionDto {
  @ApiProperty({
    description: 'The join code for the session',
    example: 'ABC123',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  joinCode: string;

  @ApiProperty({
    description: 'ID of the player joining the session',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  playerId: number;
}
