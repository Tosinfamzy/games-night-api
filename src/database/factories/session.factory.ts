import { Session, SessionStatus } from '../../sessions/entities/session.entity';
import { Game } from '../../games/entities/game.entity';
import * as faker from 'faker';

export const createSession = (games: Game[]): Partial<Session> => {
  return {
    sessionName: faker.lorem.words(3),
    isActive: faker.random.boolean(),
    status: faker.random.arrayElement(Object.values(SessionStatus)),
    games,
    currentGame: faker.random.arrayElement(games),
  };
};
