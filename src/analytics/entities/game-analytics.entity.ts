import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Game } from 'src/games/entities/game.entity';

@Entity()
export class GameAnalytics {
  @ApiProperty({
    description: 'Unique identifier of the analytics record',
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
    example: 150,
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
    example: 4.5,
  })
  @Column('float', { default: 0 })
  averagePlayers: number;

  @ApiProperty({
    description: 'JSON object containing detailed statistics',
    example: {
      winRates: { 'Player 1': 0.65, 'Player 2': 0.35 },
      commonStrategies: ['Strategy A', 'Strategy B'],
      difficultyLevels: { easy: 0.2, medium: 0.5, hard: 0.3 },
    },
  })
  @Column('jsonb')
  statistics: Record<string, any>;

  @ApiProperty({
    description: 'When the analytics were last updated',
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
