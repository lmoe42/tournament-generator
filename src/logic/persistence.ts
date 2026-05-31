import { Tournament } from 'types';

const TOURNAMENTS_KEY = 'existingTournaments';

export type CreateTournamentResult = { success: true } | { success: false; error: string };

export const getExistingTournaments = (): Tournament[] => {
  try {
    const tournamentsString = localStorage.getItem(TOURNAMENTS_KEY);
    if (!tournamentsString) {
      return [];
    }

    const parsed = JSON.parse(tournamentsString);
    return Array.isArray(parsed) ? (parsed as Tournament[]) : [];
  } catch (error) {
    console.error('Failed to parse existing tournaments', error);
    return [];
  }
};

export const getTournament = (name: string): Tournament | undefined => {
  return getExistingTournaments().find((tournament) => tournament.name === name);
};

export const saveTournament = (tournament: Tournament): void => {
  const existingTournaments = getExistingTournaments();
  const existingIndex = existingTournaments.findIndex((item) => item.name === tournament.name);
  const updatedTournaments =
    existingIndex === -1
      ? [...existingTournaments, tournament]
      : existingTournaments.map((item, index) => (index === existingIndex ? tournament : item));

  localStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(updatedTournaments));
};

export const createTournament = (tournament: Tournament): CreateTournamentResult => {
  if (getTournament(tournament.name)) {
    return { success: false, error: 'Tournament name already exists.' };
  }

  saveTournament(tournament);
  return { success: true };
};

export const deleteTournament = (name: string): void => {
  const updatedTournaments = getExistingTournaments().filter((tournament) => tournament.name !== name);
  localStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(updatedTournaments));
};
