// src/components/ParticipantsModal.tsx

import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import { Tournament } from '../types';
import { saveTournament } from '../logic/persistance';

interface ParticipantsModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (participants: string) => void;
  tournament: Tournament;
}

const ParticipantsModal: React.FC<ParticipantsModalProps> = ({ open, onClose, onUpdate, tournament }) => {
  const { participants } = tournament;
  const [newParticipants, setNewParticipants] = useState('');
  const [currentParticipants, setCurrentParticipants] = useState(participants);

  const handleDeleteParticipant = (participantToDelete: string) => {
    const updatedParticipants = participants.filter(participant => participant !== participantToDelete);
    tournament.participants = updatedParticipants;
    setCurrentParticipants(updatedParticipants);
    saveTournament(tournament);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ padding: '20px', background: 'white', borderRadius: '8px', maxWidth: '400px', margin: 'auto', marginTop: '100px' }}>
        <Typography variant="h6">Participants</Typography>
        
        <List>
          {participants.length === 0 ? (
            <ListItem>
              <ListItemText primary="No participants yet." />
            </ListItem>
          ) : (
            currentParticipants.map((participant, index) => (
              <ListItem key={index} secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteParticipant(participant)}>
                  <DeleteIcon color="error" />
                </IconButton>
              }>
                <ListItemText primary={participant} />
              </ListItem>
            ))
          )}
        </List>

        <Tooltip title="Add participants here (you can add multiple participants separated via comma)">
          <TextField
            label="Add Participants"
            value={newParticipants}
            onChange={e => setNewParticipants(e.target.value)}
            fullWidth
            margin="normal"
          />
        </Tooltip>
        
        <Button variant="contained" color="primary" onClick={() => onUpdate(newParticipants)} style={{ marginTop: '10px' }}>
          Add
        </Button>
      </div>
    </Modal>
  );
};

export default ParticipantsModal;