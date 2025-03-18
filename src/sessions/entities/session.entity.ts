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
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sessionName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.PENDING,
  })
  status: SessionStatus;

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

  @OneToMany(() => Player, (player) => player.session)
  players: Player[];

  @OneToMany(() => Team, (team) => team.session)
  teams: Team[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: 'Number of players in the session' })
  playerCount: number;

  @AfterLoad()
  countPlayers() {
    this.playerCount = this.players?.length || 0;
  }
}
