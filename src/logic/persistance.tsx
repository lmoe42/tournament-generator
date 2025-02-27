const getExistingTournaments = () => {
    return localStorage.getItem('existingTournaments');
}

const getTournament (name: string) => {
    const existingTournaments = getExistingTournaments();
     existingTournaments.find((tournament) => tournament.name === name);
}