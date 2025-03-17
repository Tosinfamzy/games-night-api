import { Injectable } from '@nestjs/common';
import { Player } from './entities/player.entity';
import { Session } from 'src/sessions/entities/session.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async addPlayer(sessionId: number, name: string): Promise<Player> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });
    if (!session) throw new Error('Session not found');

    const player = this.playerRepository.create({ name, session });
    return this.playerRepository.save(player);
  }
}
