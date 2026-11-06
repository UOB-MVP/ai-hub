import { Lock, Star, Unlock } from 'lucide-react';
import { AppIcon } from '@/components/ui/AppIcon';
import { Badge } from '@/components/ui';
import type { AiApp } from '@/core/types';
import { useAppAccess } from '@/core/useAppAccess';
import './apps.css';

export const statusTone = (s: AiApp['status']) => (s === 'Live' ? 'green' : s === 'Beta' ? 'amber' : 'grey');

interface Props {
  app: AiApp;
  onOpen: (app: AiApp) => void;
  /** Primary action – differs between Discover ("View details") and Use ("Launch"). */
  action?: { label: string; onClick: (app: AiApp) => void; variant?: 'primary' | 'accent' | 'ghost' };
  hasAccess?: boolean;
}

export function AppCard({ app, onOpen, action, hasAccess = true }: Props) {
  const { favourites, toggleFavourite } = useAppAccess();
  const isFav = favourites.includes(app.id);
  const pill = ({ 'View details': 'View', Launch: 'Open', 'Request access': 'Request' } as Record<string, string>)[action?.label ?? ''] ?? action?.label;
  const open = hasAccess && !!action && action.label !== 'View details';
  return (
    <article className="card app-card as-card">
      <button className="as-main" onClick={() => onOpen(app)} aria-label={`Open ${app.name} details`}>
        <AppIcon name={app.icon} hue={app.hue} size={76} />
        <div className="as-text">
          <h3>{app.name}</h3>
          <p className="as-sub">{app.tagline}</p>
          <span className="as-cat">{app.category}</span>
        </div>
      </button>
      {action && (
        <button
          className={`as-get ${open ? 'as-open' : ''}`}
          onClick={() => action.onClick(app)}
          aria-label={`${action.label} ${app.name}`}
        >
          {pill}
        </button>
      )}
      <button
        className="icon-btn app-card-fav as-fav"
        aria-label={isFav ? `Remove ${app.name} from favourites` : `Add ${app.name} to favourites`}
        aria-pressed={isFav}
        onClick={(e) => { e.stopPropagation(); toggleFavourite(app.id); }}
      >
        <Star size={15} fill={isFav ? 'currentColor' : 'none'} />
      </button>
      <div className="as-strip">
        <div className="as-cell">
          <strong>{app.ratingCount > 0 ? <>{app.rating.toFixed(1)} <Star size={12} fill="currentColor" /></> : '—'}</strong>
          <span>{app.ratingCount} ratings</span>
        </div>
        <div className="as-cell">
          <strong>{app.userCount >= 1000 ? `${(app.userCount / 1000).toFixed(1)}K` : app.userCount}</strong>
          <span>users</span>
        </div>
        <div className="as-cell">
          <strong>{app.access === 'All staff' ? <Unlock size={15} /> : <Lock size={15} />}</strong>
          <span>{app.access === 'All staff' ? 'All staff' : 'On request'}</span>
        </div>
        <div className="as-cell">
          <Badge tone={statusTone(app.status)}>{app.status}</Badge>
          <span>{app.version}</span>
        </div>
      </div>
    </article>
  );
}
