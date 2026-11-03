import { Link } from 'react-router-dom';
import { ArrowRight, Compass, GraduationCap, Rocket } from 'lucide-react';
import './home.css';

const THEMES = [
  { to: '/discover', icon: Compass, title: 'Discover', body: 'Browse every AI app and learning resource across UOB.', cta: 'Explore catalogue', tone: 'blue' },
  { to: '/use', icon: Rocket, title: 'Use', body: 'Launch the apps you have access to, or request access in one step.', cta: 'Open my apps', tone: 'navy' },
  { to: '/learn', icon: GraduationCap, title: 'Learn', body: 'Tips, prompts, AI news and real use cases — and share your own.', cta: 'Start learning', tone: 'red' },
];

export function ThemeCards() {
  return (
    <section className="theme-grid" aria-label="Hub areas">
      {THEMES.map((t) => (
        <Link key={t.to} to={t.to} className={`theme-card ${t.tone}`}>
          <span className="theme-icon"><t.icon size={24} /></span>
          <h3>{t.title}</h3>
          <p>{t.body}</p>
          <span className="theme-cta">{t.cta} <ArrowRight size={16} /></span>
        </Link>
      ))}
    </section>
  );
}
