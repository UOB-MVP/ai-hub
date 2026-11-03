import { useMemo, useState } from 'react';
import { AppWindow, BookOpen } from 'lucide-react';
import { PageHero, SearchInput, Tabs, EmptyState } from '@/components/ui';
import { AppCatalogue } from '@/components/apps/AppCatalogue';
import { ContentCard } from '@/features/learn/components/ContentCard';
import { useContent } from '@/core/ContentContext';
import { useAppFilters } from './hooks';
import { AppFilters } from './components/AppFilters';

type Scope = 'apps' | 'learning';

export function DiscoverPage() {
  const f = useAppFilters();
  const { items } = useContent();
  const [scope, setScope] = useState<Scope>('apps');

  const learning = useMemo(() => {
    const q = f.query.trim().toLowerCase();
    return items.filter((i) => i.status === 'published').filter((i) => !q || `${i.title} ${i.summary} ${i.tags.join(' ')} ${i.category}`.toLowerCase().includes(q)).sort((a, b) => b.likes - a.likes);
  }, [items, f.query]);

  return (
    <>
      <PageHero eyebrow="Discover" title="Find the right AI for your work" description="Browse every AI application and learning resource across the bank, in one place. Everything here has been reviewed for safe and responsible use at UOB." />
      <div className="stack" style={{ gap: 20 }}>
        <SearchInput value={f.query} onChange={f.setQuery} placeholder="Search apps, capabilities, teams or learning content…" />
        <Tabs
          tabs={[
            { id: 'apps' as Scope, label: 'AI apps', icon: <AppWindow size={16} />, count: f.apps.length },
            { id: 'learning' as Scope, label: 'Learning content', icon: <BookOpen size={16} />, count: learning.length },
          ]}
          value={scope}
          onChange={setScope}
        />
        {scope === 'apps' ? (
          <>
            <AppFilters category={f.category} onCategory={f.setCategory} status={f.status} onStatus={f.setStatus} sort={f.sort} onSort={f.setSort} total={f.apps.length} />
            <AppCatalogue apps={f.apps} mode="discover" />
          </>
        ) : learning.length ? (
          <div className="grid grid-2">{learning.map((i) => <ContentCard key={i.id} item={i} />)}</div>
        ) : (
          <EmptyState title="No learning content found" message="Try a different search." />
        )}
      </div>
    </>
  );
}
