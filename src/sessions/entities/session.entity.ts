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
} from 'typeorm';
import { Game } from '../../games/entities/game.entity';
import { Player } from '../../players/entities/player.entity';
import { Team } from '../../teams/entities/team.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sessionName: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Game)
  @JoinTable({
    name: 'session_games',
    joinColumn: { name: 'sessionId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'gameId', referencedColumnName: 'id' },
  })
  games: Game[];

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
