import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SectionHeader } from '@/components/ui';
import { AppIcon } from '@/components/ui/AppIcon';
import { AppDetailModal } from '@/components/apps/AppDetailModal';
import { APPS } from '@/data/apps';
import { useAppAccess } from '@/core/useAppAccess';
import type { AiApp } from '@/core/types';
import './home.css';

export function FeaturedApps() {
  const { hasAccess, isRequested, requestAccess, launch } = useAppAccess();
  const [sel, setSel] = useState<AiApp | null>(null);
  const [lead, ...rest] = APPS.filter((a) => a.featured);
  if (!lead) return null;
  return (
    <section>
      <SectionHeader title="Featured apps" subtitle="Hand-picked by the AI Hub team" />
      <div className="featured-apps">
        <button className="fa-lead" onClick={() => setSel(lead)}>
          <span className="fa-eyebrow"><Sparkles size={14} />Featured · {lead.category}</span>
          <div className="row" style={{ gap: 14 }}>
            <AppIcon name={lead.icon} hue={lead.hue} size={52} />
            <h3>{lead.name}</h3>
          </div>
          <p>{lead.description}</p>
          <div className="fa-meta"><span>{lead.department}</span><span className="fa-cta">View details <ArrowRight size={15} /></span></div>
        </button>
        <div className="fa-side">
          {rest.slice(0, 2).map((a) => (
            <button key={a.id} className="card card-hover fa-mini" onClick={() => setSel(a)}>
              <div className="row" style={{ gap: 12 }}><AppIcon name={a.icon} hue={a.hue} size={40} /><div><h4>{a.name}</h4><span className="muted small">{a.category}</span></div></div>
              <p className="muted">{a.tagline}</p>
            </button>
          ))}
        </div>
      </div>
      {sel && <AppDetailModal app={sel} hasAccess={hasAccess(sel)} requested={isRequested(sel)} onClose={() => setSel(null)} onLaunch={launch} onRequest={requestAccess} />}
    </section>
  );
}
