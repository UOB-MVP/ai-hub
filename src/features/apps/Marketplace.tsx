import { useMemo, useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { EmptyState, SearchInput, SectionHeader } from '@/components/ui';
import { AppCatalogue } from '@/components/apps/AppCatalogue';
import { AppDetailModal } from '@/components/apps/AppDetailModal';
import { AppListRow } from './AppListRow';
import { usePlatform } from '@/core/PlatformContext';
import { useAppAccess } from '@/core/useAppAccess';
import type { AiApp } from '@/core/types';
import './apps-market.css';

type Sort = 'featured' | 'rating' | 'users' | 'newest' | 'name';
type View = 'grid' | 'list';
const VIEW_KEY = 'uob-ai-hub:apps-view';
const readView = (): View => { try { return localStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'grid'; } catch { return 'grid'; } };

export function Marketplace() {
  const { publishedApps } = usePlatform();
  const { hasAccess, isRequested, requestAccess, launch } = useAppAccess();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('featured');
  const [view, setViewState] = useState<View>(readView);
  const [selected, setSelected] = useState<AiApp | null>(null);
  const setView = (v: View) => { setViewState(v); try { localStorage.setItem(VIEW_KEY, v); } catch { /* ignore */ } };

  const apps = useMemo(() => {
    const q = query.trim().toLowerCase();
    return publishedApps
      .filter((a) => !q || `${a.name} ${a.tagline} ${a.description} ${a.tags.join(' ')} ${a.capabilities.join(' ')} ${a.department} ${a.category} ${a.status} ${a.access}`.toLowerCase().includes(q))
      .sort((a, b) => {
        switch (sort) {
          case 'rating': return b.rating - a.rating;
          case 'users': return b.userCount - a.userCount;
          case 'newest': return b.releaseDate.localeCompare(a.releaseDate);
          case 'name': return a.name.localeCompare(b.name);
          default: return (a.featuredPriority ?? 99) - (b.featuredPriority ?? 99) || Number(!!b.featured) - Number(!!a.featured);
        }
      });
  }, [publishedApps, query, sort]);

  return (
    <section aria-labelledby="market-h">
      <SectionHeader title="Marketplace" subtitle="Browse every approved AI app across the bank" />
      <div className="market">
        <div className="market-toolbar">
          <div className="market-search"><SearchInput value={query} onChange={setQuery} placeholder="Search apps by name, category, status, capability, team or tag…" /></div>
          <label className="row" style={{ gap: 8, fontSize: 14 }}>Sort
            <select className="market-select" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="featured">Featured first</option>
              <option value="rating">Top rated</option>
              <option value="users">Most used</option>
              <option value="newest">Recently updated</option>
              <option value="name">A–Z</option>
            </select>
          </label>
          <div className="view-toggle" role="group" aria-label="View">
            <button aria-pressed={view === 'grid'} onClick={() => setView('grid')} title="Grid view"><LayoutGrid size={16} />Grid</button>
            <button aria-pressed={view === 'list'} onClick={() => setView('list')} title="List view with details"><List size={16} />List</button>
          </div>
        </div>
        <span className="muted market-count">{apps.length} app{apps.length === 1 ? '' : 's'}</span>

        {!apps.length ? (
          <EmptyState title="No apps match your search" message="Try searching for something broader." />
        ) : view === 'grid' ? (
          <AppCatalogue apps={apps} mode="use" />
        ) : (
          <div className="stack" style={{ gap: 12 }}>
            {apps.map((a) => (
              <AppListRow key={a.id} app={a} hasAccess={hasAccess(a)} requested={isRequested(a)} onOpen={setSelected} onLaunch={launch} onRequest={requestAccess} />
            ))}
          </div>
        )}
      </div>
      {selected && (
        <AppDetailModal app={selected} hasAccess={hasAccess(selected)} requested={isRequested(selected)} onClose={() => setSelected(null)} onLaunch={launch} onRequest={requestAccess} />
      )}
    </section>
  );
}
