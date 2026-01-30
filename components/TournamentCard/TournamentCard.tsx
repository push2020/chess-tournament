'use client';

import type { Tournament } from '@/types/tournament';
import styles from './TournamentCard.module.scss';

interface TournamentCardProps {
  tournament: Tournament;
  isJoined: boolean;
  isFull: boolean;
  onJoin: (id: string) => void;
}

// Fixed locale + UTC so server and client render the same (avoids hydration mismatch)
function formatStartTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function TournamentCard({
  tournament,
  isJoined,
  isFull,
  onJoin,
}: TournamentCardProps) {
  const canJoin = !isJoined && !isFull;
  // When user has joined (mocked), show count increased by 1
  const displayCount = Math.min(
    tournament.playersJoined + (isJoined ? 1 : 0),
    tournament.maxPlayers
  );

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.name}>{tournament.name}</h3>
        <span
          className={`${styles.badge} ${styles[`status_${tournament.status}`]}`}
        >
          {tournament.status}
        </span>
      </div>
      <dl className={styles.meta}>
        <div className={styles.row}>
          <dt>Time control</dt>
          <dd>{tournament.timeControl}</dd>
        </div>
        <div className={styles.row}>
          <dt>Starts</dt>
          <dd>{formatStartTime(tournament.startTime)}</dd>
        </div>
        <div className={styles.row}>
          <dt>Players</dt>
          <dd>
            {displayCount} / {tournament.maxPlayers}
          </dd>
        </div>
      </dl>
      <div className={styles.progress}>
        <div
          className={styles.progressBar}
          style={{
            width: `${(displayCount / tournament.maxPlayers) * 100}%`,
          }}
        />
      </div>
      <button
        type="button"
        className={styles.joinBtn}
        disabled={!canJoin}
        onClick={() => canJoin && onJoin(tournament.id)}
        aria-pressed={isJoined}
      >
        {isJoined ? 'Joined' : isFull ? 'Full' : 'Join tournament'}
      </button>
    </article>
  );
}
