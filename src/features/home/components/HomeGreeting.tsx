import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Hourglass, LayoutGrid } from 'lucide-react';
import { usePersona } from '@/core/PersonaContext';
import { GREETING_STATS as G } from '@/data/home';
import './home.css';

const CTA: Record<string, { label: string; to: string } | undefined> = {
  'learning-moderator': { label: 'Review queue', to: '/learn?view=review' },
  'platform-admin': { label: 'Admin view', to: '/admin' },
};

export function HomeGreeting() {
  const { user, persona } = usePersona();
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString('en-SG', { weekday: 'long', day: 'numeric', month: 'long' });
  const cta = CTA[persona.id];
  return (
    <section className="greet">
      <div className="greet-who">
        <div>
          <div className="greet-date">{today}</div>
          <h1>{greet}, {user.name.split(' ')[0]}</h1>
          <div className="greet-last"><Clock size={12} />Last login: {G.lastLoginDay}, {G.lastLoginTime}</div>
          <div className="row" style={{ gap: 10 }}>
            <span className="greet-role">{persona.label}</span>
            {cta && <Link to={cta.to} className="theme-cta" style={{ color: '#fff' }}>{cta.label} <ArrowRight size={14} /></Link>}
          </div>
        </div>
      </div>
      <div className="greet-stats">
        <div className="gs gs-warn" title="Not used for more than a month">
          <span className="gs-label"><Hourglass size={13} />Unused 30+ days</span>
          <div className="gs-pair">
            <div className="gs-box"><span className="gs-value">{G.staleApps}</span><span className="gs-key">Apps</span></div>
            <div className="gs-box"><span className="gs-value">{G.staleLearnings}</span><span className="gs-key">Learnings</span></div>
          </div>
        </div>
        <Link to="/discover" className="gs gs-new" style={{ color: 'inherit', textDecoration: 'none' }}>
          <span className="gs-label"><LayoutGrid size={13} />New apps</span>
          <span className="gs-value">{G.newApps}</span>
          <span className="gs-sub">in the last 30 days</span>
        </Link>
        <Link to="/learn" className="gs gs-new" style={{ color: 'inherit', textDecoration: 'none' }}>
          <span className="gs-label"><BookOpen size={13} />New learnings</span>
          <span className="gs-value">{G.newLearnings}</span>
          <span className="gs-sub">in the last 30 days</span>
        </Link>
      </div>
    </section>
  );
}
