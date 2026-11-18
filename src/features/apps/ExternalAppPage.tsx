import { useEffect, useRef } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { AppIcon } from '@/components/ui/AppIcon';
import { Badge, EmptyState } from '@/components/ui';
import { statusTone } from '@/components/apps/AppCard';
import { usePlatform } from '@/core/PlatformContext';
import { useAuditLog } from '@/core/AuditLogContext';
import { CURRENT_USER } from '@/data/users';
import './apps-run.css';

/** Externally hosted apps open in a new tab, outside the AI Hub shell; still tracked centrally (BRD 1.3/1.4). */
export function ExternalAppPage() {
  const { id } = useParams<{ id: string }>();
  const { getApp, hasAccess } = usePlatform();
  const { log } = useAuditLog();
  const app = id ? getApp(id) : undefined;
  const logged = useRef(false);

  useEffect(() => {
    if (app && !logged.current) {
      logged.current = true;
      log({ userId: CURRENT_USER.id, action: 'app_launch', activityType: 'launch', detail: `Opened externally hosted ${app.name}`, appId: app.id });
    }
  }, [app, log]);

  if (!app) return <EmptyState title="App not found" message="This app is no longer available on AI Hub." />;
  if (!hasAccess(app)) return <Navigate to="/login" replace />;

  return (
    <div className="container app-run app-run-standalone">
      <div className="app-run-ext-bar"><ExternalLink size={14} />Externally hosted application</div>
      <div className="card app-run-surface">
        <div className="row" style={{ gap: 14 }}>
          <AppIcon name={app.icon} hue={app.hue} size={48} />
          <div className="grow">
            <h2>{app.name}</h2>
            <span className="muted">{app.tagline}</span>
          </div>
          <Badge tone={statusTone(app.status)}>{app.status}</Badge>
        </div>
        <p className="app-run-note">This is a simulated external site for {app.name}, opened in a new tab. Signing out here does not end your AI Hub session.</p>
        <ul className="cap-list">{app.capabilities.map((c) => <li key={c}><CheckCircle2 size={16} />{c}</li>)}</ul>
        <Link to="/home" className="app-run-back" style={{ marginTop: 16 }}>Return to AI Hub</Link>
      </div>
    </div>
  );
}
