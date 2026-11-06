import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Heart, Sparkles } from 'lucide-react';
import { SectionHeader } from '@/components/ui';
import { useContent } from '@/core/ContentContext';
import { getUser } from '@/data/users';
import { TYPE_META } from '@/features/learn/components/ContentCard';
import './home.css';

export function HomeFeaturedLearning() {
  const { items } = useContent();
  const feat = items.filter((i) => i.status === 'published');
  const ordered = [...feat.filter((i) => i.featured), ...feat.filter((i) => !i.featured)].slice(0, 4);
  if (!ordered.length) return null;
  const [lead, ...rest] = ordered;
  const L = TYPE_META[lead.type];
  return (
    <section>
      <SectionHeader title="Featured learning" subtitle="Curated by our Learning Moderators this week"
        action={<Link to="/learn" className="theme-cta">All learning <ArrowRight size={14} /></Link>} />
      <div className="fl-grid">
        <Link to="/learn" className="fl-lead" style={{ ['--h' as string]: L.hue }}>
          <span className="fa-eyebrow"><Sparkles size={14} />Featured · {L.label}</span>
          <h3>{lead.title}</h3>
          <p>{lead.summary}</p>
          <div className="fa-stats">
            <span>By {getUser(lead.authorId).name}</span>
            <span><Clock size={14} />{lead.readMins} min</span>
            <span><Heart size={14} />{lead.likes}</span>
          </div>
          <L.icon className="fl-watermark" size={150} />
        </Link>
        {rest.map((i) => {
          const m = TYPE_META[i.type];
          return (
            <Link key={i.id} to="/learn" className="card card-hover fl-mini">
              <span className="fl-ico" style={{ background: `hsl(${m.hue} 85% 93%)`, color: `hsl(${m.hue} 70% 30%)` }}><m.icon size={18} /></span>
              <span className="fl-type" style={{ color: `hsl(${m.hue} 70% 30%)` }}>{m.label}</span>
              <h4>{i.title}</h4>
              <span className="muted small"><Heart size={12} /> {i.likes} · {i.readMins} min read</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
