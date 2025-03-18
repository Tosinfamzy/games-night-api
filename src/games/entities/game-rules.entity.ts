import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Game } from './game.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class GameRules {
  @ApiProperty({
    description: 'Unique identifier of the game rules',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Version number of the rules',
    example: '1.0.0',
  })
  @Column()
  version: string;

  @ApiProperty({
    description: 'Title of the rules version',
    example: 'Standard Rules v1.0',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the rules',
    example: 'Complete set of rules for playing the game...',
  })
  @Column('text')
  description: string;

  @ApiProperty({
    description: 'JSON structure containing the actual rules',
    example: {
      setup: ['Step 1', 'Step 2'],
      gameplay: ['Rule 1', 'Rule 2'],
      scoring: ['Point 1', 'Point 2'],
    },
  })
  @Column('jsonb')
  rulesContent: Record<string, any>;

  @ApiProperty({
    description: 'Whether this is the current active version',
    example: true,
  })
  @Column({ default: false })
  isActive: boolean;

  @ApiProperty({
    description: 'The game these rules belong to',
    type: () => Game,
  })
  @ManyToOne(() => Game, (game) => game.rules)
  game: Game;

  @ApiProperty({
    description: 'When the rules were created',
    example: '2024-03-18T12:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'When the rules were last updated',
    example: '2024-03-18T12:00:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
