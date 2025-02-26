// src/components/StrongmanTournament.tsx

import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'; // Icon for events
import PersonIcon from '@mui/icons-material/Person'; // Icon for participants
import React from 'react';
import type { StrongmanTournament } from '../types/events';

interface StrongmanTournamentProps {
  tournament: StrongmanTournament
}

const StrongmanTournamentComponent: React.FC<StrongmanTournamentProps> = ({ tournament }) => {
  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        {tournament.name}
      </Typography>

      {/* Table for Events and Participants */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Participants</TableCell>
              {tournament.events.map((event, index) => (
                <TableCell key={index} colSpan={2}>
                  {event.name}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              {tournament.events.map((_, index) => (
                <React.Fragment key={index}>
                  <TableCell>Result</TableCell>
                  <TableCell>Place</TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tournament.participants.length === 0 ? (
              <TableRow>
                <TableCell>TBD</TableCell>
                {tournament.events.map((_, index) => (
                  <React.Fragment key={index}>
                    <TableCell>TBD</TableCell>
                    <TableCell>TBD</TableCell>
                  </React.Fragment>
                ))}
              </TableRow>
            ) : (
              tournament.participants.map((participant, index) => (
                <TableRow key={index}>
                  <TableCell>{participant}</TableCell>
                  {tournament.events.map((event, eventIndex) => (
                    <React.Fragment key={eventIndex}>
                      <TableCell>{event.results || 'N/A'}</TableCell>
                      <TableCell>{event.places[index] || 'N/A'}</TableCell>
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
        <Button variant="contained" color="secondary" startIcon={<PersonIcon />} style={{ marginRight: '10px' }}>
          Manage Participants
        </Button>
        <Button variant="contained" color="primary" startIcon={<FitnessCenterIcon />}>
          Manage Events
        </Button>
      </div>
    </div>
  );
};

export default StrongmanTournamentComponent;