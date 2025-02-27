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

interface ParticipantsModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (participants: string[]) => void;
  tournament: Tournament;
}

const ParticipantsModal: React.FC<ParticipantsModalProps> = ({ open, onClose, tournament }) => {
  const { participants } = tournament;
  const [newParticipants, setNewParticipants] = useState('');

  const handleDeleteParticipant = (participantToDelete: string) => {

    const updatedParticipants = participants.filter(participant => participant !== participantToDelete);
    // Here, you should update the state of the tournament in the parent component that holds this modal
  };

  const handleAddParticipants = () => {
    if (newParticipants.trim()) {
      // Split names by comma and trim whitespace from each name
      const additionalParticipants = newParticipants.split(',')
        .map(participant => participant.trim())
        .filter(participant => participant); // Filter out any empty strings
      // Here, you should concatenate the participants with the previous state and call an update function in the parent component
      setNewParticipants(''); // Clear the input field after adding
    }
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
            participants.map((participant, index) => (
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
        
        <Button variant="contained" color="primary" onClick={handleAddParticipants} style={{ marginTop: '10px' }}>
          Add
        </Button>
      </div>
    </Modal>
  );
};

export default ParticipantsModal;