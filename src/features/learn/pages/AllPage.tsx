import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Chip, EmptyState, SearchInput } from '@/components/ui';
import { useContent } from '@/core/ContentContext';
import type { LeaderboardMetric } from '@/core/types';
import { CONTENT_TYPES } from '@/data/learning';
import { getUser } from '@/data/users';
import { useLearnFilters } from '../hooks/useLearnFilters';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { ContentCard } from '../components/ContentCard';
import { Leaderboard } from '../components/Leaderboard';

/** /learning/all – every published (approved) learning resource on AI Hub. */
export function AllPage() {
  const { items } = useContent();
  const f = useLearnFilters();
  const [metric, setMetric] = useState<LeaderboardMetric>('posts');
  const published = useMemo(() => items.filter((i) => i.status === 'published'), [items]);
  const leaderboard = useLeaderboard(items, metric, f.category);

  const feed = useMemo(() => {
    const q = f.query.trim().toLowerCase();
    return published
      .filter((i) => f.type === 'all' || i.type === f.type)
      .filter((i) => !f.category || i.category === f.category)
      .filter((i) => !f.authorId || i.authorId === f.authorId)
      .filter((i) => !q || `${i.title} ${i.summary} ${i.tags.join(' ')} ${i.category}`.toLowerCase().includes(q))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [published, f.type, f.category, f.authorId, f.query]);

  const hasFilters = f.category || f.authorId || f.query;

  return (
    <div className="learn-layout">
      <section className="stack" style={{ gap: 18, minWidth: 0 }}>
        <SearchInput value={f.query} onChange={f.setQuery} placeholder="Search tips, prompts, news and use cases…" />
        <div className="chips" role="group" aria-label="Content type">
          <Chip active={f.type === 'all'} onClick={() => f.setType('all')}>All types</Chip>
          {CONTENT_TYPES.map((t) => <Chip key={t.id} active={f.type === t.id} onClick={() => f.setType(f.type === t.id ? 'all' : t.id)}>{t.label}</Chip>)}
        </div>
        {hasFilters && (
          <div className="filter-bar">
            <span className="muted small">Filtered by:</span>
            {f.category && <button className="active-filter" onClick={() => f.setCategory(null)}>{f.category}<X size={14} /></button>}
            {f.authorId && <button className="active-filter" onClick={() => f.setAuthorId(null)}>{getUser(f.authorId).name}<X size={14} /></button>}
            <button className="btn btn-ghost btn-sm" onClick={f.clear}>Clear all</button>
          </div>
        )}
        {feed.length ? (
          <div className="grid grid-2">{feed.map((i) => <ContentCard key={i.id} item={i} />)}</div>
        ) : (
          <EmptyState title="No matching content" message="Try removing a filter or contribute something new." />
        )}
      </section>
      <Leaderboard rows={leaderboard} metric={metric} onMetric={setMetric} category={f.category} onCategory={f.toggleCategory} selectedAuthor={f.authorId} onAuthor={f.toggleAuthor} />
    </div>
  );
}
