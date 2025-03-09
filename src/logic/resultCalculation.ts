import { EventResult, Score, StrongManResults, Tournament } from '../types'

export const calculatePoints = (tournament: Tournament ): Tournament => {
    const { events, results, participants } = tournament;
    const maxPoints = participants.length;
    for (const event of events!) {
        const eventResult = getEventResult(results![event.name], maxPoints);
        results![event.name] = eventResult;
    }    
    return tournament;
}

export const getEventResult = (results: EventResult, maxPoints: number): EventResult => {
    const sortedEntries = Object.entries(results).sort(([, scoreA], [, scoreB]) => scoreA.performance - scoreB.performance);
    let pointsToGive = maxPoints, currentPerformance = sortedEntries[0][1].performance, entriesToUpdate: [string, Score][] = [sortedEntries[0]];
    for (let i = 1; i < sortedEntries.length; i++) {
        maxPoints--;
        if (sortedEntries[i][1].performance === currentPerformance) {
            entriesToUpdate.push(sortedEntries[i]);
            pointsToGive += maxPoints;
        } else {
            for (const entry of entriesToUpdate) {
                results[entry[0]].points = pointsToGive/entriesToUpdate.length;
            }
            pointsToGive = maxPoints;
            currentPerformance = sortedEntries[i][1].performance;
            entriesToUpdate = []
        }
    }
    return Object.fromEntries(sortedEntries);
}