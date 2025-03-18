import { Score } from '../../scoring/entities/scoring.entity';
import { Player } from '../../players/entities/player.entity';
import { Team } from '../../teams/entities/team.entity';
import { Session } from '../../sessions/entities/session.entity';
import * as faker from 'faker';

export const createPlayerScore = (
  player: Player,
  session: Session,
): Partial<Score> => {
  return {
    points: faker.datatype.number({ min: 1, max: 10 }),
    player,
    session,
  };
};

export const createTeamScore = (
  team: Team,
  session: Session,
): Partial<Score> => {
  return {
    points: faker.datatype.number({ min: 5, max: 25 }),
    team,
    session,
  };
};
