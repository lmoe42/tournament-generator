import {
  EventResult,
  EventResults,
  Placing,
  Score,
  StrongmanEvent,
  StrongmanEventTypes,
  StrongmanTournament,
} from 'types';

export const calculatePoints = (tournament: StrongmanTournament): StrongmanTournament => {
  const events = cloneEvents(tournament.events);
  const eventResults = cloneEventResults(tournament.eventResults);
  const updatedTournament: StrongmanTournament = {
    ...tournament,
    participants: [...tournament.participants],
    events,
    eventResults,
    overall: cloneOverall(tournament.overall),
  };
  const { participants } = updatedTournament;
  const maxPoints = participants.length;
  for (const event of events) {
    const direction = getDirection(event);
    if (eventResults[event.name]) {
      const eventResult = getEventResult(eventResults[event.name], maxPoints, direction);
      eventResults[event.name] = eventResult;
    }
  }
  return calculateOverall(updatedTournament);
};

const calculateOverall = (tournament: StrongmanTournament): StrongmanTournament => {
  const endResult =
    tournament.overall || Object.fromEntries(tournament.participants.map((key) => [key, { points: 0, place: 0 }]));

  for (const participant of tournament.participants) {
    let points = 0;
    if (!endResult[participant]) {
      endResult[participant] = { points: 0, place: 0 };
    }
    for (const event of tournament.events ?? []) {
      if (tournament.eventResults?.[event.name]?.[participant]) {
        points += tournament.eventResults[event.name][participant].points;
      }
    }
    endResult[participant].points = points;
  }

  const sortedEntries = Object.entries(endResult).sort(([, scoreA], [, scoreB]) => scoreB.points - scoreA.points);

  for (let i = 0; i < sortedEntries.length; i++) {
    if (i > 0 && sortedEntries[i][1].points === sortedEntries[i - 1][1].points) {
      endResult[sortedEntries[i][0]].place = endResult[sortedEntries[i - 1][0]].place;
    } else {
      endResult[sortedEntries[i][0]].place = i + 1;
    }
  }

  tournament.overall = endResult;
  return tournament;
};

export const getEventResult = (results: EventResult, maxPoints: number, direction = true): EventResult => {
  const cleanResults = normalizeEventResult(results);
  if (Object.keys(cleanResults).length === 0) {
    return {};
  }

  const sortedEntries = getSortedEntries(cleanResults, direction);
  let pointsToGive = maxPoints,
    currentPerformance = sortedEntries[0][1].performance,
    entriesToUpdate: [string, Score][] = [sortedEntries[0]];
  for (let i = 1; i < sortedEntries.length; i++) {
    maxPoints--;
    if (sortedEntries[i][1].performance === currentPerformance) {
      entriesToUpdate.push(sortedEntries[i]);
      pointsToGive += maxPoints;
    } else {
      updateEntries(entriesToUpdate, pointsToGive, cleanResults);
      pointsToGive = maxPoints;
      currentPerformance = sortedEntries[i][1].performance;
      entriesToUpdate = [sortedEntries[i]];
    }
  }
  updateEntries(entriesToUpdate, pointsToGive, cleanResults);
  setZeros(sortedEntries);
  return Object.fromEntries(sortedEntries);
};

const getSortedEntries = (results: EventResult, direction: boolean) => {
  const entries = Object.entries(results);
  return entries.sort(([, scoreA], [, scoreB]) => {
    if (scoreA.performance === 0 && scoreB.performance !== 0) {
      return 1;
    }
    if (scoreA.performance !== 0 && scoreB.performance === 0) {
      return -1;
    }

    return direction ? scoreB.performance - scoreA.performance : scoreA.performance - scoreB.performance;
  });
};

const getDirection = (event: StrongmanEvent): boolean => {
  switch (event.type) {
    case StrongmanEventTypes.WEIGHT:
    case StrongmanEventTypes.REPS:
    case StrongmanEventTypes.TIME_E:
      return true;
    case StrongmanEventTypes.TIME_S:
      return false;
    case StrongmanEventTypes.CUSTOM:
      return event.higherIsBetter ?? true;
    default:
      return true;
  }
};

export const updateEntries = (entries: [string, Score][], pointsToGive: number, results: EventResult): void => {
  for (const entry of entries) {
    results[entry[0]].points = pointsToGive / entries.length;
  }
};

export const setZeros = (entries: [string, Score][]): void => {
  for (const entry of entries) {
    if (entry[1].performance === 0) {
      entry[1].points = 0;
    }
  }
};

const normalizeEventResult = (results: EventResult): EventResult => {
  return Object.fromEntries(
    Object.entries(results).map(([participant, score]) => [
      participant,
      {
        performance: Number.isFinite(score.performance) ? score.performance : 0,
        points: Number.isFinite(score.points) ? score.points : 0,
      },
    ]),
  );
};

const cloneEvents = (events?: StrongmanEvent[]): StrongmanEvent[] => {
  return events?.map((event) => ({ ...event })) ?? [];
};

const cloneEventResults = (eventResults?: EventResults): EventResults => {
  return Object.fromEntries(
    Object.entries(eventResults ?? {}).map(([eventName, result]) => [
      eventName,
      Object.fromEntries(Object.entries(result).map(([participant, score]) => [participant, { ...score }])),
    ]),
  );
};

const cloneOverall = (overall?: Record<string, Placing>): Record<string, Placing> | undefined => {
  if (!overall) {
    return undefined;
  }

  return Object.fromEntries(Object.entries(overall).map(([participant, placing]) => [participant, { ...placing }]));
};
