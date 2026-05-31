import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import React, { useState } from 'react';
import { Tournament } from 'types';
import { useNavigate } from 'react-router-dom';

interface TournamentOverviewProps {
  tournament: Tournament;
  onDelete: (name: string) => void;
}

const getCompletedResultsCount = (tournament: Tournament): number => {
  return Object.values(tournament.eventResults ?? {}).reduce((sum, result) => sum + Object.keys(result).length, 0);
};

const TournamentOverview: React.FC<TournamentOverviewProps> = ({ tournament, onDelete }) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const eventsCount = tournament.events?.length ?? 0;
  const participantsCount = tournament.participants.length;
  const expectedResultsCount = eventsCount * participantsCount;
  const completedResultsCount = getCompletedResultsCount(tournament);
  const progress = expectedResultsCount > 0 ? Math.round((completedResultsCount / expectedResultsCount) * 100) : 0;

  const handleCardClick = () => {
    navigate(`/tournament/${encodeURIComponent(tournament.name)}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(tournament.name);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          borderColor: 'divider',
          boxShadow: '0 10px 28px rgba(19, 58, 20, 0.06)',
          height: '100%',
        }}
      >
        <CardActionArea onClick={handleCardClick} sx={{ alignItems: 'stretch', height: '100%' }}>
          <CardContent sx={{ display: 'grid', gap: 1.5, pb: 1.5 }}>
            <Stack direction="row" justifyContent="space-between" spacing={1}>
              <Typography variant="h6" component="div">
                {tournament.name}
              </Typography>
              <Chip label={tournament.type} size="small" color="secondary" variant="outlined" />
            </Stack>

            <Stack direction="row" spacing={2}>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 800, textTransform: 'uppercase' }}
                >
                  Teilnehmer
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 800 }}>
                  {participantsCount}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 800, textTransform: 'uppercase' }}
                >
                  Events
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 800 }}>
                  {eventsCount}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 800, textTransform: 'uppercase' }}
                >
                  Felder
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 800 }}>
                  {completedResultsCount}/{expectedResultsCount}
                </Typography>
              </Box>
            </Stack>

            <Box>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                <Typography variant="caption" color="text.secondary">
                  Fortschritt
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {progress}%
                </Typography>
              </Stack>
              <LinearProgress
                aria-label={`${tournament.name} progress`}
                variant="determinate"
                value={progress}
                sx={{
                  bgcolor: '#edf0ed',
                  borderRadius: 999,
                  height: 8,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 999,
                  },
                }}
              />
            </Box>
          </CardContent>
        </CardActionArea>
        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2, pt: 0 }}>
          <Button size="small" startIcon={<OpenInNewIcon />} onClick={handleCardClick}>
            Oeffnen
          </Button>
          <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={handleDelete}>
            Loeschen
          </Button>
        </CardActions>
      </Card>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Turnier loeschen</DialogTitle>
        <DialogContent>
          <DialogContentText>Soll das Turnier "{tournament.name}" wirklich geloescht werden?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Abbrechen</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>
            Loeschen
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TournamentOverview;
