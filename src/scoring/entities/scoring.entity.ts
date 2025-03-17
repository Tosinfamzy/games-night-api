import { Player } from 'src/players/entities/player.entity';
import { Session } from 'src/sessions/entities/session.entity';
import { Team } from 'src/teams/entities/team.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Player, { nullable: true, onDelete: 'CASCADE' })
  player?: Player;

  @ManyToOne(() => Team, { nullable: true, onDelete: 'CASCADE' })
  team?: Team;

  @ManyToOne(() => Session, (session) => session.id, { onDelete: 'CASCADE' })
  session: Session;

  @Column({ default: 0 })
  points: number;
}
