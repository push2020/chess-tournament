'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { TournamentCard } from '@/components/TournamentCard';
import type { Tournament, TournamentStatus, TimeControl } from '@/types/tournament';
import styles from './page.module.scss';

const STATUS_OPTIONS: { value: '' | TournamentStatus; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'live', label: 'Live' },
];

const TIME_CONTROL_OPTIONS: { value: '' | TimeControl; label: string }[] = [
  { value: '', label: 'All time controls' },
  { value: 'Blitz', label: 'Blitz' },
  { value: 'Rapid', label: 'Rapid' },
  { value: 'Classical', label: 'Classical' },
];

export default function Home() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<'' | TournamentStatus>('');
  const [timeControlFilter, setTimeControlFilter] = useState<'' | TimeControl>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [joinMessage, setJoinMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/tournaments')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load tournaments');
        return res.json();
      })
      .then((data: Tournament[]) => setTournaments(data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Something went wrong'))
      .finally(() => setLoading(false));
  }, []);

  const handleJoin = useCallback((id: string) => {
    setJoinedIds((prev) => new Set(prev).add(id));
    const name = tournaments.find((t) => t.id === id)?.name ?? 'Tournament';
    setJoinMessage(`You joined "${name}"!`);
    setTimeout(() => setJoinMessage(null), 3000);
  }, [tournaments]);

  const filteredTournaments = useMemo(() => {
    return tournaments.filter((t) => {
      if (statusFilter && t.status !== statusFilter) return false;
      if (timeControlFilter && t.timeControl !== timeControlFilter) return false;
      if (
        searchQuery.trim() &&
        !t.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
        return false;
      return true;
    });
  }, [tournaments, statusFilter, timeControlFilter, searchQuery]);

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>Loading tournaments…</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <div className={styles.error}>
          <p>{error}</p>
          <button type="button" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Chess Tournaments</h1>
        <p className={styles.subtitle}>
          Browse tournaments, filter by status or time control, and join with one click.
        </p>
      </header>

      <section className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="search" className={styles.label}>
            Search by name
          </label>
          <input
            id="search"
            type="search"
            placeholder="e.g. Blitz, Rapid..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            aria-label="Search tournaments by name"
          />
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="status" className={styles.label}>
            Status
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter((e.target.value || '') as '' | TournamentStatus)
            }
            className={styles.select}
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="timeControl" className={styles.label}>
            Time control
          </label>
          <select
            id="timeControl"
            value={timeControlFilter}
            onChange={(e) =>
              setTimeControlFilter((e.target.value || '') as '' | TimeControl)
            }
            className={styles.select}
            aria-label="Filter by time control"
          >
            {TIME_CONTROL_OPTIONS.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {joinMessage && (
        <div className={styles.toast} role="status" aria-live="polite">
          {joinMessage}
        </div>
      )}

      <section className={styles.results}>
        <p className={styles.resultCount}>
          {filteredTournaments.length} tournament
          {filteredTournaments.length !== 1 ? 's' : ''}
        </p>
        {filteredTournaments.length === 0 ? (
          <p className={styles.empty}>No tournaments match your filters.</p>
        ) : (
          <ul className={styles.list}>
            {filteredTournaments.map((tournament) => (
              <li key={tournament.id}>
                <TournamentCard
                  tournament={tournament}
                  isJoined={joinedIds.has(tournament.id)}
                  isFull={tournament.playersJoined >= tournament.maxPlayers}
                  onJoin={handleJoin}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
