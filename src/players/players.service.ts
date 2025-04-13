import { Injectable, NotFoundException } from '@nestjs/common';
import { Player, PlayerType } from './entities/player.entity';
import { Session } from 'src/sessions/entities/session.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateHostPlayerDto } from './dto/create-host-player.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async addPlayer(
    sessionId: string, 
    name: string, 
    type: PlayerType = PlayerType.PARTICIPANT
  ): Promise<Player> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });
    if (!session) throw new NotFoundException('Session not found');

    const player = this.playerRepository.create({ name, session, type });
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

  async createHost(createHostPlayerDto: CreateHostPlayerDto): Promise<Player> {
    const host = this.playerRepository.create({
      name: createHostPlayerDto.name,
      type: PlayerType.HOST,
    });

    return this.playerRepository.save(host);
  }
}
