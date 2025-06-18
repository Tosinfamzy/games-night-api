import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameRules } from './entities/game-rules.entity';
import { CreateGameRulesDto } from './dto/create-game-rules.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GameRulesService {
  constructor(
    @InjectRepository(GameRules)
    private gameRulesRepository: Repository<GameRules>,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}

  async create(
    gameId: number,
    createGameRulesDto: CreateGameRulesDto,
  ): Promise<GameRules> {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });
    if (!game) {
      throw new NotFoundException(`Game with ID ${gameId} not found`);
    }

    if (createGameRulesDto.isActive) {
      await this.deactivateAllVersions(gameId);
    }

    const gameRules = this.gameRulesRepository.create({
      ...createGameRulesDto,
      game,
    });

    return this.gameRulesRepository.save(gameRules);
  }

  async findAll(gameId: number): Promise<GameRules[]> {
    return this.gameRulesRepository.find({
      where: { game: { id: gameId } },
      order: { version: 'DESC' },
    });
  }

  async findActive(gameId: number): Promise<GameRules> {
    const rules = await this.gameRulesRepository.findOne({
      where: { game: { id: gameId }, isActive: true },
    });

    if (!rules) {
      throw new NotFoundException(`No active rules found for game ${gameId}`);
    }

    return rules;
  }

  async findOne(gameId: number, version: string): Promise<GameRules> {
    const rules = await this.gameRulesRepository.findOne({
      where: { game: { id: gameId }, version },
    });

    if (!rules) {
      throw new NotFoundException(
        `Rules version ${version} not found for game ${gameId}`,
      );
    }

    return rules;
  }

  async setActive(gameId: number, version: string): Promise<GameRules> {
    const rules = await this.findOne(gameId, version);

    await this.deactivateAllVersions(gameId);
    rules.isActive = true;

    return this.gameRulesRepository.save(rules);
  }

  private async deactivateAllVersions(gameId: number): Promise<void> {
    await this.gameRulesRepository.update(
      { game: { id: gameId } },
      { isActive: false },
    );
  }

  async compareVersions(
    gameId: number,
    version1: string,
    version2: string,
  ): Promise<{
    version1: GameRules;
    version2: GameRules;
    differences: Record<string, any>;
  }> {
    const rules1 = await this.findOne(gameId, version1);
    const rules2 = await this.findOne(gameId, version2);

    const differences = this.findDifferences(
      rules1.rulesContent,
      rules2.rulesContent,
    );

    return {
      version1: rules1,
      version2: rules2,
      differences,
    };
  }

  private findDifferences(obj1: any, obj2: any): Record<string, any> {
    const differences: Record<string, any> = {};

    for (const key in obj1) {
      if (typeof obj1[key] === 'object' && obj1[key] !== null) {
        const nestedDiff = this.findDifferences(obj1[key], obj2[key]);
        if (Object.keys(nestedDiff).length > 0) {
          differences[key] = nestedDiff;
        }
      } else if (obj1[key] !== obj2[key]) {
        differences[key] = {
          old: obj1[key],
          new: obj2[key],
        };
      }
    }

    for (const key in obj2) {
      if (!(key in obj1)) {
        differences[key] = {
          old: undefined,
          new: obj2[key],
        };
      }
    }

    return differences;
  }
}
