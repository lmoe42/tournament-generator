// src/components/TournamentStrongman.tsx

import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PersonIcon from '@mui/icons-material/Person';
import React from 'react';
import { Tournament } from '../types'; // Ensure you import your types

interface TournamentStrongmanProps {
  tournament: Tournament; // Received tournament object
}

const TournamentStrongman: React.FC<TournamentStrongmanProps> = ({ tournament }) => {
  const { name, participants } = tournament; // Destructure tournament
  const events = tournament.events ?? []; // Destructure events with default value

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        {name}
      </Typography>

      {/* Table for Events and Participants */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Participants</TableCell>
              {events.length > 0 ? (
                events.map((event, index) => (
                  <TableCell key={index} colSpan={2}>
                    {event.name} {/* Assuming event has a name property */}
                  </TableCell>
                ))
              ) : (
                <TableCell colSpan={2}>No Events yet</TableCell>
              )}
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              {events.map((_, index) => (
                <React.Fragment key={index}>
                  <TableCell>Result</TableCell>
                  <TableCell>Place</TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(participants.length === 0 && events.length === 0) ? (
              <TableRow>
                <TableCell>TBD</TableCell>
                {events.map((_, index) => (
                  <React.Fragment key={index}>
                    <TableCell>TBD</TableCell>
                    <TableCell>TBD</TableCell>
                  </React.Fragment>
                ))}
              </TableRow>
            ) : (
              participants.map((participant, participantIndex) => (
                <TableRow key={participantIndex}>
                  <TableCell>{participant}</TableCell>
                  {events.map((event, eventIndex) => (
                    <React.Fragment key={eventIndex}>
                      <TableCell>{event.results ?? 'N/A'}</TableCell>
                      <TableCell>{event.places?.[participantIndex] || 'N/A'}</TableCell>
                    </React.Fragment>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Buttons */}
      <div style={{ marginTop: '20px' }}>
        <Button variant="contained" color="primary" startIcon={<PersonIcon />} style={{ marginRight: '10px' }}>
          Manage Participants
        </Button>
        <Button variant="contained" color="primary" startIcon={<FitnessCenterIcon />}>
          Manage Events
        </Button>
      </div>
    </div>
  );
};

export default TournamentStrongman;