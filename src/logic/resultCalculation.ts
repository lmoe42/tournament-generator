import { EventResult, Placing, Score, Tournament } from '../types';

export const calculatePoints = (tournament: Tournament): Tournament => {
  const { events, eventResults, participants } = tournament;
  const maxPoints = participants.length;
  for (const event of events!) {
    if(eventResults![event.name]) {
      const eventResult = getEventResult(eventResults![event.name], maxPoints);
      eventResults![event.name] = eventResult;
    }
  }
  tournament = calculateOverall(tournament);
  return tournament;
};

const calculateOverall = (tournament: Tournament): Tournament => {
  const endResult = tournament.overall || Object.fromEntries(tournament.participants.map(key => [key, {} as Placing]));

  for (const participant of tournament.participants) {
    let points = 0;
    for (const event of tournament.events!) {
      if(tournament.eventResults![event.name] && tournament.eventResults![event.name][participant]) {
        points += tournament.eventResults![event.name][participant].points;
      }
    }
    endResult[participant].points = points;
  }

  const sortedEntries = Object.entries(endResult).sort(
    ([, scoreA], [, scoreB]) => scoreB.points - scoreA.points,
  );

  for (let i = 0; i < sortedEntries.length; i++) {
    endResult[sortedEntries[i][0]].place = i + 1;
  }

  tournament.overall = endResult;
  return tournament;
}

export const getEventResult = (results: EventResult, maxPoints: number): EventResult => {
  const sortedEntries = Object.entries(results).sort(
    ([, scoreA], [, scoreB]) => scoreB.performance - scoreA.performance,
  );
  let pointsToGive = maxPoints,
    currentPerformance = sortedEntries[0][1].performance,
    entriesToUpdate: [string, Score][] = [sortedEntries[0]];
  for (let i = 1; i < sortedEntries.length; i++) {
    maxPoints--;
    if (sortedEntries[i][1].performance === currentPerformance) {
      entriesToUpdate.push(sortedEntries[i]);
      pointsToGive += maxPoints;
    } else {
      updateEntries(entriesToUpdate, pointsToGive, results);
      pointsToGive = maxPoints;
      currentPerformance = sortedEntries[i][1].performance;
      entriesToUpdate = [sortedEntries[i]];
    }
  }
  updateEntries(entriesToUpdate, pointsToGive, results);
  setZeros(sortedEntries);
  return Object.fromEntries(sortedEntries);
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
