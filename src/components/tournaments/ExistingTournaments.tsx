import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Grid2 as Grid, Paper, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';

import TournamentCreationModal from 'components/tournaments/TournamentCreationModal';
import TournamentOverview from 'components/tournaments/TournamentOverview';
import { deleteTournament, getExistingTournaments } from 'logic/persistence';
import { Tournament } from 'types';
import { getTournamentSummary } from 'logic/tournamentSummary';

const ExistingTournaments: React.FC = () => {
  const [existingTournaments, setExistingTournaments] = useState<Tournament[]>(() => getExistingTournaments());
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const tournamentSummaries = existingTournaments.map(getTournamentSummary);
  const participantsCount = tournamentSummaries.reduce((sum, summary) => sum + summary.participantsCount, 0);
  const openResultsCount = tournamentSummaries.reduce(
    (sum, summary) => sum + Math.max(summary.totalFields - summary.completedFields, 0),
    0,
  );
  const completedTournamentsCount = tournamentSummaries.filter(
    (summary) => summary.totalFields > 0 && summary.completedFields >= summary.totalFields,
  ).length;

  const handleDeleteTournament = (name: string) => {
    deleteTournament(name);
    setExistingTournaments((tournaments) => tournaments.filter((tournament) => tournament.name !== name));
  };

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 2.5 }}>
        <Box>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 800 }}>
            Local Workspace
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
          <Typography color="text.secondary">Erstelle ein Turnier, um Teilnehmer und Events zu verwalten.</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateModalOpen(true)}>
            Neues Turnier
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {tournamentSummaries.map((summary) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={summary.name}>
              <TournamentOverview summary={summary} onDelete={handleDeleteTournament} />
            </Grid>
          ))}
        </Grid>
      )}

      <TournamentCreationModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
    </Box>
  );
};

export default ExistingTournaments;
