import { Player } from '../../players/entities/player.entity';
import { Session } from '../../sessions/entities/session.entity';
import { Team } from '../../teams/entities/team.entity';
import * as faker from 'faker';

export const createPlayer = (
  session: Session,
  team?: Team,
): Partial<Player> => {
  return {
    name: faker.name.firstName() + ' ' + faker.name.lastName(),
    session,
    team,
  };
};
