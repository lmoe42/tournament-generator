import { StrongmanTournament, TournamentSummary } from 'types';

export const getStrongmanCompletedResultsCount = (tournament: StrongmanTournament): number => {
  return Object.values(tournament.eventResults ?? {}).reduce((sum, result) => sum + Object.keys(result).length, 0);
};

export const getStrongmanExpectedResultsCount = (tournament: StrongmanTournament): number => {
  return tournament.participants.length * (tournament.events?.length ?? 0);
};

export const getStrongmanTournamentSummary = (tournament: StrongmanTournament): TournamentSummary => {
  const totalFields = getStrongmanExpectedResultsCount(tournament);
  const completedFields = getStrongmanCompletedResultsCount(tournament);

  return {
    name: tournament.name,
    type: tournament.type,
    participantsCount: tournament.participants.length,
    primaryCount: {
      label: 'Events',
      value: tournament.events?.length ?? 0,
    },
    completedFields,
    totalFields,
    progress: totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0,
  };
};
