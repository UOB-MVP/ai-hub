import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppWindow, BookOpen } from 'lucide-react';
import { SearchInput } from '@/components/ui';
import { AppIcon } from '@/components/ui/AppIcon';
import { usePlatform } from '@/core/PlatformContext';
import { useContent } from '@/core/ContentContext';
import { useAppAccess } from '@/core/useAppAccess';
import type { AiApp, LearningContent } from '@/core/types';
import './home.css';

/** AI search bar on the landing page (BRD 2.1) – live keyword match across apps and published learning. */
export function HomeSearch() {
  const { publishedApps } = usePlatform();
  const { items } = useContent();
  const { hasAccess, requestAccess, launch } = useAppAccess();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const published = useMemo(() => items.filter((i) => i.status === 'published'), [items]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { apps: [] as AiApp[], learning: [] as LearningContent[] };
    const apps = publishedApps
      .filter((a) => `${a.name} ${a.tagline} ${a.tags.join(' ')} ${a.category}`.toLowerCase().includes(q))
      .slice(0, 4);
    const learning = published
      .filter((i) => `${i.title} ${i.summary} ${i.tags.join(' ')}`.toLowerCase().includes(q))
      .slice(0, 4);
    return { apps, learning };
  }, [query, publishedApps, published]);

  const hasResults = results.apps.length > 0 || results.learning.length > 0;

  const openApp = (a: AiApp) => {
    setOpen(false);
    setQuery('');
    if (hasAccess(a)) launch(a); else { requestAccess(a); navigate('/use'); }
  };

  const openLearning = () => { setOpen(false); setQuery(''); navigate('/learn'); };

  return (
    <div className="home-search" ref={boxRef}>
      <SearchInput
        value={query}
        onChange={(v) => { setQuery(v); setOpen(true); }}
        placeholder="Search apps, capabilities or learning content…"
      />
      {open && query.trim() && (
        <div className="home-search-panel" onMouseDown={(e) => e.preventDefault()}>
          {hasResults ? (
            <>
              {results.apps.length > 0 && (
                <div className="home-search-group">
                  <span className="home-search-group-label"><AppWindow size={13} />Apps</span>
                  {results.apps.map((a) => (
                    <button key={a.id} type="button" className="home-search-row" onClick={() => openApp(a)}>
                      <AppIcon name={a.icon} hue={a.hue} size={28} /><span>{a.name}</span>
                    </button>
                  ))}
                </div>
              )}
              {results.learning.length > 0 && (
                <div className="home-search-group">
                  <span className="home-search-group-label"><BookOpen size={13} />Learning</span>
                  {results.learning.map((i) => (
                    <button key={i.id} type="button" className="home-search-row" onClick={openLearning}>
                      <span className="grow">{i.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="muted" style={{ padding: 14, fontSize: 13 }}>No matches. Try a different search.</p>
          )}
        </div>
      )}
    </div>
  );
}
