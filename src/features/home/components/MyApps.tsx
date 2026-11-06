import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Lock, Star } from 'lucide-react';
import { SectionHeader } from '@/components/ui';
import { AppIcon } from '@/components/ui/AppIcon';
import { usePlatform } from '@/core/PlatformContext';
import { useAppAccess } from '@/core/useAppAccess';
import { MY_APP_STATS } from '@/data/home';
import './home.css';

function Spark({ data, hue }: { data: number[]; hue: number }) {
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${28 - (v / max) * 24}`).join(' ');
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="spark" aria-hidden>
      <polyline points={pts} fill="none" stroke={`hsl(${hue} 70% 42%)`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function MyApps() {
  const { publishedApps } = usePlatform();
  const { favourites, recent, hasAccess, launch } = useAppAccess();
  const ids = [...new Set([...favourites, ...recent, ...MY_APP_STATS.map((s) => s.appId)])];
  const apps = ids.map((id) => publishedApps.find((a) => a.id === id)).filter((a) => !!a).slice(0, 4);
  return (
    <section>
      <SectionHeader title="My apps" subtitle="Your favourites and recently used apps"
        action={<Link to="/apps" className="theme-cta">All my apps <ArrowRight size={14} /></Link>} />
      <div className="my-grid">
        {apps.map((a) => {
          const s = MY_APP_STATS.find((x) => x.appId === a.id);
          const ok = hasAccess(a);
          return (
            <article key={a.id} className="card card-hover my-card">
              <div className="row" style={{ gap: 12 }}>
                <AppIcon name={a.icon} hue={a.hue} size={42} />
                <div className="grow"><h4>{a.name}</h4><span className="muted small">{s ? `Last used ${s.lastUsed}` : a.category}</span></div>
                {favourites.includes(a.id) && <Star size={15} className="my-fav" fill="currentColor" />}
              </div>
              {s ? (
                <div className="my-stats">
                  <div><strong>{s.sessionsThisWeek}</strong><span>sessions this week</span></div>
                  <Spark data={s.trend} hue={a.hue} />
                </div>
              ) : <p className="muted small">{a.tagline}</p>}
              <button className={`btn btn-sm ${ok ? 'btn-primary' : 'btn-ghost'}`} onClick={() => (ok ? launch(a) : undefined)} disabled={!ok}>
                {ok ? <>Launch <ArrowUpRight size={14} /></> : <><Lock size={13} /> No access</>}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
