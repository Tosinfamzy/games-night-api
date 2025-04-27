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

@Entity()
export class Rule {
  @ApiProperty({
    description: 'Unique identifier of the rule',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Name of the rule',
    example: 'No Stacking',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Description of what the rule does',
    example: 'Players cannot stack +2 or +4 cards',
  })
  @Column('text')
  description: string;

  @ApiProperty({
    description: 'Whether this rule is enabled by default',
    example: true,
  })
  @Column({ default: true })
  isDefaultEnabled: boolean;

  @ApiProperty({
    description: 'The game this rule belongs to',
    type: () => Game,
  })
  @ManyToOne(() => Game, (game) => game.rules, { onDelete: 'CASCADE' })
  game: Game;

  @ApiProperty({
    description: 'When the rule was created',
    example: '2024-03-18T12:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'When the rule was last updated',
    example: '2024-03-18T12:00:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
