import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { GameAnalytics } from '../../analytics/entities/game-analytics.entity';

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

  @ApiProperty({
    description: 'Analytics for this game',
    type: () => [GameAnalytics],
  })
  @OneToMany(() => GameAnalytics, (analytics) => analytics.game)
  analytics: GameAnalytics[];

  @ApiProperty({
    description: 'When the game was created',
    example: '2024-03-18T12:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'When the game was last updated',
    example: '2024-03-18T12:00:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
