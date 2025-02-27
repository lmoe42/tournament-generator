export enum TournamentTypes {
    STRONGMAN = 'Strongman',
}

export type Tournament = { 
    name: string;
    participants: string[];
    type: TournamentTypes;
    events?: StrongmanEvent[];
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
    results?: string[];
    places: number[];
}
