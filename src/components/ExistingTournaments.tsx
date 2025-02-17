import { Grid, Typography } from '@mui/material';

import React from 'react';
import TournamentOverview from './TournamentOverview';

const ExistingTournaments: React.FC = () => {
  const existingTournaments = JSON.parse(localStorage.getItem('existingTournaments') || '[]');

  return (
    <Grid container spacing={2} style={{ padding: '20px' }}>
      {existingTournaments.length === 0 ? (
        <Grid item xs={12}>
          <Typography variant="h6" align="center">You have not created any tournaments yet.</Typography>
        </Grid>
      ) : (
        existingTournaments.map((tournament: { name: string; participants: string[]; type: string }, index: number) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <TournamentOverview
              name={tournament.name}
              type={tournament.type}
              participantsCount={tournament.participants.length}
            />
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default ExistingTournaments;