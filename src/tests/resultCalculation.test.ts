// src/utils/__tests__/tournament.test.ts

import { EventResults, StrongmanEventTypes, Tournament, TournamentTypes } from '../types';
import { calculatePoints, getEventResult } from '../logic/resultCalculation';
import { describe, expect, it } from 'vitest';

describe('Tournament Functions', () => {
  describe('calculatePoints', () => {
    it('should calculate points correctly for the tournament', () => {
      const tournament: Tournament = {
        name: 'Strongman Championship',
        participants: ['Thor', 'Mitchell'],
        type: TournamentTypes.STRONGMAN,
        eventResults: {
          'Deadlift': {
            "Thor": { performance: 200, points: 0 },
            "Mitchell": { performance: 250, points: 0 }
          },
          'Log Press': {
            "Thor": { performance: 100, points: 0 },
            "Mitchell": { performance: 150, points: 0 }
          }
        },
        events: [
          { name: 'Deadlift', type: StrongmanEventTypes.WEIGHT },
          { name: 'Log Press', type: StrongmanEventTypes.WEIGHT },
        ]
      };
      const expectResults: EventResults = {
        'Deadlift': {
          "Thor": { performance: 200, points: 1 },
          "Mitchell": { performance: 250, points: 2 }
        },
        'Log Press': {
          "Thor": { performance: 100, points: 1 },
          "Mitchell": { performance: 150, points: 2 }
        }
      };

      const updatedTournament = calculatePoints(tournament);
      expect(updatedTournament.eventResults).toEqual(expectResults);
    });
    });
  });

  describe('getEventResult', () => {
    it('should sort results and assign points based on shared performance', () => {
      const results = {
        'Deadlift': {
          "Thor": { performance: 450, points: 0 },
          "Mitchell": { performance: 450, points: 0 },
          "Tom": { performance: 400, points: 0 },
        }
      };

      const expectedResults = getEventResult(results['Deadlift'], 3);
      expect(expectedResults['Mitchell'].points).toEqual(expectedResults['Thor'].points);
      expect(expectedResults['Mitchell'].points).toEqual(2.5)
      expect(expectedResults['Tom'].points).toEqual(1)
    });
    
    it('should sort results and assign points based on performance zeros', () => {
      const results = {
        'Deadlift': {
          "Thor": { performance: 470, points: 0 },
          "Mitchell": { performance: 450, points: 0 },
          "Tom": { performance: 400, points: 0 },
          "Maxime": { performance: 0, points: 0 },
        }
      };

      const expectedResults = getEventResult(results['Deadlift'], 4);
      expect(expectedResults['Thor'].points).toEqual(4)
      expect(expectedResults['Mitchell'].points).toEqual(3)
      expect(expectedResults['Tom'].points).toEqual(2)
      expect(expectedResults['Maxime'].points).toEqual(0)
    });

    it('should sort results and assign points based on speed', () => {
      const results = {
        'Farmers Walk': {
          "Thor": { performance: 18.3, points: 0 },
          "Mitchell": { performance: 11.1, points: 0 },
          "Tom": { performance: 19.7, points: 0 },
          "Matteusz": { performance: 11.1, points: 0 },
        }
      };

      const expectedResults = getEventResult(results['Farmers Walk'], 4, false);
      expect(expectedResults['Matteusz'].points).toEqual(3.5)
      expect(expectedResults['Mitchell'].points).toEqual(expectedResults['Matteusz'].points)
      expect(expectedResults['Thor'].points).toEqual(2)
      expect(expectedResults['Tom'].points).toEqual(1)
  });
});