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
import { TournamentSummary } from 'types';
import { useNavigate } from 'react-router-dom';

interface TournamentOverviewProps {
  summary: TournamentSummary;
  onDelete: (name: string) => void;
}

const TournamentOverview: React.FC<TournamentOverviewProps> = ({ summary, onDelete }) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleCardClick = () => {
    navigate(`/tournament/${encodeURIComponent(summary.name)}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(summary.name);
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
                {summary.name}
              </Typography>
              <Chip label={summary.type} size="small" color="secondary" variant="outlined" />
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
                  {summary.participantsCount}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 800, textTransform: 'uppercase' }}
                >
                  {summary.primaryCount.label}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 800 }}>
                  {summary.primaryCount.value}
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
                  {summary.completedFields}/{summary.totalFields}
                </Typography>
              </Box>
            </Stack>

            <Box>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                <Typography variant="caption" color="text.secondary">
                  Fortschritt
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {summary.progress}%
                </Typography>
              </Stack>
              <LinearProgress
                aria-label={`${summary.name} progress`}
                variant="determinate"
                value={summary.progress}
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
          <DialogContentText>Soll das Turnier {summary.name} wirklich geloescht werden?</DialogContentText>
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
