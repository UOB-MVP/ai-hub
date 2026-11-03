import { CheckCircle2, Clock, ExternalLink, Lock, Unlock } from 'lucide-react';
import { Avatar, Badge, Button, Modal } from '@/components/ui';
import { AppIcon } from '@/components/ui/AppIcon';
import type { AiApp } from '@/core/types';
import { getUser } from '@/data/users';
import { statusTone } from './AppCard';

interface Props { app: AiApp; hasAccess: boolean; requested: boolean; onClose: () => void; onLaunch: (a: AiApp) => void; onRequest: (a: AiApp) => void }

export function AppDetailModal({ app, hasAccess, requested, onClose, onLaunch, onRequest }: Props) {
  const owner = getUser(app.ownerId);
  return (
    <Modal
      title={app.name}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          {hasAccess ? (
            <Button onClick={() => onLaunch(app)}><ExternalLink size={16} />Launch {app.name}</Button>
          ) : requested ? (
            <Button variant="ghost" disabled><Clock size={16} />Request pending</Button>
          ) : (
            <Button variant="accent" onClick={() => onRequest(app)}><Lock size={16} />Request access</Button>
          )}
        </>
      }
    >
      <div className="stack" style={{ gap: 20 }}>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <AppIcon name={app.icon} hue={app.hue} size={56} />
          <div>
            <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
              <Badge tone={statusTone(app.status)}>{app.status}</Badge><Badge>{app.category}</Badge>
              <Badge tone={hasAccess ? 'green' : 'amber'}>{hasAccess ? <><Unlock size={12} />You have access</> : <><Lock size={12} />{app.access}</>}</Badge>
            </div>
            <p style={{ marginTop: 8, fontWeight: 600 }}>{app.tagline}</p>
          </div>
        </div>
        <p className="muted">{app.description}</p>
        <div>
          <h4 style={{ marginBottom: 8 }}>What it can do</h4>
          <ul className="cap-list">{app.capabilities.map((c) => <li key={c}><CheckCircle2 size={16} />{c}</li>)}</ul>
        </div>
        <div className="detail-meta">
          <div><span>Owner</span><div className="row" style={{ gap: 8 }}><Avatar name={owner.name} color={owner.avatarColor} size={26} /><strong>{owner.name}</strong></div></div>
          <div><span>Department</span><strong>{app.department}</strong></div>
        </div>
      </div>
    </Modal>
  );
}
