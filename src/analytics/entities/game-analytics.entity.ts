import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Game } from '../../games/entities/game.entity';

@Entity()
export class GameAnalytics {
  @ApiProperty({
    description: 'The unique identifier for the analytics',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'The game these analytics belong to',
    type: () => Game,
  })
  @ManyToOne(() => Game, (game) => game.analytics)
  game: Game;

  @ApiProperty({
    description: 'Total number of times this game has been played',
    example: 100,
  })
  @Column({ default: 0 })
  totalPlays: number;

  @ApiProperty({
    description: 'Average duration of a game session in minutes',
    example: 45,
  })
  @Column('float', { default: 0 })
  averageDuration: number;

  @ApiProperty({
    description: 'Average number of players per session',
    example: 4,
  })
  @Column('float', { default: 0 })
  averagePlayers: number;

  @ApiProperty({
    description: 'Detailed statistics in JSON format',
    example: {
      winRates: { 'Player 1': 0.6, 'Player 2': 0.4 },
      commonStrategies: ['Aggressive', 'Defensive'],
      difficultyLevels: { easy: 0.3, medium: 0.5, hard: 0.2 },
    },
  })
  @Column('jsonb', { default: {} })
  statistics: Record<string, any>;

  @ApiProperty({
    description: 'When the analytics were created',
    example: '2024-03-18T12:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'When the analytics were last updated',
    example: '2024-03-18T12:00:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
