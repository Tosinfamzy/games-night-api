import { Team } from '../../teams/entities/team.entity';
import { Session } from '../../sessions/entities/session.entity';
import * as faker from 'faker';

export const createTeam = (session: Session): Partial<Team> => {
  return {
    name: faker.random.arrayElement([
      'Red Team',
      'Blue Team',
      'Green Team',
      'Yellow Team',
      'Purple Team',
      'Orange Team',
      'Black Team',
      'White Team',
    ]),
    session,
  };
};
