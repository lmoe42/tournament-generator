import { calculatePoints, getEventResult } from 'logic/resultCalculation';
import { EventResults, StrongmanEventTypes, Tournament, TournamentTypes } from 'types';
import { describe, expect, it } from 'vitest';

describe('Tournament Functions', () => {
  describe('calculatePoints', () => {
    it('should calculate points correctly for the tournament', () => {
      const tournament: Tournament = {
        name: 'Strongman Championship',
        participants: ['Thor', 'Mitchell'],
        type: TournamentTypes.STRONGMAN,
        eventResults: {
          Deadlift: {
            Thor: { performance: 200, points: 0 },
            Mitchell: { performance: 250, points: 0 },
          },
          'Log Press': {
            Thor: { performance: 100, points: 0 },
            Mitchell: { performance: 150, points: 0 },
          },
        },
        events: [
          { name: 'Deadlift', type: StrongmanEventTypes.WEIGHT },
          { name: 'Log Press', type: StrongmanEventTypes.WEIGHT },
        ],
      };
      const expectResults: EventResults = {
        Deadlift: {
          Thor: { performance: 200, points: 1 },
          Mitchell: { performance: 250, points: 2 },
        },
        'Log Press': {
          Thor: { performance: 100, points: 1 },
          Mitchell: { performance: 150, points: 2 },
        },
      };

      const updatedTournament = calculatePoints(tournament);
      expect(updatedTournament.eventResults).toEqual(expectResults);
    });
  });

  describe('getEventResult', () => {
    it('should sort results and assign points based on shared performance', () => {
      const results = {
        Deadlift: {
          Thor: { performance: 450, points: 0 },
          Mitchell: { performance: 450, points: 0 },
          Tom: { performance: 400, points: 0 },
        },
      };

      const expectedResults = getEventResult(results['Deadlift'], 3);
      expect(expectedResults['Mitchell'].points).toEqual(expectedResults['Thor'].points);
      expect(expectedResults['Mitchell'].points).toEqual(2.5);
      expect(expectedResults['Tom'].points).toEqual(1);
    });

    it('should sort results and assign points based on performance zeros', () => {
      const results = {
        Deadlift: {
          Thor: { performance: 470, points: 0 },
          Mitchell: { performance: 450, points: 0 },
          Tom: { performance: 400, points: 0 },
          Maxime: { performance: 0, points: 0 },
        },
      };

      const expectedResults = getEventResult(results['Deadlift'], 4);
      expect(expectedResults['Thor'].points).toEqual(4);
      expect(expectedResults['Mitchell'].points).toEqual(3);
      expect(expectedResults['Tom'].points).toEqual(2);
      expect(expectedResults['Maxime'].points).toEqual(0);
    });

    it('should sort results and assign points based on speed', () => {
      const results = {
        'Farmers Walk': {
          Thor: { performance: 18.3, points: 0 },
          Mitchell: { performance: 11.1, points: 0 },
          Tom: { performance: 19.7, points: 0 },
          Matteusz: { performance: 11.1, points: 0 },
        },
      };

      const expectedResults = getEventResult(results['Farmers Walk'], 4, false);
      expect(expectedResults['Matteusz'].points).toEqual(3.5);
      expect(expectedResults['Mitchell'].points).toEqual(expectedResults['Matteusz'].points);
      expect(expectedResults['Thor'].points).toEqual(2);
      expect(expectedResults['Tom'].points).toEqual(1);
    });

    it('should return an empty result when an event has no entered performances', () => {
      expect(getEventResult({}, 3)).toEqual({});
    });

    it('should treat invalid performances as zero points', () => {
      const expectedResults = getEventResult(
        {
          Thor: { performance: 470, points: 0 },
          Mitchell: { performance: Number.NaN, points: 0 },
        },
        2,
      );

      expect(expectedResults['Thor'].points).toEqual(2);
      expect(expectedResults['Mitchell'].performance).toEqual(0);
      expect(expectedResults['Mitchell'].points).toEqual(0);
    });

    it('should rank zero-point performances last for lower-is-better events', () => {
      const expectedResults = getEventResult(
        {
          Thor: { performance: 12, points: 0 },
          Mitchell: { performance: 0, points: 0 },
        },
        2,
        false,
      );

      expect(expectedResults['Thor'].points).toEqual(2);
      expect(expectedResults['Mitchell'].points).toEqual(0);
    });

    it('should not mutate the tournament passed to calculatePoints', () => {
      const tournament: Tournament = {
        name: 'Strongman Championship',
        participants: ['Thor', 'Mitchell'],
        type: TournamentTypes.STRONGMAN,
        eventResults: {
          Deadlift: {
            Thor: { performance: 200, points: 0 },
            Mitchell: { performance: 250, points: 0 },
          },
        },
        events: [{ name: 'Deadlift', type: StrongmanEventTypes.WEIGHT }],
      };

      const updatedTournament = calculatePoints(tournament);

      expect(updatedTournament).not.toBe(tournament);
      expect(updatedTournament.eventResults).not.toBe(tournament.eventResults);
      expect(tournament.eventResults?.Deadlift.Thor.points).toEqual(0);
    });

    it('should support lower-is-better custom events', () => {
      const tournament: Tournament = {
        name: 'Strongman Championship',
        participants: ['Thor', 'Mitchell'],
        type: TournamentTypes.STRONGMAN,
        eventResults: {
          Medley: {
            Thor: { performance: 20, points: 0 },
            Mitchell: { performance: 15, points: 0 },
          },
        },
        events: [{ name: 'Medley', type: StrongmanEventTypes.CUSTOM, higherIsBetter: false }],
      };

      const updatedTournament = calculatePoints(tournament);

      expect(updatedTournament.eventResults?.Medley.Mitchell.points).toEqual(2);
      expect(updatedTournament.eventResults?.Medley.Thor.points).toEqual(1);
    });
  });
});
