import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game, GameState } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { GameSetupDto } from './dto/game-setup.dto';
import { PlayerReadyDto } from './dto/player-ready.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) {}

  async findAll(): Promise<Game[]> {
    return this.gameRepository.find();
  }

  async create(name: string, rules: string): Promise<Game> {
    const game = this.gameRepository.create({
      name,
      rules,
      state: GameState.SETUP,
    });
    return this.gameRepository.save(game);
  }

  async setupGame(id: number, setupDto: GameSetupDto): Promise<Game> {
    const game = await this.findGameById(id);
    if (game.state !== GameState.SETUP) {
      throw new BadRequestException('Game is not in setup state');
    }

    game.totalRounds = setupDto.totalRounds;
    game.currentRound = 1;
    game.state = GameState.READY;
    return this.gameRepository.save(game);
  }

  async playerReady(id: number, playerId: number): Promise<Game> {
    const game = await this.findGameById(id);
    if (game.state !== GameState.READY) {
      throw new BadRequestException('Game is not in ready state');
    }

    // Here you would typically track which players are ready
    // This could be done through a separate table or JSON field
    // For now, we'll just return the game
    return game;
  }

  async startGame(id: number): Promise<Game> {
    const game = await this.findGameById(id);
    if (game.state !== GameState.READY) {
      throw new BadRequestException('Game is not in ready state');
    }

    game.state = GameState.IN_PROGRESS;
    return this.gameRepository.save(game);
  }

  async completeGame(id: number): Promise<Game> {
    const game = await this.findGameById(id);
    if (game.state !== GameState.IN_PROGRESS) {
      throw new BadRequestException('Game is not in progress');
    }

    game.state = GameState.COMPLETED;
    return this.gameRepository.save(game);
  }

  async updateGameState(id: number, state: GameState): Promise<Game> {
    const game = await this.findGameById(id);
    game.state = state;
    return this.gameRepository.save(game);
  }

  private async findGameById(id: number): Promise<Game> {
    const game = await this.gameRepository.findOne({ where: { id } });
    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }
    return game;
  }
}
