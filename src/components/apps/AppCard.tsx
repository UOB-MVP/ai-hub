import { ArrowUpRight, Star, Users } from 'lucide-react';
import { AppIcon } from '@/components/ui/AppIcon';
import { Badge, Button } from '@/components/ui';
import type { AiApp } from '@/core/types';
import './apps.css';

export const statusTone = (s: AiApp['status']) => (s === 'Live' ? 'green' : s === 'Beta' ? 'amber' : 'grey');
export const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace('.0', '')}k` : `${n}`);

interface Props {
  app: AiApp;
  onOpen: (app: AiApp) => void;
  /** Primary action – differs between Discover ("View details") and Use ("Launch"). */
  action?: { label: string; onClick: (app: AiApp) => void; variant?: 'primary' | 'accent' | 'ghost' };
  hasAccess?: boolean;
}

export function AppCard({ app, onOpen, action, hasAccess = true }: Props) {
  return (
    <article className="card card-hover app-card">
      <button className="app-card-main" onClick={() => onOpen(app)} aria-label={`Open ${app.name} details`}>
        <div className="row app-card-top">
          <AppIcon name={app.icon} hue={app.hue} />
          <div className="grow">
            <h3>{app.name}</h3>
            <span className="app-owner">{app.department}</span>
          </div>
          <Badge tone={statusTone(app.status)}>{app.status}</Badge>
        </div>
        <p className="app-tagline">{app.tagline}</p>
        <div className="chips tags">{app.tags.map((t) => <span key={t} className="badge badge-grey">{t}</span>)}</div>
      </button>
      <div className="app-card-foot">
        <span className="stat"><Users size={14} />{compact(app.monthlyUsers)}</span>
        <span className="stat"><Star size={14} fill="currentColor" />{app.rating.toFixed(1)}</span>
        <span className="grow" />
        {action ? (
          <Button size="sm" variant={hasAccess ? action.variant ?? 'primary' : 'ghost'} onClick={() => action.onClick(app)}>
            {action.label}{hasAccess && <ArrowUpRight size={14} />}
          </Button>
        ) : null}
      </div>
    </article>
  );
}
