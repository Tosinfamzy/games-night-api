import { ApiProperty } from '@nestjs/swagger';
import { Player } from '../../players/entities/player.entity';
import { Team } from '../../teams/entities/team.entity';
import { Session } from '../../sessions/entities/session.entity';
import { Game } from '../../games/entities/game.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Score {
  @ApiProperty({
    description: 'The unique identifier for the score',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The number of points awarded', example: 5 })
  @Column()
  points: number;

  @ApiProperty({ description: 'When the score was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Player, { nullable: true, onDelete: 'CASCADE' })
  player?: Player;

  @ManyToOne(() => Team, { nullable: true, onDelete: 'CASCADE' })
  team?: Team;

  @ManyToOne(() => Session, (session) => session.id, { onDelete: 'CASCADE' })
  session: Session;

  @ApiProperty({ description: 'The game this score belongs to' })
  @ManyToOne(() => Game, { onDelete: 'CASCADE' })
  game: Game;
}
