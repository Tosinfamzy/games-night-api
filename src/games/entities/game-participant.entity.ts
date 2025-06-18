import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Game } from './game.entity';
import { Player } from '../../players/entities/player.entity';

export enum ParticipantStatus {
  JOINED = 'joined',
  READY = 'ready',
}

@Entity()
export class GameParticipant {
  @ApiProperty({
    description: 'The unique identifier for the game participant',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Current status of the participant',
    enum: ParticipantStatus,
    example: ParticipantStatus.JOINED,
  })
  @Column({
    type: 'enum',
    enum: ParticipantStatus,
    default: ParticipantStatus.JOINED,
  })
  status: ParticipantStatus;

  @ApiProperty({
    description: 'The game this participant is in',
    type: () => Game,
  })
  @ManyToOne(() => Game, (game) => game.participants, { onDelete: 'CASCADE' })
  game: Game;

  @ApiProperty({
    description: 'The player participating in the game',
    type: () => Player,
  })
  @ManyToOne(() => Player, { onDelete: 'CASCADE' })
  player: Player;

  @ApiProperty({
    description: 'When the participant joined',
    example: '2024-03-18T12:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'When the participant was last updated',
    example: '2024-03-18T12:00:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
