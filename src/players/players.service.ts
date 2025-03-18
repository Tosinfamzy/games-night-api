import { Injectable, NotFoundException } from '@nestjs/common';
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
    if (!session) throw new NotFoundException('Session not found');

    const player = this.playerRepository.create({ name, session });
    return this.playerRepository.save(player);
  }

  async findOne(id: number): Promise<Player> {
    const player = await this.playerRepository.findOne({
      where: { id },
      relations: ['session', 'team'],
    });
    if (!player) throw new NotFoundException(`Player with ID ${id} not found`);
    return player;
  }

  async remove(id: number): Promise<void> {
    const player = await this.findOne(id);
    await this.playerRepository.remove(player);
  }
}
