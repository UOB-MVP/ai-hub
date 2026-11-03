import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { usePersona } from '@/core/PersonaContext';
import './home.css';

export function HomeHero() {
  const { user } = usePersona();
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return (
    <section className="home-hero">
      <div className="hero-copy">
        <span className="eyebrow"><Sparkles size={14} /> UOB AI Hub</span>
        <h1>{greet}, {user.name.split(' ')[0]}.<br />One place for AI at UOB.</h1>
        <p>Discover trusted AI apps, put them to work, and learn from colleagues across the bank — safely, responsibly and in one place.</p>
        <div className="row" style={{ gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
          <Link to="/discover" className="btn btn-light">Explore AI apps <ArrowRight size={16} /></Link>
          <Link to="/learn" className="btn btn-hero-ghost">Start learning</Link>
        </div>
      </div>
      <div className="hero-art" aria-hidden>
        <span className="orb o1" /><span className="orb o2" /><span className="orb o3" />
      </div>
    </section>
  );
}
