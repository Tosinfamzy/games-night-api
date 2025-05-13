import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  AfterLoad,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Game } from '../../games/entities/game.entity';
import { Player } from '../../players/entities/player.entity';
import { Team } from '../../teams/entities/team.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum SessionStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity('sessions')
export class Session {
  @ApiProperty({
    description: 'Unique identifier of the session',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'ID of the host who created this session',
    example: 1,
  })
  @Column({ nullable: true })
  hostId: number;

  @ApiProperty({
    description: 'Name of the session',
    example: 'Friday Night Games',
  })
  @Column()
  sessionName: string;

  @ApiProperty({
    description: 'Whether the session is currently active',
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Unique join code for players to join this session',
    example: 'ABC123',
  })
  @Column({ unique: true, nullable: true })
  joinCode: string;

  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.IN_PROGRESS,
  })
  status: SessionStatus;

  @ApiProperty({
    description: 'Games included in this session',
    type: () => [Game],
  })
  @ManyToMany(() => Game)
  @JoinTable({
    name: 'session_games',
    joinColumn: { name: 'sessionId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'gameId', referencedColumnName: 'id' },
  })
  games: Game[];

  @ManyToOne(() => Game, { nullable: true })
  @JoinColumn({ name: 'currentGameId' })
  currentGame: Game;

  @Column({ nullable: true })
  currentGameId: number;

  @ApiProperty({
    description: 'Players participating in this session',
    type: () => [Player],
  })
  @OneToMany(() => Player, (player) => player.session)
  players: Player[];

  @OneToMany(() => Team, (team) => team.session)
  teams: Team[];

  @ApiProperty({
    description: 'When the session started',
    example: '2024-03-18T19:00:00Z',
    required: false,
  })
  @Column({ nullable: true })
  startTime: Date;

  @ApiProperty({
    description: 'When the session ended',
    example: '2024-03-18T23:00:00Z',
    required: false,
  })
  @Column({ nullable: true })
  endTime: Date;

  @ApiProperty({
    description: 'Winner of the session',
    example: 'Player 1',
    required: false,
  })
  @Column({ nullable: true })
  winner: string;

  @ApiProperty({
    description: 'When the session was created',
    example: '2024-03-18T18:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'When the session was last updated',
    example: '2024-03-18T23:00:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Number of players in the session' })
  playerCount: number;

  @AfterLoad()
  countPlayers() {
    this.playerCount = this.players?.length || 0;
  }
}
