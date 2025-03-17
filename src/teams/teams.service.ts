import { Injectable } from '@nestjs/common';
import { Session } from 'src/sessions/entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async createTeam(sessionId: number, name: string): Promise<Team> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });
    if (!session) throw new Error('Session not found');

    const team = this.teamRepository.create({ name, session });
    return this.teamRepository.save(team);
  }
}
