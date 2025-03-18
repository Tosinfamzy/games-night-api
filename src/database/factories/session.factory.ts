import { Session } from '../../sessions/entities/session.entity';
import { Game } from '../../games/entities/game.entity';
import * as faker from 'faker';

export const createSession = (game: Game): Partial<Session> => {
  return {
    game,
    isActive: faker.random.boolean(),
  };
};
