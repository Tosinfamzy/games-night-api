import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game, GameState, GameType } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { GameSetupDto } from './dto/game-setup.dto';
import { PlayerReadyDto } from './dto/player-ready.dto';
import {
  GameParticipant,
  ParticipantStatus,
} from './entities/game-participant.entity';
import { Player } from '../players/entities/player.entity';
import { Rule } from './entities/rule.entity';
import { CreateRuleDto } from './dto/create-rule.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(GameParticipant)
    private readonly participantRepository: Repository<GameParticipant>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    @InjectRepository(Rule)
    private readonly ruleRepository: Repository<Rule>,
  ) {}

  async findAll(): Promise<Game[]> {
    return this.gameRepository.find({
      relations: ['rules'],
    });
  }

  async create(createGameDto: CreateGameDto): Promise<Game> {
    const game = this.gameRepository.create({
      name: createGameDto.name,
      type: createGameDto.type,
      description: createGameDto.description,
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
      relations: ['participants', 'participants.player', 'rules'],
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
    if (game.state !== GameState.SETUP) {
      throw new BadRequestException('Game is not in setup state');
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

  // Rule management methods
  async addRule(gameId: number, createRuleDto: CreateRuleDto): Promise<Rule> {
    const game = await this.findGameById(gameId);

    const rule = this.ruleRepository.create({
      ...createRuleDto,
      game,
      isDefaultEnabled: createRuleDto.isDefaultEnabled ?? true,
    });

    return this.ruleRepository.save(rule);
  }

  async getRules(gameId: number): Promise<Rule[]> {
    const game = await this.findGameById(gameId);
    return this.ruleRepository.find({
      where: { game: { id: game.id } },
      order: { name: 'ASC' },
    });
  }

  async getRule(ruleId: number): Promise<Rule> {
    const rule = await this.ruleRepository.findOne({
      where: { id: ruleId },
      relations: ['game'],
    });

    if (!rule) {
      throw new NotFoundException(`Rule with ID ${ruleId} not found`);
    }

    return rule;
  }

  async updateRule(ruleId: number, updateData: Partial<Rule>): Promise<Rule> {
    const rule = await this.getRule(ruleId);
    Object.assign(rule, updateData);
    return this.ruleRepository.save(rule);
  }

  async deleteRule(ruleId: number): Promise<void> {
    const rule = await this.getRule(ruleId);
    await this.ruleRepository.remove(rule);
  }

  // Helper method to initialize default games and rules
  async initializeDefaultGamesAndRules(): Promise<void> {
    // Check if games already exist
    const existingGames = await this.gameRepository.find();
    if (existingGames.length > 0) {
      return; // Default games already exist
    }

    // UNO
    const uno = await this.gameRepository.save(
      this.gameRepository.create({
        name: 'UNO',
        type: GameType.UNO,
        description:
          'A classic card game where players race to empty their hands by matching colors and numbers.',
        state: GameState.SETUP,
      }),
    );

    await this.ruleRepository.save([
      this.ruleRepository.create({
        name: 'No Stacking',
        description:
          'Players cannot stack +2 or +4 cards to make the next player draw more cards.',
        isDefaultEnabled: true,
        game: uno,
      }),
      this.ruleRepository.create({
        name: 'Draw Until Match',
        description: 'Players must draw cards until they get a playable card.',
        isDefaultEnabled: true,
        game: uno,
      }),
      this.ruleRepository.create({
        name: 'Play After Draw',
        description:
          'Players can immediately play a card drawn from the deck if it matches.',
        isDefaultEnabled: true,
        game: uno,
      }),
      this.ruleRepository.create({
        name: 'Penalty for False UNO',
        description:
          'Players who fail to say UNO when playing their second-to-last card must draw 2 cards.',
        isDefaultEnabled: true,
        game: uno,
      }),
    ]);

    // Articulate
    const articulate = await this.gameRepository.save(
      this.gameRepository.create({
        name: 'Articulate',
        type: GameType.ARTICULATE,
        description:
          'A fast-talking description game where team members describe words for their teammates to guess.',
        state: GameState.SETUP,
      }),
    );

    await this.ruleRepository.save([
      this.ruleRepository.create({
        name: 'No Gestures',
        description: 'Players cannot use hand gestures while describing words.',
        isDefaultEnabled: true,
        game: articulate,
      }),
      this.ruleRepository.create({
        name: 'Strict Timer',
        description:
          'Players have exactly 30 seconds to describe as many words as possible.',
        isDefaultEnabled: true,
        game: articulate,
      }),
      this.ruleRepository.create({
        name: 'Skip Penalty',
        description: 'Teams lose a point for each word they skip.',
        isDefaultEnabled: false,
        game: articulate,
      }),
    ]);

    // Cards Against Humanity
    const cah = await this.gameRepository.save(
      this.gameRepository.create({
        name: 'Cards Against Humanity',
        type: GameType.CARDS_AGAINST_HUMANITY,
        description:
          'A party game where players complete fill-in-the-blank statements with inappropriate phrases.',
        state: GameState.SETUP,
      }),
    );

    await this.ruleRepository.save([
      this.ruleRepository.create({
        name: 'God Is Dead',
        description:
          'The Card Czar can eliminate an answer they hate before judging the rest.',
        isDefaultEnabled: false,
        game: cah,
      }),
      this.ruleRepository.create({
        name: 'Rebooting the Universe',
        description:
          'Players can discard their entire hand and draw new cards once per game.',
        isDefaultEnabled: false,
        game: cah,
      }),
      this.ruleRepository.create({
        name: 'Rando Cardrissian',
        description:
          'Add a random answer to each round as if played by an AI player.',
        isDefaultEnabled: false,
        game: cah,
      }),
    ]);

    // Blackjack
    const blackjack = await this.gameRepository.save(
      this.gameRepository.create({
        name: 'Blackjack',
        type: GameType.BLACKJACK,
        description:
          'A card game where players try to get a hand value closer to 21 than the dealer without going over.',
        state: GameState.SETUP,
      }),
    );

    await this.ruleRepository.save([
      this.ruleRepository.create({
        name: 'Dealer Stands on 17',
        description:
          'The dealer must stand when their hand value reaches 17 or higher.',
        isDefaultEnabled: true,
        game: blackjack,
      }),
      this.ruleRepository.create({
        name: 'Blackjack Pays 3:2',
        description: 'A natural blackjack pays out at 3:2 odds.',
        isDefaultEnabled: true,
        game: blackjack,
      }),
      this.ruleRepository.create({
        name: 'Split Allowed',
        description: 'Players can split pairs into two separate hands.',
        isDefaultEnabled: true,
        game: blackjack,
      }),
      this.ruleRepository.create({
        name: 'Double Down',
        description:
          'Players can double their bet after receiving their initial two cards.',
        isDefaultEnabled: true,
        game: blackjack,
      }),
      this.ruleRepository.create({
        name: 'Insurance',
        description:
          'Players can take insurance against a dealer blackjack when an Ace is showing.',
        isDefaultEnabled: false,
        game: blackjack,
      }),
    ]);
  }
}
