import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game, GameState } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { GameSetupDto } from './dto/game-setup.dto';
import { PlayerReadyDto } from './dto/player-ready.dto';
import {
  GameParticipant,
  ParticipantStatus,
} from './entities/game-participant.entity';
import { Player } from '../players/entities/player.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(GameParticipant)
    private readonly participantRepository: Repository<GameParticipant>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
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

  async findGameById(id: number): Promise<Game> {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: ['participants', 'participants.player'],
    });
    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }
    return game;
  }

  async getGamePlayers(gameId: number): Promise<{
    players: {
      id: number;
      name: string;
      status: ParticipantStatus;
      joinedAt: Date;
      session: { id: string; sessionName: string };
    }[];
    total: number;
  }> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: [
        'participants',
        'participants.player',
        'participants.player.session',
      ],
    });

    if (!game) {
      throw new NotFoundException(`Game with ID ${gameId} not found`);
    }

    const players = game.participants.map((participant) => ({
      id: participant.player.id,
      name: participant.player.name,
      status: participant.status,
      joinedAt: participant.createdAt,
      session: participant.player.session
        ? {
            id: participant.player.session.id,
            sessionName: participant.player.session.sessionName,
          }
        : null,
    }));

    return {
      players,
      total: players.length,
    };
  }

  async addPlayer(gameId: number, playerId: number): Promise<GameParticipant> {
    const game = await this.findGameById(gameId);
    const player = await this.playerRepository.findOne({
      where: { id: playerId },
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${playerId} not found`);
    }

    // Check if player is already in the game
    const existingParticipant = game.participants?.find(
      (p) => p.player.id === playerId,
    );
    if (existingParticipant) {
      throw new ConflictException('Player is already in this game');
    }

    const participant = this.participantRepository.create({
      game,
      player,
      status: ParticipantStatus.JOINED,
    });

    return this.participantRepository.save(participant);
  }

  async playerReady(
    gameId: number,
    playerId: number,
  ): Promise<GameParticipant> {
    const game = await this.findGameById(gameId);
    if (game.state !== GameState.READY) {
      throw new BadRequestException('Game is not in ready state');
    }

    const participant = game.participants?.find(
      (p) => p.player.id === playerId,
    );

    if (!participant) {
      throw new NotFoundException('Player is not in this game');
    }

    participant.status = ParticipantStatus.READY;
    return this.participantRepository.save(participant);
  }

  async removePlayer(gameId: number, playerId: number): Promise<void> {
    const game = await this.findGameById(gameId);
    const participant = game.participants?.find(
      (p) => p.player.id === playerId,
    );

    if (!participant) {
      throw new NotFoundException('Player is not in this game');
    }

    await this.participantRepository.remove(participant);
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
}
