import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LookupSessionDto {
  @ApiProperty({
    description: 'The join code for the session',
    example: 'ABC123',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  joinCode: string;
}
