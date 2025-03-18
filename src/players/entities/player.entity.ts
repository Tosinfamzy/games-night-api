import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Session } from '../../sessions/entities/session.entity';
import { Team } from 'src/teams/entities/team.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Player {
  @ApiProperty({
    description: 'Unique identifier of the player',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Name of the player',
    example: 'John Doe',
    minLength: 2,
    maxLength: 50,
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Strategy used by the player',
    example: 'Aggressive',
    required: false,
  })
  @Column({ nullable: true })
  strategy: string;

  @ApiProperty({
    description: 'The session this player belongs to',
    type: () => Session,
  })
  @ManyToOne(() => Session, (session) => session.players)
  session: Session;

  @ApiProperty({
    description: 'The team this player belongs to (if any)',
    type: () => Team,
    nullable: true,
  })
  @ManyToOne(() => Team, (team) => team.players, { nullable: true })
  team?: Team;

  @ApiProperty({
    description: 'When the player was created',
    example: '2024-03-18T19:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'When the player was last updated',
    example: '2024-03-18T23:00:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
