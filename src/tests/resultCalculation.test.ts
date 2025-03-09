// src/utils/__tests__/tournament.test.ts

import { Score, StrongManResults, StrongmanEvent, StrongmanEventTypes, Tournament, TournamentTypes } from '../types';
import { calculatePoints, getEventResult } from '../logic/resultCalculation';
import { describe, expect, it } from 'vitest';

describe('Tournament Functions', () => {
  describe('calculatePoints', () => {
    it('should calculate points correctly for the tournament', () => {
      const tournament: Tournament = {
        name: 'Strongman Championship',
        participants: ['Alice', 'Bob'],
        type: TournamentTypes.STRONGMAN,
        results: {
          'Deadlift': {
            "Alice": { performance: 200, points: 0 },
            "Bob": { performance: 250, points: 0 }
          },
          'Log Press': {
            "Alice": { performance: 100, points: 0 },
            "Bob": { performance: 150, points: 0 }
          }
        },
        events: [
          { name: 'Deadlift', type: StrongmanEventTypes.WEIGHT },
          { name: 'Log Press', type: StrongmanEventTypes.WEIGHT },
        ]
      };
      const expectResults: StrongManResults = {
        'Deadlift': {
          "Alice": { performance: 200, points: 1 },
          "Bob": { performance: 250, points: 2 }
        },
        'Log Press': {
          "Alice": { performance: 100, points: 1 },
          "Bob": { performance: 150, points: 2 }
        }
      };

      const updatedTournament = calculatePoints(tournament);
      expect(updatedTournament.results).toEqual(expectResults);
    });
  });

  describe('getEventResult', () => {
    it('should sort results and assign points based on performance', () => {
      const results = {
        'Deadlift': {
          "Alice": { performance: 200, points: 0 },
          "Bob": { performance: 250, points: 0 },
          "Charlie": { performance: 250, points: 0 },
        }
      };

      const expectedResults = getEventResult(results['Deadlift'], 3); // Assume a maximum of 3 points
      expect(expectedResults['Bob'].points).toEqual(expectedResults['Charlie'].points);
      expect(expectedResults['Bob'].points).toEqual(2.5)
      expect(expectedResults['Alice'].points).toEqual(1)
    });
  });
});