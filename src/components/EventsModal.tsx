import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Modal,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import React, { useEffect, useState } from 'react';
import { StrongmanEvent, StrongmanEventTypes, Tournament } from 'types';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface EventsModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (events: StrongmanEvent[]) => void;
  tournament: Tournament;
}

const EventsModal: React.FC<EventsModalProps> = ({ open, onClose, onUpdate, tournament }) => {
  const [newEventName, setNewEventName] = useState('');
  const [newEventType, setNewEventType] = useState<StrongmanEventTypes>(StrongmanEventTypes.WEIGHT);
  const [newEventHigherIsBetter, setNewEventHigherIsBetter] = useState(true);
  const [events, setEvents] = useState<StrongmanEvent[]>(tournament.events || []);

  useEffect(() => {
    if (open) {
      setEvents(tournament.events || []);
      setNewEventName('');
      setNewEventType(StrongmanEventTypes.WEIGHT);
      setNewEventHigherIsBetter(true);
    }
  }, [open, tournament.events]);

  const handleAddEvent = () => {
    if (newEventName.trim()) {
      const newEvent: StrongmanEvent = {
        name: newEventName.trim(),
        type: newEventType,
        ...(newEventType === StrongmanEventTypes.CUSTOM ? { higherIsBetter: newEventHigherIsBetter } : {}),
      };
      setEvents([...events, newEvent]);
      setNewEventName('');
      setNewEventType(StrongmanEventTypes.WEIGHT);
      setNewEventHigherIsBetter(true);
    }
  };

  const handleDeleteEvent = (eventToDelete: StrongmanEvent) => {
    const updatedEvents = events.filter((event) => event.name !== eventToDelete.name);
    setEvents(updatedEvents);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="events-modal-title"
      aria-describedby="events-modal-description"
    >
      <div style={{ padding: 24, background: 'white', borderRadius: 8, maxWidth: 400, margin: 'auto' }}>
        <Typography id="events-modal-title" variant="h6">
          Manage Events for {tournament.name}
        </Typography>
        <Typography id="events-modal-description" sx={visuallyHidden}>
          Add, review, or remove tournament events.
        </Typography>

        <List>
          {events.map((event) => (
            <ListItem
              key={event.name}
              secondaryAction={
                <IconButton edge="end" aria-label={`delete ${event.name}`} onClick={() => handleDeleteEvent(event)}>
                  <DeleteIcon color="error" />
                </IconButton>
              }
            >
              <ListItemText
                primary={event.name}
                secondary={
                  event.type === StrongmanEventTypes.CUSTOM
                    ? `Type: ${event.type}, ${event.higherIsBetter ?? true ? 'higher' : 'lower'} score wins`
                    : `Type: ${event.type}`
                }
              />
            </ListItem>
          ))}
        </List>

        <Box display="flex" alignItems="center" marginBottom={2}>
          {' '}
          {/* Flex container */}
          <TextField
            label="Event Name"
            value={newEventName}
            onChange={(e) => setNewEventName(e.target.value)}
            style={{ flexGrow: 1 }} // Allow the input to take available space
            margin="normal"
          />
          <TextField
            select
            label="Event Type"
            value={newEventType}
            onChange={(e) => setNewEventType(e.target.value as StrongmanEventTypes)}
            style={{ marginLeft: '8px', width: '150px' }} // Adjust width and spacing
            margin="normal"
          >
            {Object.values(StrongmanEventTypes).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <IconButton aria-label="add event" onClick={handleAddEvent} color="primary" style={{ marginLeft: '8px' }}>
            <AddIcon />
          </IconButton>
        </Box>
        {newEventType === StrongmanEventTypes.CUSTOM && (
          <FormControlLabel
            control={
              <Switch
                checked={newEventHigherIsBetter}
                onChange={(event) => setNewEventHigherIsBetter(event.target.checked)}
              />
            }
            label="Higher score wins"
          />
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={() => onUpdate(events)}
          fullWidth
          style={{ marginTop: '16px' }}
        >
          Save Events
        </Button>
      </div>
    </Modal>
  );
};

export default EventsModal;
