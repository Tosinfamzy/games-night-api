import { Game } from 'src/games/entities/game.entity';
import { Player } from 'src/players/entities/player.entity';
import { Team } from 'src/teams/entities/team.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
} from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Game, { eager: true }) // Fetch game details automatically
  game: Game;

  @OneToMany(() => Player, (player) => player.session, { cascade: true })
  players: Player[];

  @OneToMany(() => Team, (team) => team.session, { cascade: true })
  teams: Team[];

  @Column({ default: true })
  isActive: boolean;
}
