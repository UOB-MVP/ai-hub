import { useState } from 'react';
import { ArrowDown, ArrowUp, Star } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { AppIcon } from '@/components/ui/AppIcon';
import { usePlatform } from '@/core/PlatformContext';

export function FeaturedTab() {
  const { apps, updateApp, toggleFeatured } = usePlatform();
  const [pick, setPick] = useState('');

  const featured = apps.filter((a) => a.featured).sort((a, b) => (a.featuredPriority ?? 99) - (b.featuredPriority ?? 99));
  const featurable = apps.filter((a) => a.lifecycle === 'published' && !a.featured);

  const swap = (id: string, dir: -1 | 1) => {
    const idx = featured.findIndex((a) => a.id === id);
    const other = featured[idx + dir];
    if (!other) return;
    const a = featured[idx];
    updateApp(a.id, { featuredPriority: other.featuredPriority });
    updateApp(other.id, { featuredPriority: a.featuredPriority });
  };

  return (
    <div className="stack" style={{ gap: 16 }}>
      <div className="row" style={{ gap: 10 }}>
        <select value={pick} onChange={(e) => setPick(e.target.value)} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px', flex: 1 }}>
          <option value="">Feature a published app…</option>
          {featurable.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <Button size="sm" disabled={!pick} onClick={() => { toggleFeatured(pick); setPick(''); }}><Star size={14} />Feature</Button>
      </div>
      <div className="stack" style={{ gap: 8 }}>
        {featured.map((a, i) => (
          <div key={a.id} className="card row" style={{ padding: 12, gap: 12 }}>
            <span className="muted" style={{ width: 20, textAlign: 'center' }}>{i + 1}</span>
            <AppIcon name={a.icon} hue={a.hue} size={32} />
            <div className="grow"><strong>{a.name}</strong> <Badge tone="grey">{a.category}</Badge></div>
            <Button size="sm" variant="ghost" disabled={i === 0} onClick={() => swap(a.id, -1)} aria-label={`Move ${a.name} up`}><ArrowUp size={14} /></Button>
            <Button size="sm" variant="ghost" disabled={i === featured.length - 1} onClick={() => swap(a.id, 1)} aria-label={`Move ${a.name} down`}><ArrowDown size={14} /></Button>
            <Button size="sm" variant="ghost" onClick={() => toggleFeatured(a.id)}>Remove</Button>
          </div>
        ))}
        {!featured.length && <p className="muted" style={{ fontSize: 14 }}>No apps are currently featured.</p>}
      </div>
    </div>
  );
}
