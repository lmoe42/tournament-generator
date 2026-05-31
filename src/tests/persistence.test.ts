import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createTournament,
  deleteTournament,
  getExistingTournaments,
  getTournament,
  saveTournament,
} from 'logic/persistence';
import { Tournament, TournamentTypes } from 'types';

const storage = new Map<string, string>();

const makeTournament = (name: string): Tournament => ({
  name,
  participants: [],
  events: [],
  type: TournamentTypes.STRONGMAN,
});

beforeEach(() => {
  storage.clear();
  vi.spyOn(console, 'error').mockImplementation(() => undefined);

  vi.stubGlobal('localStorage', {
    getItem: vi.fn((key: string) => storage.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      storage.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      storage.delete(key);
    }),
    clear: vi.fn(() => {
      storage.clear();
    }),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('persistence', () => {
  it('returns an empty list when stored tournaments cannot be parsed', () => {
    storage.set('existingTournaments', 'not json');

    expect(getExistingTournaments()).toEqual([]);
  });

  it('returns the tournament with the requested name', () => {
    const worlds = makeTournament('Worlds 2026');
    storage.set('existingTournaments', JSON.stringify([makeTournament('Arnold'), worlds]));

    expect(getTournament('Worlds 2026')).toEqual(worlds);
  });

  it('appends a tournament when saving a new name', () => {
    storage.set('existingTournaments', JSON.stringify([makeTournament('Arnold')]));

    saveTournament(makeTournament('Worlds 2026'));

    expect(getExistingTournaments().map((tournament) => tournament.name)).toEqual(['Arnold', 'Worlds 2026']);
  });

  it('replaces an existing tournament with the same name', () => {
    storage.set('existingTournaments', JSON.stringify([makeTournament('Arnold')]));

    saveTournament({ ...makeTournament('Arnold'), participants: ['Olga'] });

    expect(getTournament('Arnold')?.participants).toEqual(['Olga']);
  });

  it('does not create a duplicate tournament name', () => {
    storage.set('existingTournaments', JSON.stringify([makeTournament('Arnold')]));

    const result = createTournament(makeTournament('Arnold'));

    expect(result).toEqual({ success: false, error: 'Tournament name already exists.' });
    expect(getExistingTournaments()).toHaveLength(1);
  });

  it('deletes tournaments by name', () => {
    storage.set('existingTournaments', JSON.stringify([makeTournament('Arnold'), makeTournament('Worlds 2026')]));

    deleteTournament('Arnold');

    expect(getExistingTournaments().map((tournament) => tournament.name)).toEqual(['Worlds 2026']);
  });
});
