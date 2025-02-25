import { Button, MenuItem, Modal, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

import { TournamentTypes } from '../types'; // Import necessary types
import { useNavigate } from 'react-router-dom';

interface TournamentCreationModalProps {
  open: boolean; // Modal open state
  onClose: () => void; // Function to close the modal
}

const TournamentCreationModal: React.FC<TournamentCreationModalProps> = ({ open, onClose }) => {
  const [tournamentName, setTournamentName] = useState('');
  const [selectedType, setSelectedType] = useState(TournamentTypes.STRONGMAN);

  const navigate = useNavigate();

  const validateTournamentName = (name: string) => {
    const errors: string[] = [];
    if (!name.trim()) {
      errors.push('Tournament name cannot be empty.');
    }
    if (errors.length) {
      alert(errors.join('\n'));
      return false;
    } else {
      return true;
    }
  }
  const handleCreateTournament = () => {
    if (!validateTournamentName(tournamentName)) {
      return;
    }

    const newTournament = {
      name: tournamentName,
      participants: [],
      type: selectedType,
    };

    const existingTournaments = JSON.parse(localStorage.getItem('existingTournaments') || '[]');

    existingTournaments.push(newTournament);

    localStorage.setItem('existingTournaments', JSON.stringify(existingTournaments));

    navigate(`/tournament/${tournamentName}`);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ padding: 24, background: 'white', borderRadius: 8, maxWidth: 400, margin: 'auto' }}>
        <Typography variant="h6">Create New Tournament</Typography>
        <TextField
          label="Tournament Name"
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
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

        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateTournament}
          fullWidth
        >
          Create Tournament
        </Button>
      </div>
    </Modal>
  );
};

export default TournamentCreationModal;