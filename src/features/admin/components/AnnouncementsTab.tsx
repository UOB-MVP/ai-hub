import { useState } from 'react';
import { Megaphone } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { useNotifications } from '@/core/NotificationsContext';
import type { AnnouncementAudience } from '@/core/types';

const audienceLabel: Record<AnnouncementAudience, string> = { all: 'Everyone', consumer: 'Consumers', 'app-owner': 'App Owners & Admins' };

export function AnnouncementsTab() {
  const { announcements, publishAnnouncement } = useNotifications();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<AnnouncementAudience>('all');
  const valid = title.trim().length >= 4 && body.trim().length >= 10;

  return (
    <div className="stack" style={{ gap: 20 }}>
      <div className="card" style={{ padding: 16 }}>
        <div className="field"><label htmlFor="ann-title">Title</label><input id="ann-title" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div className="field"><label htmlFor="ann-body">Message</label><textarea id="ann-body" rows={3} value={body} onChange={(e) => setBody(e.target.value)} /></div>
        <div className="field"><label htmlFor="ann-aud">Audience</label>
          <select id="ann-aud" value={audience} onChange={(e) => setAudience(e.target.value as AnnouncementAudience)}>
            <option value="all">Everyone</option>
            <option value="consumer">Consumers</option>
            <option value="app-owner">App Owners & Admins</option>
          </select>
        </div>
        <Button size="sm" disabled={!valid} onClick={() => { publishAnnouncement({ title: title.trim(), body: body.trim(), audience }); setTitle(''); setBody(''); }}><Megaphone size={14} />Publish announcement</Button>
      </div>
      <div className="stack" style={{ gap: 10 }}>
        {announcements.map((a) => (
          <div key={a.id} className="card" style={{ padding: 14 }}>
            <div className="row" style={{ gap: 8, justifyContent: 'space-between' }}>
              <strong>{a.title}</strong>
              <div className="row" style={{ gap: 8 }}><Badge tone="grey">{audienceLabel[a.audience]}</Badge><span className="muted" style={{ fontSize: 12 }}>{a.createdAt}</span></div>
            </div>
            <p className="muted" style={{ fontSize: 14, marginTop: 6 }}>{a.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
