// src/components/TournamentStrongman.tsx

import {
  Box,
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
import React, { useState } from 'react';
import { StrongmanEvent, Tournament } from '../types';

import EventsModal from './EventsModal';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ParticipantsModal from './ParticipantsModal';
import PersonIcon from '@mui/icons-material/Person';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { saveTournament } from 'logic/persistance';

const useStyles = makeStyles((theme: Theme) => ({
  headerBox: {
    backgroundColor: theme.palette.primary.dark,
    color: 'white',
    padding: '16px',
    textAlign: 'center',
    width: '50%',
    margin: '0 auto',
    borderRadius: 20,
    marginBottom: 20,
    boxShadow: '3px 3px 5px rgba(0, 0, 0, 0.3)',
  },
}));

interface TournamentStrongmanProps {
  tournament: Tournament;
}

const TournamentStrongman: React.FC<TournamentStrongmanProps> = ({ tournament }) => {
  const classes = useStyles();

  const { name, participants } = tournament;
  const events = tournament.events ?? [];

  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
  const [eventsModalOpen, setEventsModalOpen] = useState(false);

  const handleOpenParticipantsModal = () => setParticipantsModalOpen(true);
  const handleCloseParticipantsModal = () => setParticipantsModalOpen(false);
  const handleOpenEventsModal = () => setEventsModalOpen(true);
  const handleCloseEventsModal = () => setEventsModalOpen(false);

  const updateParticipants = (newParticipants: string) => {
    const participants = newParticipants.split(',');
    participants.forEach((participant) => {
      if (participant.trim()){
        tournament.participants.push(participant);
      }
    });
    saveTournament(tournament);
    handleCloseParticipantsModal();
  };

  const updateEvents = (updatedEvents: StrongmanEvent[]) => {
    tournament.events = updatedEvents;
    saveTournament(tournament);
    handleCloseEventsModal();
  };

  return (
    <div style={{ padding: '20px' }}>
      <Box className={classes.headerBox}>
        <Typography variant="h4">{name}</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                rowSpan={2}
                sx={{
                  borderRight: '3px solid rgba(224, 224, 224, 1)',
                  borderBottom: '3px solid rgba(224, 224, 224, 1)',
                  textAlign: 'center', // Centered text
                  fontWeight: 'bold', // Example of bold text
                }}
              >
                Participants
              </TableCell>
              {events.length > 0 ? (
                events.map((event, index) => (
                  <TableCell
                    key={index}
                    colSpan={2}
                    sx={{
                      borderRight: '3px solid rgba(224, 224, 224, 1)',
                      textAlign: 'center', // Centered text
                      fontWeight: 'bold', // Example of bold text
                    }}
                  >
                    {event.name}
                  </TableCell>
                ))
              ) : (
                <TableCell colSpan={2}>No Events yet</TableCell>
              )}
              <TableCell colSpan={2} sx={{
                  textAlign: 'center', // Centered text
                  fontWeight: 'bold', // Example of bold text
                }}>Overall</TableCell>
            </TableRow>
            <TableRow style={{ borderBottom: '3px solid rgba(224, 224, 224, 1)' }}>
              {events.map((_, index) => (
                <React.Fragment key={index}>
                  <TableCell style={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Results</TableCell>
                  <TableCell style={{ borderRight: '3px solid rgba(224, 224, 224, 1)' }}>Points</TableCell>
                </React.Fragment>
              ))}
              {/* Overall Subcolumns */}
              <TableCell style={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Points</TableCell>
              <TableCell>Place</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participants.length === 0 && events.length === 0 ? (
              <TableRow>
                <TableCell>TBD</TableCell>
                {events.map((_, index) => (
                  <React.Fragment key={index}>
                    <TableCell>TBD</TableCell>
                    <TableCell>TBD</TableCell>
                  </React.Fragment>
                ))}
                <TableCell>TBD</TableCell>
                <TableCell>TBD</TableCell>
              </TableRow>
            ) : (
              participants.map((participant, participantIndex) => (
                <TableRow key={participantIndex}>
                  <TableCell style={{ borderRight: '3px solid rgba(224, 224, 224, 1)' }}>{participant}</TableCell>
                  {events.map((event, eventIndex) => (
                    <React.Fragment key={eventIndex}>
                      <TableCell style={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}></TableCell>
                      <TableCell style={{ borderRight: '3px solid rgba(224, 224, 224, 1)' }}></TableCell>
                    </React.Fragment>
                  ))}
                  {/* Overall Placeholders */}
                  <TableCell style={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ marginTop: '20px' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonIcon />}
          style={{ marginRight: '10px' }}
          onClick={handleOpenParticipantsModal}
        >
          Manage Participants
        </Button>
        <Button variant="contained" color="primary" startIcon={<FitnessCenterIcon />} onClick={handleOpenEventsModal}>
          Manage Events
        </Button>
      </div>

      <ParticipantsModal
        open={participantsModalOpen}
        onClose={handleCloseParticipantsModal}
        onUpdate={updateParticipants}
        tournament={tournament}
      />

      <EventsModal
        open={eventsModalOpen}
        onClose={handleCloseEventsModal}
        onUpdate={updateEvents}
        tournament={tournament}
      />
    </div>
  );
};

export default TournamentStrongman;
