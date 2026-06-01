import { Alert, Box, Button, MenuItem, Modal, Stack, TextField, Typography } from '@mui/material';
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
      type: TournamentTypes.STRONGMAN,
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
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: '0 24px 60px rgba(19, 58, 20, 0.22)',
          left: '50%',
          maxWidth: 440,
          p: 3,
          position: 'absolute',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'calc(100% - 32px)',
        }}
      >
        <Typography id="create-tournament-modal-title" variant="h6">
          Neues Turnier
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
          label="Turniername"
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
          label="Turniertyp"
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

        <Stack direction={{ xs: 'column-reverse', sm: 'row' }} justifyContent="flex-end" spacing={1.5} sx={{ mt: 2 }}>
          <Button onClick={handleClose}>Abbrechen</Button>
          <Button variant="contained" color="primary" onClick={handleCreateTournament}>
            Turnier erstellen
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default TournamentCreationModal;
