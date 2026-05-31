import { Alert, Button, MenuItem, Modal, TextField, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import React, { useState } from 'react';

import { createTournament } from 'logic/persistence';
import { Tournament, TournamentTypes } from 'types';
import { useNavigate } from 'react-router-dom';

interface TournamentCreationModalProps {
  open: boolean; // Modal open state
  onClose: () => void; // Function to close the modal
}

const TournamentCreationModal: React.FC<TournamentCreationModalProps> = ({ open, onClose }) => {
  const [tournamentName, setTournamentName] = useState('');
  const [selectedType, setSelectedType] = useState(TournamentTypes.STRONGMAN);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const validateTournamentName = (name: string) => {
    if (!name.trim()) {
      setError('Tournament name cannot be empty.');
      return false;
    }

    setError('');
    return true;
  };

  const resetForm = () => {
    setTournamentName('');
    setSelectedType(TournamentTypes.STRONGMAN);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreateTournament = () => {
    if (!validateTournamentName(tournamentName)) {
      return;
    }

    const name = tournamentName.trim();
    const newTournament: Tournament = {
      name,
      participants: [],
      events: [],
      type: selectedType,
    };

    const result = createTournament(newTournament);
    if (!result.success) {
      setError(result.error);
      return;
    }

    resetForm();
    onClose();
    navigate(`/tournament/${encodeURIComponent(name)}`);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="create-tournament-modal-title"
      aria-describedby="create-tournament-modal-description"
    >
      <div style={{ padding: 24, background: 'white', borderRadius: 8, maxWidth: 400, margin: 'auto' }}>
        <Typography id="create-tournament-modal-title" variant="h6">
          Create New Tournament
        </Typography>
        <Typography id="create-tournament-modal-description" sx={visuallyHidden}>
          Enter a unique tournament name and choose a tournament type.
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          label="Tournament Name"
          value={tournamentName}
          onChange={(e) => {
            setTournamentName(e.target.value);
            setError('');
          }}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Tournament Type"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as TournamentTypes)}
          fullWidth
          margin="normal"
        >
          {Object.values(TournamentTypes).map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="contained" color="primary" onClick={handleCreateTournament} fullWidth>
          Create Tournament
        </Button>
      </div>
    </Modal>
  );
};

export default TournamentCreationModal;
