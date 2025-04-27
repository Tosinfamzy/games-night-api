import { Game, GameType, GameState } from '../../games/entities/game.entity';
import * as faker from 'faker';

export const createGame = (): Partial<Game> => {
  // Map game names to their corresponding types
  const gameTypes = {
    UNO: GameType.UNO,
    Articulate: GameType.ARTICULATE,
    'Cards Against Humanity': GameType.CARDS_AGAINST_HUMANITY,
    Blackjack: GameType.BLACKJACK,
  };

  // Select one of our predefined game types
  const gameName = faker.random.arrayElement(Object.keys(gameTypes));

  return {
    name: gameName,
    type: gameTypes[gameName],
    description: faker.lorem.paragraph(),
    state: faker.random.arrayElement(Object.values(GameState)),
    rules: [], // Initialize with empty array, rules will be added separately
  };
};
