import { Box, Button, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Confetti from 'react-confetti';
import { Tournament } from 'types';
import Trophy1 from '../assets/trophy1.svg';
import Trophy2 from '../assets/trophy2.svg';
import Trophy3 from '../assets/trophy3.svg';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useWindowSize } from '@react-hook/window-size';

const TrophyCeremony = () => {
  const navigate = useNavigate();

  const { name } = useParams<{ name: string }>();
  const [confettiPieces, setConfettiPieces] = useState(2000);
  const [width, height] = useWindowSize();

  const existingTournaments: Tournament[] = JSON.parse(localStorage.getItem('existingTournaments') || '[]');
  const tournament: Tournament | undefined = existingTournaments.find(
    (tournament: Tournament) => tournament.name === name,
  );

  if (!tournament) {
    return (
      <Typography align="center" color="error">
        Tournament not found
      </Typography>
    );
  }

  useEffect(() => {
    // Gradually decrease confetti pieces
    const interval = setInterval(() => {
      setConfettiPieces((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 10;
      });
    }, 100); // Adjust speed here
    return () => clearInterval(interval);
  }, []);

  const backToTournament = () => {
    navigate(`/tournament/${name}`);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%" marginTop={8} p={4}>
      {confettiPieces > 0 && <Confetti width={width} height={height} numberOfPieces={confettiPieces} />}
      {/* Podium Layout */}
      <Stack direction="row" justifyContent="center" alignItems="flex-end" spacing={6} mb={6}>
        {/* Second Place */}
        <Box display="flex" flexDirection="column" alignItems="center" position="relative" top={16}>
          <Box component="img" src={Trophy2} alt="Second Place Trophy" sx={{ width: 250 }} />
          <Typography variant="h6" mt={1} fontWeight="bold">
            2. {tournament.participants[1]}
          </Typography>
        </Box>

        {/* First Place */}
        <Box display="flex" flexDirection="column" alignItems="center" position="relative" top={-16} zIndex={1}>
          <Box component="img" src={Trophy1} alt="First Place Trophy" sx={{ width: 300 }} />
          <Typography variant="h5" fontWeight="bold" mt={1}>
            1. {tournament.participants[0]}
          </Typography>
        </Box>

        {/* Third Place */}
        <Box display="flex" flexDirection="column" alignItems="center" position="relative" top={16}>
          <Box component="img" src={Trophy3} alt="Third Place Trophy" sx={{ width: 250 }} />
          <Typography variant="h6" fontWeight="bold" mt={1}>
            3. {tournament.participants[2]}
          </Typography>
        </Box>
      </Stack>

      {/* Remaining Participants */}
      <Box mt={4}>
        {tournament.participants.slice(3).map((participant, index) => (
          <Typography key={index} variant="body1" align="center" mt={1}>
            {index + 4}. {participant}
          </Typography>
        ))}

        <Button variant="contained" color="primary" startIcon={<ArrowBackIcon />} onClick={backToTournament} sx= {{ mt: 6 }}>
          Back to Tournament
        </Button>
      </Box>
    </Box>
  );
};

export default TrophyCeremony;
