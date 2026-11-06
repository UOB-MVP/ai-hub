import { useState } from 'react';
import { ArrowRight, Sparkles, Star, Users, Zap } from 'lucide-react';
import { SectionHeader } from '@/components/ui';
import { AppIcon } from '@/components/ui/AppIcon';
import { AppDetailModal } from '@/components/apps/AppDetailModal';
import { usePlatform } from '@/core/PlatformContext';
import { useAppAccess } from '@/core/useAppAccess';
import type { AiApp } from '@/core/types';
import './home.css';

export function FeaturedApps() {
  const { publishedApps } = usePlatform();
  const { hasAccess, isRequested, requestAccess, launch } = useAppAccess();
  const [sel, setSel] = useState<AiApp | null>(null);
  const [lead, ...rest] = publishedApps.filter((a) => a.featured).sort((a, b) => (a.featuredPriority ?? 99) - (b.featuredPriority ?? 99));
  if (!lead) return null;
  return (
    <section>
      <SectionHeader title="Featured apps" subtitle="Hand-picked by the AI Hub team" />
      <div className="featured-apps">
        <button className="fa-lead" onClick={() => setSel(lead)} style={{ ['--h' as string]: lead.hue }}>
          <span className="fa-eyebrow"><Sparkles size={14} />Featured · {lead.category}</span>
          <div className="row" style={{ gap: 14 }}>
            <AppIcon name={lead.icon} hue={lead.hue} size={52} />
            <div><h3>{lead.name}</h3><span className="fa-tag">{lead.tagline}</span></div>
          </div>
          <p>{lead.description}</p>
          <div className="fa-stats">
            <span><Star size={14} fill="currentColor" />{lead.rating.toFixed(1)} <em>({lead.ratingCount})</em></span>
            <span><Users size={14} />{lead.userCount.toLocaleString()} users</span>
            <span><Zap size={14} />{lead.requests30d.toLocaleString()} requests / 30d</span>
          </div>
          <div className="fa-meta"><span>{lead.department}</span><span className="fa-cta">View details <ArrowRight size={15} /></span></div>
        </button>
        <div className="fa-side">
          {rest.slice(0, 2).map((a) => (
            <button key={a.id} className="card card-hover fa-mini" onClick={() => setSel(a)}>
              <div className="row" style={{ gap: 12 }}>
                <AppIcon name={a.icon} hue={a.hue} size={40} />
                <div className="grow"><h4>{a.name}</h4><span className="muted small">{a.category}</span></div>
                <span className="fa-rate"><Star size={13} fill="currentColor" />{a.rating.toFixed(1)}</span>
              </div>
              <p className="muted">{a.tagline}</p>
              <span className="muted small"><Users size={12} /> {a.userCount.toLocaleString()} users</span>
            </button>
          ))}
        </div>
      </div>
      {sel && <AppDetailModal app={sel} hasAccess={hasAccess(sel)} requested={isRequested(sel)} onClose={() => setSel(null)} onLaunch={launch} onRequest={requestAccess} />}
    </section>
  );
}
