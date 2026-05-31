// src/components/ParticipantsModal.tsx

import { Button, IconButton, List, ListItem, ListItemText, Modal, TextField, Tooltip, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import React, { useEffect, useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import { Tournament } from 'types';

interface ParticipantsModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (participants: string[]) => void;
  tournament: Tournament;
}

const ParticipantsModal: React.FC<ParticipantsModalProps> = ({ open, onClose, onUpdate, tournament }) => {
  const { participants } = tournament;
  const [newParticipants, setNewParticipants] = useState('');
  const [currentParticipants, setCurrentParticipants] = useState(participants);

  useEffect(() => {
    if (open) {
      setCurrentParticipants(participants);
      setNewParticipants('');
    }
  }, [open, participants]);

  const handleDeleteParticipant = (participantToDelete: string) => {
    const updatedParticipants = currentParticipants.filter((participant) => participant !== participantToDelete);
    setCurrentParticipants(updatedParticipants);
  };

  const handleConfirm = () => {
    const participantsToAdd = newParticipants
      .split(',')
      .map((participant) => participant.trim())
      .filter(Boolean);

    onUpdate([...currentParticipants, ...participantsToAdd]);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="participants-modal-title"
      aria-describedby="participants-modal-description"
    >
      <div
        style={{
          padding: '20px',
          background: 'white',
          borderRadius: '8px',
          maxWidth: '400px',
          margin: 'auto',
          marginTop: '100px',
        }}
      >
        <Typography id="participants-modal-title" variant="h6">
          Participants
        </Typography>
        <Typography id="participants-modal-description" sx={visuallyHidden}>
          Add, review, or remove tournament participants.
        </Typography>

        <List>
          {currentParticipants.length === 0 ? (
            <ListItem>
              <ListItemText primary="No participants yet." />
            </ListItem>
          ) : (
            currentParticipants.map((participant) => (
              <ListItem
                key={participant}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label={`delete ${participant}`}
                    onClick={() => handleDeleteParticipant(participant)}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                }
              >
                <ListItemText primary={participant} />
              </ListItem>
            ))
          )}
        </List>

        <Tooltip title="Add participants here (you can add multiple participants separated via comma)" describeChild>
          <TextField
            label="Add Participants"
            value={newParticipants}
            onChange={(e) => setNewParticipants(e.target.value)}
            fullWidth
            margin="normal"
          />
        </Tooltip>

        <Button variant="contained" color="primary" onClick={handleConfirm} style={{ marginTop: '10px' }}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default ParticipantsModal;
