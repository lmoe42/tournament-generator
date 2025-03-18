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
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { StrongmanEvent, Tournament } from '../types';

import DeleteIcon from '@mui/icons-material/Delete';
import EventsModal from './EventsModal';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ParticipantsModal from './ParticipantsModal';
import PersonIcon from '@mui/icons-material/Person';
import { Theme } from '@mui/material/styles';
import { calculatePoints } from 'logic/resultCalculation';
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
  initialTournament: Tournament;
}

const TournamentStrongman: React.FC<TournamentStrongmanProps> = ({ initialTournament }) => {
  const classes = useStyles();

  const [tournament, setTournament] = useState(initialTournament);
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
  const [eventsModalOpen, setEventsModalOpen] = useState(false);

  const handleOpenParticipantsModal = () => setParticipantsModalOpen(true);
  const handleCloseParticipantsModal = () => setParticipantsModalOpen(false);
  const handleOpenEventsModal = () => setEventsModalOpen(true);
  const handleCloseEventsModal = () => setEventsModalOpen(false);

  const updateTournament = (tournament: Tournament) => {
    setTournament(tournament);
    saveTournament(tournament);
  }

  const updateParticipants = (newParticipants: string) => {
    const participants = newParticipants.split(',');
    const currentTournament = { ...tournament };
    participants.forEach((participant) => {
      if (participant.trim()) {
        currentTournament.participants.push(participant);
      }
    });
    updateTournament(currentTournament);
    handleCloseParticipantsModal();
  };

  const updateEvents = (updatedEvents: StrongmanEvent[]) => {
    const currentTournament = { ...tournament };
    currentTournament.events = updatedEvents;
    updateTournament(currentTournament);
    handleCloseEventsModal();
  };

  const setEventResult = (result: string, participant: string, event: string): void => {
    const performance = result.replace(/[^0-9.]/g, '');    let currentTournament = { ...tournament };
    currentTournament.eventResults = currentTournament.eventResults || {};
    currentTournament.eventResults[event] = currentTournament.eventResults[event] || {}
    currentTournament.eventResults[event][participant] = currentTournament.eventResults[event][participant] || {}
    currentTournament.eventResults[event][participant].performance = parseInt(performance);
    currentTournament = calculatePoints(tournament);
    updateTournament(currentTournament);
  }

  const clearResults = (): void => {
    const confirmDelete = window.confirm(`Are you sure you want to delete reset all event results for ${tournament.name}?`);
    if (confirmDelete) {
      const currentTournament = { ...tournament };
      currentTournament.eventResults = {};
      updateTournament(currentTournament);
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <Box className={classes.headerBox}>
        <Typography variant="h4">{tournament.name}</Typography>
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
              {tournament.events!.length > 0 ? (
                tournament.events?.map((event, index) => (
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
              <TableCell
                colSpan={2}
                sx={{
                  textAlign: 'center', // Centered text
                  fontWeight: 'bold', // Example of bold text
                }}
              >
                Overall
              </TableCell>
            </TableRow>
            <TableRow style={{ borderBottom: '3px solid rgba(224, 224, 224, 1)' }}>
              {tournament.events?.map((_, index) => (
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
            {tournament.participants.length === 0 && tournament.events?.length === 0 ? (
              <TableRow>
                <TableCell>TBD</TableCell>
                {tournament.events?.map((_, index) => (
                  <React.Fragment key={index}>
                    <TableCell>TBD</TableCell>
                    <TableCell>TBD</TableCell>
                  </React.Fragment>
                ))}
                <TableCell>TBD</TableCell>
                <TableCell>TBD</TableCell>
              </TableRow>
            ) : (
              tournament.participants.map((participant, participantIndex) => (
                <TableRow key={participantIndex}>
                  <TableCell style={{ borderRight: '3px solid rgba(224, 224, 224, 1)' }}>{participant}</TableCell>
                  {tournament.events?.map((event, eventIndex) => (
                    <React.Fragment key={eventIndex}>
                      <TableCell style={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                        <TextField
                          variant="standard"
                          size="small"
                          value={tournament.eventResults && tournament.eventResults[event.name] && tournament.eventResults[event.name][participant]?.performance}
                          onChange={(e) => {
                            setEventResult(e.target.value, participant, event.name);
                          }}
                        />
                      </TableCell>
                      <TableCell style={{ borderRight: '3px solid rgba(224, 224, 224, 1)' }}>
                        {tournament.eventResults && tournament.eventResults[event.name] && tournament.eventResults[event.name][participant]?.points}
                      </TableCell>
                    </React.Fragment>
                  ))}
                  {/* Overall Placeholders */}
                  <TableCell style={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>{tournament.overall && tournament.overall[participant]?.points}</TableCell>
                  <TableCell>{tournament.overall && tournament.overall[participant]?.place}</TableCell>
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
        <Button variant="contained" color="primary" startIcon={<FitnessCenterIcon />} style={{ marginRight: '10px' }} onClick={handleOpenEventsModal}>
          Manage Events
        </Button>
        <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={clearResults}>
          clear Results
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
