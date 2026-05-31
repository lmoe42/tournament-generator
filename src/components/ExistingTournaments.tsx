import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Grid2 as Grid, Paper, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';

import TournamentCreationModal from 'components/TournamentCreationModal';
import TournamentOverview from 'components/TournamentOverview';
import { Tournament } from 'types';
import { deleteTournament, getExistingTournaments } from 'logic/persistence';

const getCompletedResultsCount = (tournament: Tournament): number => {
  return Object.values(tournament.eventResults ?? {}).reduce((sum, result) => sum + Object.keys(result).length, 0);
};

const getExpectedResultsCount = (tournament: Tournament): number => {
  return tournament.participants.length * (tournament.events?.length ?? 0);
};

const ExistingTournaments: React.FC = () => {
  const [existingTournaments, setExistingTournaments] = useState<Tournament[]>(() => getExistingTournaments());
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const participantsCount = existingTournaments.reduce((sum, tournament) => sum + tournament.participants.length, 0);
  const expectedResultsCount = existingTournaments.reduce(
    (sum, tournament) => sum + getExpectedResultsCount(tournament),
    0,
  );
  const completedResultsCount = existingTournaments.reduce(
    (sum, tournament) => sum + getCompletedResultsCount(tournament),
    0,
  );
  const openResultsCount = Math.max(expectedResultsCount - completedResultsCount, 0);
  const completedTournamentsCount = existingTournaments.filter((tournament) => {
    const expected = getExpectedResultsCount(tournament);
    return expected > 0 && getCompletedResultsCount(tournament) >= expected;
  }).length;

  const handleDeleteTournament = (name: string) => {
    deleteTournament(name);
    setExistingTournaments((tournaments) => tournaments.filter((tournament) => tournament.name !== name));
  };

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 2.5 }}>
        <Box>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 800 }}>
            Strongman Workspace
          </Typography>
          <Typography variant="h4">Turnieruebersicht</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Aktive Turniere, offene Ergebniseingaben und lokale Speicherstaende.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateModalOpen(true)}>
          Neues Turnier
        </Button>
      </Stack>

      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>
              Aktiv
            </Typography>
            <Typography variant="h4">{existingTournaments.length}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>
              Teilnehmer
            </Typography>
            <Typography variant="h4">{participantsCount}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>
              Offene Felder
            </Typography>
            <Typography variant="h4">{openResultsCount}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>
              Abgeschlossen
            </Typography>
            <Typography variant="h4">{completedTournamentsCount}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {existingTournaments.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            p: 5,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6">Noch keine Turniere vorhanden.</Typography>
          <Typography color="text.secondary">
            Erstelle ein Strongman-Turnier, um Teilnehmer und Events zu verwalten.
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateModalOpen(true)}>
            Neues Turnier
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {existingTournaments.map((tournament) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={tournament.name}>
              <TournamentOverview tournament={tournament} onDelete={handleDeleteTournament} />
            </Grid>
          ))}
        </Grid>
      )}

      <TournamentCreationModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
    </Box>
  );
};

export default ExistingTournaments;
