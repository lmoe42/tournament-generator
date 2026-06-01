import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import StrongmanTournamentComponent from 'components/strongman/TournamentStrongman';
import { useNavigate, useParams } from 'react-router-dom';
import { TournamentTypes } from 'types';
import { getTournament } from 'logic/persistence';

const decodeRouteName = (name: string): string => {
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
};

const Tournament: React.FC = () => {
  const { name } = useParams<{ name: string }>(); // Get tournament name from route
  const navigate = useNavigate();

  const selectedTournament = name ? getTournament(decodeRouteName(name)) : undefined;

  // Function to render the correct tournament type component
  const renderTournamentComponent = () => {
    switch (selectedTournament?.type) {
      case TournamentTypes.STRONGMAN:
        return <StrongmanTournamentComponent initialTournament={selectedTournament} />;
      // You can add more cases for other tournament types
      default:
        return (
          <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={6}>
            <Typography variant="h5" color="error">
              Tournament not found.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/tournaments')}>
              Back to tournaments
            </Button>
          </Box>
        );
    }
  };

  return renderTournamentComponent();
};

export default Tournament;
