import { Game } from '../../games/entities/game.entity';
import * as faker from 'faker';

export const createGame = (): Partial<Game> => {
  return {
    name: faker.random.arrayElement([
      'Charades',
      'Pictionary',
      'Monopoly',
      'Scrabble',
      'Uno',
      'Trivial Pursuit',
      'Cards Against Humanity',
      'Articulate',
      'Acts of Insanity',
    ]),
    rules: faker.lorem.paragraph(),
  };
};
