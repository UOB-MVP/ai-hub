import { useState } from 'react';
import { Archive, Pencil, PenSquare } from 'lucide-react';
import { Chip, EmptyState } from '@/components/ui';
import type { ContentStatus, LearningContent } from '@/core/types';
import { useContent } from '@/core/ContentContext';
import { ContentCard, STATUS_LABEL } from './ContentCard';
import { ContributeModal } from './ContributeModal';

const STATUSES: ContentStatus[] = ['draft', 'submitted', 'published', 'rejected', 'archived'];

export function MyContributions({ items, onContribute }: { items: LearningContent[]; onContribute: () => void }) {
  const { archive } = useContent();
  const [status, setStatus] = useState<ContentStatus | 'all'>('all');
  const [editing, setEditing] = useState<LearningContent | null>(null);
  const shown = status === 'all' ? items : items.filter((i) => i.status === status);

  return (
    <div className="stack">
      <div className="chips" role="group" aria-label="Filter by status">
        <Chip active={status === 'all'} onClick={() => setStatus('all')}>All ({items.length})</Chip>
        {STATUSES.map((s) => (
          <Chip key={s} active={status === s} onClick={() => setStatus(s)}>{STATUS_LABEL[s]} ({items.filter((i) => i.status === s).length})</Chip>
        ))}
      </div>
      {shown.length === 0 ? (
        <EmptyState title="Nothing here yet" message="Share a tip, prompt or use case to get started." />
      ) : (
        <div className="grid grid-2">
          {shown.map((i) => (
            <ContentCard
              key={i.id}
              item={i}
              showStatus
              actions={
                i.status === 'draft' || i.status === 'rejected' ? (
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(i)}>
                    <Pencil size={14} />{i.status === 'rejected' ? 'Edit & resubmit' : 'Edit'}
                  </button>
                ) : i.status === 'published' ? (
                  <div className="row" style={{ gap: 8 }}>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(i)}><Pencil size={14} />Edit (new version)</button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => archive(i.id)}><Archive size={14} />Archive</button>
                  </div>
                ) : undefined
              }
            />
          ))}
        </div>
      )}
      <div><button className="btn btn-ghost btn-sm" onClick={onContribute}><PenSquare size={14} />New contribution</button></div>
      {editing && <ContributeModal key={editing.id} editing={editing} onClose={() => setEditing(null)} onDone={() => setEditing(null)} />}
    </div>
  );
}
