import { Session } from 'src/sessions/entities/session.entity';
import { Team } from 'src/teams/entities/team.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Session, (session) => session.players)
  session: Session;

  @ManyToOne(() => Team, (team) => team.players, { nullable: true })
  team?: Team;
}
