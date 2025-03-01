import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Modal,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { StrongmanEvent, StrongmanEventTypes, Tournament } from '../types';

import AddIcon from '@mui/icons-material/Add';

interface EventsModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (events: StrongmanEvent[]) => void;
  tournament: Tournament;
}

const EventsModal: React.FC<EventsModalProps> = ({ open, onClose, onUpdate,tournament }) => {
  const [newEventName, setNewEventName] = useState('');
  const [newEventType, setNewEventType] = useState<StrongmanEventTypes>(StrongmanEventTypes.WEIGHT);
  const [events, setEvents] = useState<StrongmanEvent[]>(tournament.events || []);

  const handleAddEvent = () => {
    if (newEventName.trim()) {
      const newEvent: StrongmanEvent = {
        name: newEventName,
        type: newEventType,
      };
      setEvents([...events, newEvent]);
      setNewEventName('');
      setNewEventType(StrongmanEventTypes.WEIGHT);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ padding: 24, background: 'white', borderRadius: 8, maxWidth: 400, margin: 'auto' }}>
        <Typography variant="h6">Manage Events for {tournament.name}</Typography>
        
        <List>
          {events.map((event, index) => (
            <ListItem key={index}>
              <ListItemText primary={event.name} secondary={`Type: ${event.type}`} />
            </ListItem>
          ))}
        </List>

        <Box display="flex" alignItems="center" marginBottom={2}> {/* Flex container */}
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

          <IconButton onClick={handleAddEvent} color="primary" style={{ marginLeft: '8px' }}>
            <AddIcon />
          </IconButton>
        </Box>

        <Button variant="contained" color="primary" onClick={() => onUpdate(events)} fullWidth style={{ marginTop: '16px' }}>
          Save Events
        </Button>
      </div>
    </Modal>
  );
};

export default EventsModal;