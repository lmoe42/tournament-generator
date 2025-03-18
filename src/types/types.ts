export enum TournamentTypes {
    STRONGMAN = 'Strongman',
}

export type Tournament = { 
    name: string;
    participants: string[];
    type: TournamentTypes;
    events?: StrongmanEvent[];
    eventResults?: EventResults;
    overall?: EndResult;
}

export enum StrongmanEventTypes {
    WEIGHT = 'weight',
    REPS = 'reps',
    TIME = 'time',
    CUSTOM = 'custom',
}

export type StrongmanEvent = {
    name: string;
    type: StrongmanEventTypes;
}

export type Score = {
    performance: number,
    points: number,
}

export type Placing = {
    points: number,
    place: number,
}

export type EndResult = Record<string, Placing> // <participant, finalScore>

export type EventResult = Record<string, Score> // <participant, result>

export type EventResults = Record<string, EventResult> // <eventname, EventResult>
