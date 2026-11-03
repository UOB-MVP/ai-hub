import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ClipboardCheck, FolderOpen, GraduationCap, Layers, PenSquare, X } from 'lucide-react';
import { Button, EmptyState, PageHero, SearchInput, Tabs } from '@/components/ui';
import { usePersona } from '@/core/PersonaContext';
import { useContent } from '@/core/ContentContext';
import type { LeaderboardMetric } from '@/core/types';
import { CONTENT_TYPES } from '@/data/learning';
import { getUser } from '@/data/users';
import { useLearnFilters, type LearnView } from './hooks/useLearnFilters';
import { useLeaderboard } from './hooks/useLeaderboard';
import { FeaturedLearning } from './components/FeaturedLearning';
import { ContentCard, TYPE_META } from './components/ContentCard';
import { Leaderboard } from './components/Leaderboard';
import { MyContributions } from './components/MyContributions';
import { ReviewQueue } from './components/ReviewQueue';
import { ContributeModal } from './components/ContributeModal';

export function LearnPage() {
  const { persona, user } = usePersona();
  const { items } = useContent();
  const [params] = useSearchParams();
  const f = useLearnFilters();
  const [metric, setMetric] = useState<LeaderboardMetric>('posts');
  const [contributing, setContributing] = useState(false);

  const published = useMemo(() => items.filter((i) => i.status === 'published'), [items]);
  const mine = useMemo(() => items.filter((i) => i.authorId === user.id), [items, user.id]);
  const queue = useMemo(() => items.filter((i) => i.status === 'draft' && i.authorId !== user.id), [items, user.id]);
  const featured = useMemo(() => published.filter((i) => i.featured), [published]);
  const leaderboard = useLeaderboard(items, metric, f.category);

  const feed = useMemo(() => {
    const q = f.query.trim().toLowerCase();
    return published
      .filter((i) => f.view === 'all' || i.type === f.view)
      .filter((i) => !f.category || i.category === f.category)
      .filter((i) => !f.authorId || i.authorId === f.authorId)
      .filter((i) => !q || `${i.title} ${i.summary} ${i.tags.join(' ')}`.toLowerCase().includes(q))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [published, f.view, f.category, f.authorId, f.query]);

  const tabs = [
    { id: 'all' as LearnView, label: 'All', icon: <Layers size={16} />, count: published.length },
    ...CONTENT_TYPES.map((t) => {
      const Icon = TYPE_META[t.id].icon;
      return { id: t.id as LearnView, label: t.label, icon: <Icon size={16} />, count: published.filter((i) => i.type === t.id).length };
    }),
    { id: 'mine' as LearnView, label: 'My contributions', icon: <FolderOpen size={16} />, count: mine.length },
    ...(persona.can.moderateLearning ? [{ id: 'review' as LearnView, label: 'Review queue', icon: <ClipboardCheck size={16} />, count: queue.length }] : []),
  ];

  const wantsReview = params.get('view') === 'review' && persona.can.moderateLearning;
  useEffect(() => { if (wantsReview) f.setView('review'); else if (f.view === 'review' && !params.get('view')) f.setView('all'); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantsReview]);

  const typeParam = params.get('type') as LearnView | null;
  useEffect(() => { if (typeParam) f.setView(typeParam); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeParam]);

  const isFeed = f.view !== 'mine' && f.view !== 'review';
  const hasFilters = f.category || f.authorId || f.query;

  return (
    <>
      <PageHero eyebrow="Learn" title="Build your AI fluency, together" description="Practical tips, tested prompts, industry news and real use cases from colleagues across UOB. Share what works and climb the leaderboard.">
        <div className="row" style={{ marginTop: 20, gap: 12, flexWrap: 'wrap' }}>
          <Button variant="light" onClick={() => setContributing(true)}><PenSquare size={16} />Contribute</Button>
          <span className="row" style={{ gap: 8, fontSize: 14, opacity: .85 }}><GraduationCap size={18} />{published.length} published resources</span>
        </div>
      </PageHero>

      <FeaturedLearning items={featured} />

      <div className="learn-layout">
        <section className="stack" style={{ gap: 20, minWidth: 0 }}>
          <Tabs tabs={tabs} value={f.view} onChange={f.setView} />

          {isFeed && (
            <>
              <SearchInput value={f.query} onChange={f.setQuery} placeholder="Search tips, prompts, news and use cases…" />
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
            </>
          )}
          {f.view === 'mine' && <MyContributions items={mine} onContribute={() => setContributing(true)} />}
          {f.view === 'review' && persona.can.moderateLearning && <ReviewQueue items={queue} />}
        </section>

        <Leaderboard
          rows={leaderboard}
          metric={metric}
          onMetric={setMetric}
          category={f.category}
          onCategory={f.toggleCategory}
          selectedAuthor={f.authorId}
          onAuthor={(id) => { f.toggleAuthor(id); if (!isFeed) f.setView('all'); }}
        />
      </div>

      {contributing && <ContributeModal onClose={() => setContributing(false)} onDone={() => { setContributing(false); f.setView('mine'); }} />}
    </>
  );
}
