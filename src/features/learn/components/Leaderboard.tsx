import { Crown, Medal, Trophy } from 'lucide-react';
import { Avatar, Chip, Tabs } from '@/components/ui';
import type { LearnCategory, LeaderboardMetric } from '@/core/types';
import { getUser } from '@/data/users';
import { LEARN_CATEGORIES } from '@/data/learning';
import type { LeaderRow } from '../hooks/useLeaderboard';
import './learn.css';

interface Props {
  rows: LeaderRow[];
  metric: LeaderboardMetric;
  onMetric: (m: LeaderboardMetric) => void;
  category: LearnCategory | null;
  onCategory: (c: LearnCategory) => void;
  selectedAuthor: string | null;
  onAuthor: (id: string) => void;
}

const rankIcon = (r: number) => (r === 1 ? <Crown size={16} /> : r <= 3 ? <Medal size={16} /> : <span>{r}</span>);

export function Leaderboard({ rows, metric, onMetric, category, onCategory, selectedAuthor, onAuthor }: Props) {
  const max = rows[0]?.[metric] || 1;
  return (
    <aside className="card leaderboard" aria-label="Leaderboard">
      <div className="lb-head">
        <h3><Trophy size={18} /> Leaderboard</h3>
        <p className="muted small">Select a person or category to filter the feed.</p>
      </div>
      <Tabs
        tabs={[{ id: 'posts' as const, label: 'By posts' }, { id: 'likes' as const, label: 'By likes' }]}
        value={metric}
        onChange={onMetric}
      />
      <div className="chips lb-cats" role="group" aria-label="Filter leaderboard by category">
        {LEARN_CATEGORIES.map((c) => <Chip key={c} active={category === c} onClick={() => onCategory(c)}>{c}</Chip>)}
      </div>
      <ol className="lb-list">
        {rows.length === 0 && <li className="muted small" style={{ padding: 16 }}>No published posts in this category yet.</li>}
        {rows.slice(0, 8).map((r) => {
          const u = getUser(r.authorId);
          return (
            <li key={r.authorId}>
              <button className={`lb-row ${selectedAuthor === r.authorId ? 'sel' : ''} rank-${r.rank}`} onClick={() => onAuthor(r.authorId)} aria-pressed={selectedAuthor === r.authorId}>
                <span className="lb-rank">{rankIcon(r.rank)}</span>
                <Avatar name={u.name} color={u.avatarColor} size={34} />
                <span className="lb-who">
                  <strong>{u.name}</strong>
                  <span className="bar"><i style={{ width: `${(r[metric] / max) * 100}%` }} /></span>
                </span>
                <span className="lb-score"><strong>{r[metric]}</strong><small>{metric === 'posts' ? 'posts' : 'likes'}</small></span>
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
