import { Player } from 'src/players/entities/player.entity';
import { Session } from 'src/sessions/entities/session.entity';
import { PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Session, (session) => session.teams, { onDelete: 'CASCADE' })
  session: Session;

  @OneToMany(() => Player, (player) => player.team, { cascade: true })
  players: Player[];
}
