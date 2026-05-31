import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState } from 'react';
import { TournamentTypes } from 'types';
import { useNavigate } from 'react-router-dom';

interface TournamentOverviewProps {
  name: string;
  type: TournamentTypes;
  participantsCount: number;
  onDelete: (name: string) => void;
}

const TournamentOverview: React.FC<TournamentOverviewProps> = ({ name, type, participantsCount, onDelete }) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleCardClick = () => {
    navigate(`/tournament/${encodeURIComponent(name)}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event from firing
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(name);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Card variant="outlined" sx={{ position: 'relative' }}>
        <CardActionArea onClick={handleCardClick}>
          <CardContent sx={{ pr: 6 }}>
            <Typography variant="h5" component="div">
              {name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Type: {type}
            </Typography>
            <Typography variant="body2">Participants: {participantsCount}</Typography>
          </CardContent>
        </CardActionArea>
        <IconButton
          aria-label={`delete ${name}`}
          onClick={handleDelete}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <DeleteIcon color="error" />
        </IconButton>
      </Card>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Tournament</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete the tournament "{name}"?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TournamentOverview;
