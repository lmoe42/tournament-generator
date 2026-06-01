import { BaseTournament, TournamentTypes } from './tournament';

export enum StrongmanEventTypes {
  WEIGHT = 'weight',
  REPS = 'reps',
  TIME_S = 'time for speed',
  TIME_E = 'time for endurance',
  CUSTOM = 'custom',
}

export type StrongmanEvent = {
  name: string;
  type: StrongmanEventTypes;
  higherIsBetter?: boolean;
};

export type Score = {
  performance: number;
  points: number;
};

export type Placing = {
  points: number;
  place: number;
};

export type EndResult = Record<string, Placing>;

export type EventResult = Record<string, Score>;

export type EventResults = Record<string, EventResult>;

export type StrongmanTournament = BaseTournament & {
  type: TournamentTypes.STRONGMAN;
  events?: StrongmanEvent[];
  eventResults?: EventResults;
  overall?: EndResult;
};
