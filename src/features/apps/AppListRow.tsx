import { ArrowUpRight, Building2, Lock, Star, Unlock, Users } from 'lucide-react';
import { AppIcon } from '@/components/ui/AppIcon';
import { Badge } from '@/components/ui';
import { statusTone } from '@/components/apps/AppCard';
import type { AiApp } from '@/core/types';

interface Props {
  app: AiApp;
  hasAccess: boolean;
  requested: boolean;
  onOpen: (a: AiApp) => void;
  onLaunch: (a: AiApp) => void;
  onRequest: (a: AiApp) => void;
}

/** Detailed list-view row: everything a user needs to compare apps at a glance. */
export function AppListRow({ app, hasAccess, requested, onOpen, onLaunch, onRequest }: Props) {
  return (
    <article className="card card-hover app-row">
      <button className="app-row-main" onClick={() => onOpen(app)} aria-label={`Open ${app.name} details`}>
        <AppIcon name={app.icon} hue={app.hue} size={60} />
        <div className="app-row-text">
          <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
            <h3>{app.name}</h3>
            <Badge tone={statusTone(app.status)}>{app.status}</Badge>
            {app.featured && <Badge tone="blue">Featured</Badge>}
            <span className="app-row-ver">{app.version}</span>
          </div>
          <p className="app-row-desc">{app.description}</p>
          <div className="chips" style={{ gap: 6 }}>
            <span className="badge badge-grey">{app.category}</span>
            {app.tags.map((t) => <span key={t} className="badge badge-grey">{t}</span>)}
          </div>
        </div>
      </button>
      <dl className="app-row-facts">
        <div><dt>Rating</dt><dd><Star size={13} fill="currentColor" className="star" />{app.ratingCount ? app.rating.toFixed(1) : '—'} <small>({app.ratingCount})</small></dd></div>
        <div><dt>Users</dt><dd><Users size={13} />{app.userCount.toLocaleString()}</dd></div>
        <div><dt>Team</dt><dd><Building2 size={13} />{app.department}</dd></div>
        <div><dt>Access</dt><dd>{app.access === 'All staff' ? <><Unlock size={13} />All staff</> : <><Lock size={13} />On request</>}</dd></div>
      </dl>
      <div className="app-row-action">
        {hasAccess
          ? <button className="btn btn-primary btn-sm" onClick={() => onLaunch(app)}>Open <ArrowUpRight size={14} /></button>
          : <button className="btn btn-ghost btn-sm" disabled={requested} onClick={() => onRequest(app)}>{requested ? 'Requested' : 'Request access'}</button>}
        <button className="app-row-link" onClick={() => onOpen(app)}>Details</button>
      </div>
    </article>
  );
}
