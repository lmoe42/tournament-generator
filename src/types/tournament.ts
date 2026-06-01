export enum TournamentTypes {
  STRONGMAN = 'Strongman',
}

export type BaseTournament = {
  name: string;
  participants: string[];
  type: TournamentTypes;
};

export type TournamentSummary = {
  name: string;
  type: TournamentTypes;
  participantsCount: number;
  primaryCount: {
    label: string;
    value: number;
  };
  completedFields: number;
  totalFields: number;
  progress: number;
};
