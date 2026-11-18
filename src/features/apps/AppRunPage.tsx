import { useEffect, useRef } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AppIcon } from '@/components/ui/AppIcon';
import { Badge, EmptyState } from '@/components/ui';
import { statusTone } from '@/components/apps/AppCard';
import { usePlatform } from '@/core/PlatformContext';
import { useInstanceSupersession } from '@/core/useAppAccess';
import { useAuditLog } from '@/core/AuditLogContext';
import { CURRENT_USER } from '@/data/users';
import './apps-run.css';

/**
 * AI Hub-hosted apps open here, in the same tab, so users can navigate straight back to
 * the hub. Mounting always logs an activity event (BRD 1.4 – usage is tracked even when
 * an app is reached by a saved/bookmarked URL, not only via Use), and enforces a single
 * active instance per user across tabs/devices (BRD 1.5).
 */
export function AppRunPage() {
  const { id } = useParams<{ id: string }>();
  const { getApp, hasAccess } = usePlatform();
  const { log } = useAuditLog();
  const app = id ? getApp(id) : undefined;
  const superseded = useInstanceSupersession(app?.id);
  const logged = useRef(false);

  useEffect(() => {
    if (app && !logged.current) {
      logged.current = true;
      log({ userId: CURRENT_USER.id, action: 'app_launch', activityType: 'launch', detail: `Opened ${app.name} directly by URL`, appId: app.id });
    }
  }, [app, log]);

  if (!app) return <EmptyState title="App not found" message="This app is no longer available on AI Hub." />;
  if (!hasAccess(app)) return <Navigate to="/use" replace />;

  if (superseded) {
    return (
      <div className="app-run">
        <div className="card app-run-surface">
          <div className="row" style={{ gap: 10 }}><AlertTriangle size={20} /><h2>Session moved to another window</h2></div>
          <p className="app-run-note">AI Hub allows only one active session of {app.name} per user at a time. This window is no longer active because {app.name} was opened elsewhere.</p>
          <Link to="/home" className="app-run-back"><ArrowLeft size={16} />Back to AI Hub</Link>
        </div>
      </div>
    );
  }

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
