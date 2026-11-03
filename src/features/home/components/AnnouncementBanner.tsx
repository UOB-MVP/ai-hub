import { useState } from 'react';
import { Megaphone, X } from 'lucide-react';
import { usePersona } from '@/core/PersonaContext';
import { useNotifications } from '@/core/NotificationsContext';
import './home.css';

const dismissedKey = (id: string) => `uob-ai-hub:dismissed-ann:${id}`;

export function AnnouncementBanner() {
  const { persona } = usePersona();
  const { announcementsFor } = useNotifications();
  const latest = announcementsFor(persona.id)[0];
  const [dismissed, setDismissed] = useState(() => (latest ? sessionStorage.getItem(dismissedKey(latest.id)) === '1' : false));

  if (!latest || dismissed) return null;

  return (
    <div className="announcement-banner">
      <Megaphone size={18} />
      <div className="grow"><strong>{latest.title}</strong><p>{latest.body}</p></div>
      <button type="button" className="icon-btn" aria-label="Dismiss announcement" onClick={() => { sessionStorage.setItem(dismissedKey(latest.id), '1'); setDismissed(true); }}>
        <X size={16} />
      </button>
    </div>
  );
}
