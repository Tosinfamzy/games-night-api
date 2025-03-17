import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Game {
  @ApiProperty({
    description: 'The unique identifier for the game',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The name of the game', example: 'Charades' })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Rules of the game',
    example: 'Act out a word without speaking',
    required: false,
  })
  @Column({ nullable: true })
  rules: string;
}
