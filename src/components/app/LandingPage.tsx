import AddIcon from '@mui/icons-material/Add';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';

import TournamentCreationModal from 'components/tournaments/TournamentCreationModal';
import TrophySvg from 'assets/trophy.svg';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        minHeight: 'calc(100vh - 64px)',
        px: { xs: 2, md: 3 },
        py: { xs: 3, md: 5 },
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          display: 'grid',
          gap: { xs: 3, md: 5 },
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 280px' },
          maxWidth: 980,
          mx: 'auto',
          p: { xs: 3, md: 5 },
          width: '100%',
        }}
      >
        <Stack spacing={2.5} justifyContent="center">
          <Box>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 800 }}>
              Local Workspace
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.5 }}>
              Tournament Generator
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 620, mt: 1 }}>
              Verwalte Turniere, Teilnehmer, Events und Ergebnistabellen lokal im Browser.
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>
              Neues Turnier
            </Button>
            <Button variant="outlined" startIcon={<FolderOpenIcon />} onClick={() => navigate('/tournaments')}>
              Bestehende Turniere
            </Button>
          </Stack>
        </Stack>

        <Box
          sx={{
            alignItems: 'center',
            bgcolor: '#e8f3e8',
            borderRadius: 2,
            display: 'flex',
            justifyContent: 'center',
            minHeight: 220,
            p: 3,
          }}
        >
          <Box component="img" src={TrophySvg} alt="Tournament trophy icon" sx={{ height: 180, width: 'auto' }} />
        </Box>
      </Paper>

      <TournamentCreationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
};

export default LandingPage;
