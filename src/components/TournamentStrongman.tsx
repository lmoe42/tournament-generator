// src/components/TournamentStrongman.tsx

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Paper,
  Stack,
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

const pageSx = {
  px: { xs: 2, md: 3 },
  py: { xs: 2, md: 3 },
};

const panelSx = {
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2,
  boxShadow: '0 10px 28px rgba(19, 58, 20, 0.06)',
  overflow: 'hidden',
};

const eventHeaderSx = {
  bgcolor: '#f4f8f3',
  borderRight: '1px solid',
  borderColor: 'divider',
  color: 'primary.dark',
  fontWeight: 900,
  textAlign: 'center',
};

const subHeaderSx = {
  bgcolor: '#fbfcfb',
  borderRight: '1px solid',
  borderColor: 'divider',
};

const resultCellSx = {
  borderRight: '1px solid',
  borderColor: 'divider',
  minWidth: 120,
};

const pointsCellSx = {
  borderRight: '1px solid',
  borderColor: 'divider',
  color: 'primary.dark',
  fontWeight: 900,
  textAlign: 'center',
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

const getEventResultCount = (eventResults: EventResults | undefined, eventName: string): number => {
  return Object.keys(eventResults?.[eventName] ?? {}).length;
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

  const events = tournament.events ?? [];
  const totalResultFields = tournament.participants.length * events.length;
  const completedResultFields = events.reduce(
    (sum, event) => sum + getEventResultCount(tournament.eventResults, event.name),
    0,
  );
  const openResultFields = Math.max(totalResultFields - completedResultFields, 0);
  const completionPercent = totalResultFields > 0 ? Math.round((completedResultFields / totalResultFields) * 100) : 0;

  return (
    <Box sx={pageSx}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 2.5 }}>
        <Box>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 800 }}>
            Strongman
          </Typography>
          <Typography variant="h4">{tournament.name}</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {tournament.participants.length} Teilnehmer · {events.length} Events · {openResultFields} offene Felder
          </Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button variant="outlined" startIcon={<PersonIcon />} onClick={handleOpenParticipantsModal}>
            Teilnehmer
          </Button>
          <Button variant="outlined" startIcon={<FitnessCenterIcon />} onClick={handleOpenEventsModal}>
            Events
          </Button>
          <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={clearResults}>
            Ergebnisse leeren
          </Button>
          <Button variant="contained" startIcon={<AssignmentTurnedInIcon />} onClick={finishTournament}>
            Turnier abschliessen
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 320px' },
        }}
      >
        <TableContainer component={Paper} sx={panelSx}>
          <Box
            sx={{
              alignItems: { xs: 'flex-start', sm: 'center' },
              bgcolor: '#fbfcfb',
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1,
              justifyContent: 'space-between',
              px: 2,
              py: 1.5,
            }}
          >
            <Typography variant="h6">Gesamtwertung</Typography>
            <Stack direction="row" spacing={1}>
              <Chip label={`${completedResultFields}/${totalResultFields} Felder`} size="small" />
              <Chip label={`${completionPercent}%`} size="small" color="secondary" variant="outlined" />
            </Stack>
          </Box>
          <Table stickyHeader size="small" sx={{ minWidth: Math.max(720, 220 + events.length * 220 + 150) }}>
            <TableHead>
              <TableRow>
                <TableCell
                  rowSpan={2}
                  sx={{
                    bgcolor: '#fbfcfb',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    borderRight: '1px solid',
                    fontWeight: 900,
                    minWidth: 180,
                  }}
                >
                  Teilnehmer
                </TableCell>
                {events.length > 0 ? (
                  events.map((event) => (
                    <TableCell key={event.name} colSpan={2} sx={eventHeaderSx}>
                      <TableSortLabel
                        active={orderBy === event.name}
                        direction={orderBy === event.name ? order : 'asc'}
                        hideSortIcon={false}
                        onClick={() => sortTable(event.name)}
                      >
                        {event.name}
                      </TableSortLabel>
                    </TableCell>
                  ))
                ) : (
                  <TableCell colSpan={2} sx={eventHeaderSx}>
                    Keine Events
                  </TableCell>
                )}
                <TableCell colSpan={2} sx={{ ...eventHeaderSx, borderRight: 0 }}>
                  <TableSortLabel
                    active={orderBy === 'overall'}
                    direction={orderBy === 'overall' ? order : 'asc'}
                    hideSortIcon={false}
                    onClick={() => sortTable('overall')}
                  >
                    Overall
                  </TableSortLabel>
                </TableCell>
              </TableRow>
              <TableRow>
                {events.map((event) => (
                  <React.Fragment key={event.name}>
                    <TableCell sx={subHeaderSx}>Ergebnis</TableCell>
                    <TableCell sx={subHeaderSx}>Punkte</TableCell>
                  </React.Fragment>
                ))}
                <TableCell sx={subHeaderSx}>Punkte</TableCell>
                <TableCell sx={{ ...subHeaderSx, borderRight: 0 }}>Platz</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tournament.participants.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={events.length * 2 + 3}
                    sx={{ color: 'text.secondary', py: 4, textAlign: 'center' }}
                  >
                    Noch keine Teilnehmer vorhanden.
                  </TableCell>
                </TableRow>
              ) : (
                sortedParticipants.map((participant) => (
                  <TableRow key={participant} hover>
                    <TableCell sx={{ borderRight: '1px solid', borderColor: 'divider', fontWeight: 800 }}>
                      {participant}
                    </TableCell>
                    {events.map((event) => (
                      <React.Fragment key={event.name}>
                        <TableCell sx={resultCellSx}>
                          <TextField
                            key={`${participant}-${event.name}`}
                            variant="outlined"
                            size="small"
                            inputProps={{ 'aria-label': `${participant} ${event.name} result` }}
                            defaultValue={tournament.eventResults?.[event.name]?.[participant]?.performance}
                            onChange={(e) => {
                              setEventResult(e.target.value, participant, event.name);
                            }}
                            sx={{
                              minWidth: 96,
                              '& .MuiInputBase-input': {
                                py: 0.75,
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell sx={pointsCellSx}>
                          {tournament.eventResults?.[event.name]?.[participant]?.points}
                        </TableCell>
                      </React.Fragment>
                    ))}
                    <TableCell sx={pointsCellSx}>{tournament.overall?.[participant]?.points}</TableCell>
                    <TableCell sx={{ color: 'primary.dark', fontWeight: 900, textAlign: 'center' }}>
                      {tournament.overall?.[participant]?.place}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack spacing={2}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="h6">Eventstatus</Typography>
              <Chip label={`${completionPercent}%`} size="small" color="secondary" variant="outlined" />
            </Stack>
            <Stack spacing={1.5}>
              {events.length === 0 ? (
                <Typography color="text.secondary">Lege Events an, um Ergebnisse einzutragen.</Typography>
              ) : (
                events.map((event) => {
                  const completed = getEventResultCount(tournament.eventResults, event.name);
                  const eventPercent =
                    tournament.participants.length > 0
                      ? Math.round((completed / tournament.participants.length) * 100)
                      : 0;

                  return (
                    <Box key={event.name}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                        <Typography sx={{ fontWeight: 800 }}>{event.name}</Typography>
                        <Typography color="text.secondary" variant="body2">
                          {completed}/{tournament.participants.length}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        aria-label={`${event.name} completion`}
                        variant="determinate"
                        value={eventPercent}
                        sx={{
                          bgcolor: '#edf0ed',
                          borderRadius: 999,
                          height: 8,
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 999,
                          },
                        }}
                      />
                    </Box>
                  );
                })
              )}
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Aktive Aktionen
            </Typography>
            <Stack spacing={1}>
              <Button fullWidth variant="outlined" startIcon={<PersonIcon />} onClick={handleOpenParticipantsModal}>
                Teilnehmer verwalten
              </Button>
              <Button fullWidth variant="outlined" startIcon={<FitnessCenterIcon />} onClick={handleOpenEventsModal}>
                Events verwalten
              </Button>
            </Stack>
          </Paper>
        </Stack>
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
        <DialogTitle>Ergebnisse leeren</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sollen alle Event-Ergebnisse fuer {tournament.name} zurueckgesetzt werden?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearResultsDialogOpen(false)}>Abbrechen</Button>
          <Button color="error" variant="contained" onClick={handleConfirmClearResults}>
            Leeren
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TournamentStrongman;
