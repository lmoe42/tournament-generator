import { Tournament } from '../types';

export const getExistingTournaments = () => {
    const tournamentsString = localStorage.getItem('existingTournaments');
    if (tournamentsString) {
        return JSON.parse(tournamentsString) as Tournament[];
    } else {
        return undefined;
    }
}

export const getTournament = (name: string) => {
    const existingTournaments = getExistingTournaments();
    if (existingTournaments) {
        existingTournaments.find((tournament) => {tournament.name === name});
    }
}

export const saveTournament = (tournament: Tournament) => {
    const existingTournaments = getExistingTournaments() ?? [];
    const updatedTournaments = existingTournaments.map(item => item.name === tournament.name ? tournament : item);
    localStorage.setItem('existingTournaments', JSON.stringify(updatedTournaments));
}