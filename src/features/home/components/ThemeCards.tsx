import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenCheck, Blocks, Telescope, Zap, type LucideIcon } from 'lucide-react';
import './home.css';

interface Theme { to?: string; icon: LucideIcon; title: string; body: string; cta?: string; tone: string }

const THEMES: Theme[] = [
  { to: '/discover', icon: Telescope, title: 'Discover', body: 'Browse every AI app and learning resource across UOB.', cta: 'Explore', tone: 'blue' },
  { to: '/use', icon: Zap, title: 'Use', body: 'Launch the apps you can access, or request access.', cta: 'Open apps', tone: 'navy' },
  { to: '/learn', icon: BookOpenCheck, title: 'Learn', body: 'Tips, prompts, AI news and use cases — share your own.', cta: 'Start learning', tone: 'red' },
  { icon: Blocks, title: 'Build', body: 'Create and publish your own AI apps on the hub.', tone: 'locked' },
];

export function ThemeCards() {
  return (
    <section className="theme-grid" aria-label="Hub areas">
      {THEMES.map((t) => {
        const inner = (
          <>
            <div className="theme-title"><span className="theme-icon"><t.icon size={20} /></span><h3>{t.title}</h3>{!t.to && <span className="badge badge-grey">Phase 2</span>}</div>
            <p>{t.body}</p>
            {t.to && <span className="theme-cta">{t.cta} <ArrowRight size={15} /></span>}
          </>
        );
        return t.to ? (
          <Link key={t.title} to={t.to} className={`theme-card ${t.tone}`}>{inner}</Link>
        ) : (
          <div key={t.title} className="theme-card locked" tabIndex={0} aria-disabled="true" data-tip="Part of Phase 2 — coming soon" title="Part of Phase 2 — coming soon">{inner}</div>
        );
      })}
    </section>
  );
}
