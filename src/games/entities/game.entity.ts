import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { GameAnalytics } from '../../analytics/entities/game-analytics.entity';
import { GameParticipant } from './game-participant.entity';
import { Session } from '../../sessions/entities/session.entity';

export enum GameState {
  SETUP = 'setup',
  READY = 'ready',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
}

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
    description: 'Current state of the game',
    enum: GameState,
    example: GameState.SETUP,
  })
  @Column({
    type: 'enum',
    enum: GameState,
    default: GameState.SETUP,
  })
  state: GameState;

  @ApiProperty({
    description: 'Current round number',
    example: 1,
    required: false,
  })
  @Column({ nullable: true })
  currentRound: number;

  @ApiProperty({
    description: 'Total number of rounds',
    example: 5,
    required: false,
  })
  @Column({ nullable: true })
  totalRounds: number;

  @ApiProperty({
    description: 'Analytics for this game',
    type: () => [GameAnalytics],
  })
  @OneToMany(() => GameAnalytics, (analytics) => analytics.game)
  analytics: GameAnalytics[];

  @ApiProperty({
    description: 'Participants in this game',
    type: () => [GameParticipant],
  })
  @OneToMany(() => GameParticipant, (participant) => participant.game)
  participants: GameParticipant[];

  @ApiProperty({
    description: 'Sessions this game belongs to',
    type: () => [Session],
  })
  @ManyToMany(() => Session, (session) => session.games)
  sessions: Session[];

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
