import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { PageHero, SectionHeader, Tabs } from '@/components/ui';
import { AppCatalogue } from '@/components/apps/AppCatalogue';
import { AppIcon } from '@/components/ui/AppIcon';
import { APPS } from '@/data/apps';
import { useAppAccess } from '@/core/useAppAccess';

type Tab = 'all' | 'mine' | 'request';

export function UsePage() {
  const { hasAccess, favourites, toggleFavourite, recent, launch } = useAppAccess();
  const [tab, setTab] = useState<Tab>('all');
  const accessible = useMemo(() => APPS.filter(hasAccess), [hasAccess]);
  const restricted = useMemo(() => APPS.filter((a) => !hasAccess(a)), [hasAccess]);
  const quick = useMemo(() => [...favourites, ...recent.filter((r) => !favourites.includes(r))].map((id) => APPS.find((a) => a.id === id)).filter((a): a is typeof APPS[number] => !!a && hasAccess(a)).slice(0, 6), [favourites, recent, hasAccess]);
  const list = tab === 'all' ? APPS : tab === 'mine' ? accessible : restricted;

  return (
    <>
      <PageHero eyebrow="Use" title="Launch your AI apps" description="Every app you can use today, one click away. Pin favourites, and request access to restricted apps in a single step." />

      <section>
        <SectionHeader title="Quick launch" subtitle="Your pinned and recently used apps" />
        <div className="grid grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {quick.map((a) => (
            <div key={a.id} className="card card-hover row" style={{ padding: 14, gap: 12 }}>
              <button className="row grow" style={{ gap: 12, background: 'none', border: 'none', textAlign: 'left', padding: 0 }} onClick={() => launch(a)}>
                <AppIcon name={a.icon} hue={a.hue} size={40} /><strong>{a.name}</strong>
              </button>
              <button className="icon-btn" aria-label={favourites.includes(a.id) ? `Unpin ${a.name}` : `Pin ${a.name}`} onClick={() => toggleFavourite(a.id)} style={{ color: favourites.includes(a.id) ? '#d99a00' : undefined }}>
                <Star size={18} fill={favourites.includes(a.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="stack" style={{ gap: 20 }}>
        <Tabs
          tabs={[
            { id: 'all' as Tab, label: 'All apps', count: APPS.length },
            { id: 'mine' as Tab, label: 'Ready to use', count: accessible.length },
            { id: 'request' as Tab, label: 'Request access', count: restricted.length },
          ]}
          value={tab}
          onChange={setTab}
        />
        <AppCatalogue apps={list} mode="use" />
        <p className="muted" style={{ fontSize: 14 }}>Can’t find what you need? <Link to="/discover" style={{ color: 'var(--uob-blue-700)', fontWeight: 600 }}>Explore the full catalogue in Discover →</Link></p>
      </section>
    </>
  );
}
