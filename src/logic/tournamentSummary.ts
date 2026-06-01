import { Tournament, TournamentSummary, TournamentTypes } from 'types';
import { getStrongmanTournamentSummary } from 'logic/strongman/summary';

export const getTournamentSummary = (tournament: Tournament): TournamentSummary => {
  switch (tournament.type) {
    case TournamentTypes.STRONGMAN:
      return getStrongmanTournamentSummary(tournament);
    default:
      return {
        name: tournament.name,
        type: tournament.type,
        participantsCount: tournament.participants.length,
        primaryCount: {
          label: 'Details',
          value: 0,
        },
        completedFields: 0,
        totalFields: 0,
        progress: 0,
      };
  }
};
