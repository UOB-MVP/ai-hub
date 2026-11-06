import { Link, useNavigate } from 'react-router-dom';
import { Pencil, PenSquare, Send, Trash2 } from 'lucide-react';
import { Button, EmptyState } from '@/components/ui';
import { useContent } from '@/core/ContentContext';
import { usePersona } from '@/core/PersonaContext';
import { ContentCard } from '../components/ContentCard';

/** /learning/draft – the author's saved drafts, not yet sent to a moderator. */
export function DraftPage() {
  const { items, submitDraft, remove } = useContent();
  const { user } = usePersona();
  const nav = useNavigate();
  const drafts = items.filter((i) => i.authorId === user.id && i.status === 'draft').sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (!drafts.length) {
    return (
      <EmptyState title="No drafts yet" message="Start something and save it as a draft. Only you can see it until you submit it for approval." />
    );
  }
  return (
    <div className="stack" style={{ gap: 16 }}>
      <p className="muted" style={{ fontSize: 14 }}>Drafts are private to you. Submit one when it is ready and a Learning Moderator will review it.</p>
      <div className="grid grid-2">
        {drafts.map((i) => (
          <ContentCard
            key={i.id}
            item={i}
            showStatus
            actions={
              <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                <Button size="sm" onClick={() => { submitDraft(i.id); nav('/learning/submission'); }}><Send size={14} />Submit for approval</Button>
                <Link to={`/learning/contribute/${i.id}`} className="btn btn-ghost btn-sm"><Pencil size={14} />Edit</Link>
                <Button size="sm" variant="ghost" onClick={() => remove(i.id)}><Trash2 size={14} />Delete</Button>
              </div>
            }
          />
        ))}
      </div>
      <div><Link to="/learning/contribute" className="btn btn-ghost btn-sm"><PenSquare size={14} />New contribution</Link></div>
    </div>
  );
}
