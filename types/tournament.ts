export type TournamentStatus = 'upcoming' | 'live';

export type TimeControl = 'Blitz' | 'Rapid' | 'Classical';

export interface Tournament {
  id: string;
  name: string;
  timeControl: TimeControl;
  startTime: string;
  playersJoined: number;
  maxPlayers: number;
  status: TournamentStatus;
}
