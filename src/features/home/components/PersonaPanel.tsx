import { Link } from 'react-router-dom';
import { ClipboardCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { usePersona } from '@/core/PersonaContext';
import { useContent } from '@/core/ContentContext';
import type { PersonaId } from '@/core/types';
import './home.css';

/** Role-specific shortcuts. Add a persona by adding a key here – no page changes needed. */
export function PersonaPanel() {
  const { persona, user } = usePersona();
  const { items } = useContent();
  const pending = items.filter((i) => i.status === 'submitted' && i.authorId !== user.id).length;

  const panels: Record<PersonaId, { icon: typeof Sparkles; title: string; body: string; cta: string; to: string; stat?: string } | null> = {
    'bank-user': { icon: Sparkles, title: 'Get more from AI', body: 'New here? Start with “Your first 30 minutes with UOB Assist”.', cta: 'Start learning', to: '/learning/all' },
    'learning-moderator': { icon: ClipboardCheck, title: 'Review queue', body: 'Contributions are waiting for your review.', cta: 'Review now', to: '/moderation', stat: `${pending} pending` },
    'platform-admin': { icon: ShieldCheck, title: 'Platform governance', body: 'Approvals, app onboarding and roles at a glance.', cta: 'Open admin view', to: '/admin', stat: `${pending} content pending` },
  };
  const p = panels[persona.id];
  if (!p) return null;
  return (
    <div className="card persona-panel">
      <span className="persona-ico"><p.icon size={22} /></span>
      <div className="grow">
        <div className="row" style={{ gap: 8 }}><h3>{p.title}</h3>{p.stat && <span className="badge badge-red">{p.stat}</span>}</div>
        <p className="muted">{p.body}</p>
      </div>
      <Link to={p.to} className="btn btn-primary btn-sm">{p.cta}</Link>
    </div>
  );
}
