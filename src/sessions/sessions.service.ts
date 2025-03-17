import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { Game } from 'src/games/entities/game.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}

  async createSession(gameId: number): Promise<Session> {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });
    if (!game) throw new Error('Game not found');

    const session = this.sessionRepository.create({ game });
    return this.sessionRepository.save(session);
  }

  async getSessions(): Promise<Session[]> {
    return this.sessionRepository.find({ relations: ['players', 'teams'] });
  }
}
