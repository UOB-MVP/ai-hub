import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AppIcon } from '@/components/ui/AppIcon';
import { Badge, EmptyState } from '@/components/ui';
import { statusTone } from '@/components/apps/AppCard';
import { usePlatform } from '@/core/PlatformContext';
import './apps-run.css';

/** AI Hub-hosted apps open here, in the same tab, so users can navigate straight back to the hub. */
export function AppRunPage() {
  const { id } = useParams<{ id: string }>();
  const { getApp, hasAccess } = usePlatform();
  const app = id ? getApp(id) : undefined;

  if (!app) return <EmptyState title="App not found" message="This app is no longer available on AI Hub." />;
  if (!hasAccess(app)) return <Navigate to="/use" replace />;

  return (
    <div className="app-run">
      <Link to="/home" className="app-run-back"><ArrowLeft size={16} />Back to AI Hub</Link>
      <div className="card app-run-surface">
        <div className="row" style={{ gap: 14 }}>
          <AppIcon name={app.icon} hue={app.hue} size={48} />
          <div className="grow">
            <h2>{app.name}</h2>
            <span className="muted">{app.tagline}</span>
          </div>
          <Badge tone={statusTone(app.status)}>{app.status}</Badge>
        </div>
        <p className="app-run-note">This is a simulated workspace for {app.name}. In production this area hosts the live application experience within AI Hub.</p>
        <ul className="cap-list">{app.capabilities.map((c) => <li key={c}><CheckCircle2 size={16} />{c}</li>)}</ul>
      </div>
    </div>
  );
}
