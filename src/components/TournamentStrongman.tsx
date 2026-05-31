// src/components/TournamentStrongman.tsx

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import DeleteIcon from '@mui/icons-material/Delete';
import EventsModal from 'components/EventsModal';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ParticipantsModal from 'components/ParticipantsModal';
import PersonIcon from '@mui/icons-material/Person';
import { calculatePoints } from 'logic/resultCalculation';
import { saveTournament } from 'logic/persistence';
import { EndResult, EventResults, StrongmanEvent, Tournament } from 'types';
import { useNavigate } from 'react-router-dom';

const headerSx = {
  backgroundColor: 'primary.dark',
  color: 'white',
  padding: '16px',
  textAlign: 'center',
  width: '50%',
  margin: '0 auto',
  borderRadius: 2,
  marginBottom: 2.5,
  boxShadow: '3px 3px 5px rgba(0, 0, 0, 0.3)',
};

const cloneEventResults = (eventResults?: EventResults): EventResults => {
  return Object.fromEntries(
    Object.entries(eventResults ?? {}).map(([eventName, result]) => [
      eventName,
      Object.fromEntries(Object.entries(result).map(([participant, score]) => [participant, { ...score }])),
    ]),
  );
};

const pruneEventResults = (eventResults: EventResults | undefined, participants: string[]): EventResults => {
  const participantSet = new Set(participants);

  return Object.fromEntries(
    Object.entries(eventResults ?? {}).map(([eventName, result]) => [
      eventName,
      Object.fromEntries(
        Object.entries(result)
          .filter(([participant]) => participantSet.has(participant))
          .map(([participant, score]) => [participant, { ...score }]),
      ),
    ]),
  );
};

const pruneOverall = (overall: EndResult | undefined, participants: string[]): EndResult | undefined => {
  if (!overall) {
    return undefined;
  }

  const participantSet = new Set(participants);
  return Object.fromEntries(
    Object.entries(overall)
      .filter(([participant]) => participantSet.has(participant))
      .map(([participant, placing]) => [participant, { ...placing }]),
  );
};

const normalizeParticipants = (participants: string[]): string[] => {
  return Array.from(new Set(participants.map((participant) => participant.trim()).filter(Boolean)));
};

const hasEnteredResults = (eventResults?: EventResults): boolean => {
  return Object.values(eventResults ?? {}).some((result) => Object.keys(result).length > 0);
};

const parsePerformance = (result: string): number => {
  const performance = Number.parseFloat(result.replace(/[^0-9.]/g, ''));
  return Number.isFinite(performance) ? performance : 0;
};

interface TournamentStrongmanProps {
  initialTournament: Tournament;
}

const TournamentStrongman: React.FC<TournamentStrongmanProps> = ({ initialTournament }) => {
  const navigate = useNavigate();

  const [tournament, setTournament] = useState(initialTournament);

  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
  const [eventsModalOpen, setEventsModalOpen] = useState(false);
  const [clearResultsDialogOpen, setClearResultsDialogOpen] = useState(false);

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState('');
  const [sortedParticipants, setSortedParticipants] = useState<string[]>([...tournament.participants]);

  const handleOpenParticipantsModal = () => setParticipantsModalOpen(true);
  const handleCloseParticipantsModal = () => setParticipantsModalOpen(false);
  const handleOpenEventsModal = () => setEventsModalOpen(true);
  const handleCloseEventsModal = () => setEventsModalOpen(false);

  const updateTournament = (tournament: Tournament) => {
    setTournament(tournament);
    saveTournament(tournament);
  };

  const updateParticipants = (participants: string[]) => {
    const updatedParticipants = normalizeParticipants(participants);
    let currentTournament: Tournament = {
      ...tournament,
      participants: updatedParticipants,
      eventResults: pruneEventResults(tournament.eventResults, updatedParticipants),
      overall: pruneOverall(tournament.overall, updatedParticipants),
    };

    if (hasEnteredResults(currentTournament.eventResults)) {
      currentTournament = calculatePoints(currentTournament);
    }

    updateTournament(currentTournament);
    setSortedParticipants([...currentTournament.participants]);
    handleCloseParticipantsModal();
  };

  const updateEvents = (updatedEvents: StrongmanEvent[]) => {
    const eventNames = new Set(updatedEvents.map((event) => event.name));
    let currentTournament: Tournament = {
      ...tournament,
      events: updatedEvents.map((event) => ({ ...event })),
      eventResults: Object.fromEntries(
        Object.entries(tournament.eventResults ?? {}).filter(([eventName]) => eventNames.has(eventName)),
      ),
    };

    if (hasEnteredResults(currentTournament.eventResults)) {
      currentTournament = calculatePoints(currentTournament);
    } else {
      currentTournament.overall = undefined;
    }

    updateTournament(currentTournament);
    handleCloseEventsModal();
  };

  const setEventResult = (result: string, participant: string, event: string): void => {
    const eventResults = cloneEventResults(tournament.eventResults);
    eventResults[event] = eventResults[event] || {};
    eventResults[event][participant] = {
      points: eventResults[event][participant]?.points ?? 0,
      performance: parsePerformance(result),
    };

    let currentTournament: Tournament = { ...tournament, eventResults };
    currentTournament = calculatePoints(currentTournament);
    updateTournament(currentTournament);
  };

  const clearResults = (): void => {
    setClearResultsDialogOpen(true);
  };

  const handleConfirmClearResults = (): void => {
    const currentTournament = { ...tournament, eventResults: {}, overall: undefined };
    updateTournament(currentTournament);
    setSortedParticipants([...currentTournament.participants]);
    setClearResultsDialogOpen(false);
  };

  const sortByPoints = (property: string, isAsc: boolean) => (a: string, b: string) => {
    const getPoints = (participant: string) =>
      property === 'overall'
        ? tournament.overall?.[participant]?.points ?? 0
        : tournament.eventResults?.[property]?.[participant]?.points ?? 0;
    return isAsc ? getPoints(a) - getPoints(b) : getPoints(b) - getPoints(a);
  };

  const sortTable = (property: string) => {
    const nextOrder = orderBy === property && order === 'asc' ? 'desc' : 'asc';
    const isAsc = nextOrder === 'asc';
    setOrder(nextOrder);
    setOrderBy(property);

    const ordered = [...tournament.participants].sort(sortByPoints(property, isAsc));
    setSortedParticipants(ordered);
  };

  const finishTournament = () => {
    const ordered = [...tournament.participants].sort(sortByPoints('overall', false));
    const updatedTournament = { ...tournament, participants: ordered };
    updateTournament(updatedTournament);
    navigate(`/tournament/${encodeURIComponent(tournament.name)}/results`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Box sx={headerSx}>
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
              {tournament.events && tournament.events.length > 0 ? (
                tournament.events.map((event) => (
                  <TableCell
                    key={event.name}
                    colSpan={2}
                    sx={{
                      borderRight: '3px solid rgba(224, 224, 224, 1)',
                      textAlign: 'center', // Centered text
                      fontWeight: 'bold', // Example of bold text
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === event.name} // Determine if this column is active
                      direction={order} // Get current sort direction
                      onClick={() => sortTable(event.name)} // Handle sorting
                      sx={{ cursor: 'pointer' }} // Add pointer style
                    >
                      {event.name}
                    </TableSortLabel>
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
                <TableSortLabel
                  active={orderBy === 'overall'} // Determine if this column is active
                  direction={order} // Get current sort direction
                  onClick={() => sortTable('overall')} // Handle sorting
                  sx={{ cursor: 'pointer' }} // Add pointer style
                >
                  Overall
                </TableSortLabel>
              </TableCell>
            </TableRow>
            <TableRow style={{ borderBottom: '3px solid rgba(224, 224, 224, 1)' }}>
              {tournament.events?.map((event) => (
                <React.Fragment key={event.name}>
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
                {tournament.events?.map((event) => (
                  <React.Fragment key={event.name}>
                    <TableCell>TBD</TableCell>
                    <TableCell>TBD</TableCell>
                  </React.Fragment>
                ))}
                <TableCell>TBD</TableCell>
                <TableCell>TBD</TableCell>
              </TableRow>
            ) : (
              sortedParticipants.map((participant) => (
                <TableRow key={participant}>
                  <TableCell style={{ borderRight: '3px solid rgba(224, 224, 224, 1)' }}>{participant}</TableCell>
                  {tournament.events?.map((event) => (
                    <React.Fragment key={event.name}>
                      <TableCell style={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                        <TextField
                          key={`${participant}-${event.name}`}
                          variant="standard"
                          size="small"
                          inputProps={{ 'aria-label': `${participant} ${event.name} result` }}
                          defaultValue={
                            tournament.eventResults &&
                            tournament.eventResults[event.name] &&
                            tournament.eventResults[event.name][participant]?.performance
                          }
                          onChange={(e) => {
                            setEventResult(e.target.value, participant, event.name);
                          }}
                        />
                      </TableCell>
                      <TableCell style={{ borderRight: '3px solid rgba(224, 224, 224, 1)' }}>
                        {tournament.eventResults &&
                          tournament.eventResults[event.name] &&
                          tournament.eventResults[event.name][participant]?.points}
                      </TableCell>
                    </React.Fragment>
                  ))}
                  {/* Overall Placeholders */}
                  <TableCell style={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                    {tournament.overall && tournament.overall[participant]?.points}
                  </TableCell>
                  <TableCell>{tournament.overall && tournament.overall[participant]?.place}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonIcon />}
            sx={{ mr: 1 }}
            onClick={handleOpenParticipantsModal}
          >
            Manage Participants
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FitnessCenterIcon />}
            sx={{ mr: 1 }}
            onClick={handleOpenEventsModal}
          >
            Manage Events
          </Button>
          <Button variant="contained" color="error" startIcon={<DeleteIcon />} sx={{ mr: 1 }} onClick={clearResults}>
            Clear Results
          </Button>
        </Box>

        <Button variant="contained" color="primary" startIcon={<AssignmentTurnedInIcon />} onClick={finishTournament}>
          Finish Tournament
        </Button>
      </Box>

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

      <Dialog open={clearResultsDialogOpen} onClose={() => setClearResultsDialogOpen(false)}>
        <DialogTitle>Clear Results</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to reset all event results for {tournament.name}?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearResultsDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmClearResults}>
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TournamentStrongman;
