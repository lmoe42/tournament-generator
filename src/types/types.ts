export enum TournamentTypes {
    STRONGMAN = 'Strongman',
}

export type Tournament = { 
    name: string;
    participants: string[];
    type: TournamentTypes;
    events?: StrongmanEvent[];
    results?: StrongManResults;
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

export type EventResult = Record<string, Score> // <participant, result>

export type StrongManResults = Record<string, EventResult> // <eventname, EventResult>
