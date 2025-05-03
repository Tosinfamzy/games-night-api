import { Game, GameType, GameState } from '../../games/entities/game.entity';
import * as faker from 'faker';

export const createGame = (): Partial<Game> => {
  const gameTypes = {
    UNO: GameType.UNO,
    Articulate: GameType.ARTICULATE,
    'Cards Against Humanity': GameType.CARDS_AGAINST_HUMANITY,
    Blackjack: GameType.BLACKJACK,
  };

  const gameName = faker.random.arrayElement(Object.keys(gameTypes));

  return {
    name: gameName,
    type: gameTypes[gameName],
    description: faker.lorem.paragraph(),
    state: faker.random.arrayElement(Object.values(GameState)),
    rules: [],
  };
};
