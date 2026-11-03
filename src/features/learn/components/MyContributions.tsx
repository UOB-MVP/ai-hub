import { useState } from 'react';
import { PenSquare } from 'lucide-react';
import { Chip, EmptyState } from '@/components/ui';
import type { ContentStatus, LearningContent } from '@/core/types';
import { ContentCard, STATUS_LABEL } from './ContentCard';

const STATUSES: ContentStatus[] = ['draft', 'published', 'rejected'];

export function MyContributions({ items, onContribute }: { items: LearningContent[]; onContribute: () => void }) {
  const [status, setStatus] = useState<ContentStatus | 'all'>('all');
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
        <div className="grid grid-2">{shown.map((i) => <ContentCard key={i.id} item={i} showStatus />)}</div>
      )}
      <div><button className="btn btn-ghost btn-sm" onClick={onContribute}><PenSquare size={14} />New contribution</button></div>
    </div>
  );
}
