import { ArrowRight, Clock, Heart, Sparkles } from 'lucide-react';
import { SectionHeader } from '@/components/ui';
import type { LearningContent } from '@/core/types';
import { getUser } from '@/data/users';
import { TYPE_META } from './ContentCard';
import './learn.css';

export function FeaturedLearning({ items }: { items: LearningContent[] }) {
  if (!items.length) return null;
  const [lead, ...rest] = items;
  const LeadIcon = TYPE_META[lead.type].icon;
  return (
    <section aria-labelledby="featured-h">
      <SectionHeader title="Featured learning" subtitle="Hand-picked by our Learning Moderators this week" />
      <div className="featured-grid" id="featured-h">
        <article className="featured-lead">
          <span className="eyebrow"><Sparkles size={14} />Featured · {TYPE_META[lead.type].label}</span>
          <h3>{lead.title}</h3>
          <p>{lead.summary}</p>
          <div className="row lead-meta">
            <span>By {getUser(lead.authorId).name}</span><span className="dot" />
            <span className="row" style={{ gap: 4 }}><Clock size={14} />{lead.readMins} min read</span><span className="dot" />
            <span className="row" style={{ gap: 4 }}><Heart size={14} />{lead.likes}</span>
          </div>
          <span className="lead-cta">Read now <ArrowRight size={16} /></span>
          <LeadIcon className="lead-watermark" size={160} />
        </article>
        <div className="featured-side">
          {rest.slice(0, 2).map((i) => {
            const Icon = TYPE_META[i.type].icon;
            return (
              <article key={i.id} className="card card-hover featured-mini">
                <span className="type-pill" style={{ background: `hsl(${TYPE_META[i.type].hue} 85% 93%)`, color: `hsl(${TYPE_META[i.type].hue} 70% 30%)` }}><Icon size={14} />{TYPE_META[i.type].label}</span>
                <h4>{i.title}</h4>
                <span className="muted small"><Heart size={12} /> {i.likes} · {i.readMins} min</span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
