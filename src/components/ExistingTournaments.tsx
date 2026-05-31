import { Grid2 as Grid, Typography } from '@mui/material';

import React, { useState } from 'react';
import TournamentOverview from 'components/TournamentOverview';
import { Tournament } from 'types';
import { deleteTournament, getExistingTournaments } from 'logic/persistence';

const ExistingTournaments: React.FC = () => {
  const [existingTournaments, setExistingTournaments] = useState<Tournament[]>(() => getExistingTournaments());

  const handleDeleteTournament = (name: string) => {
    deleteTournament(name);
    setExistingTournaments((tournaments) => tournaments.filter((tournament) => tournament.name !== name));
  };

  return (
    <Grid container spacing={2} style={{ padding: '20px' }}>
      {existingTournaments.length === 0 ? (
        <Grid size={12}>
          <Typography variant="h6" align="center">
            You have not created any tournaments yet.
          </Typography>
        </Grid>
      ) : (
        existingTournaments.map((tournament) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={tournament.name}>
            <TournamentOverview
              name={tournament.name}
              type={tournament.type}
              participantsCount={tournament.participants.length}
              onDelete={handleDeleteTournament}
            />
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default ExistingTournaments;
