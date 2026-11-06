import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { Chip, EmptyState } from '@/components/ui';
import { useContent } from '@/core/ContentContext';
import { usePersona } from '@/core/PersonaContext';
import type { ContentStatus } from '@/core/types';
import { ContentCard, STATUS_LABEL } from '../components/ContentCard';

type Filter = 'all' | Exclude<ContentStatus, 'draft'>;
const FILTERS: Exclude<ContentStatus, 'draft'>[] = ['submitted', 'published', 'rejected'];

/** /learning/submission – everything the user has sent for approval, with its status. Rejected items can be edited and resubmitted. */
export function SubmissionPage() {
  const { items } = useContent();
  const { user } = usePersona();
  const [filter, setFilter] = useState<Filter>('all');
  const mine = items.filter((i) => i.authorId === user.id && i.status !== 'draft').sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const shown = filter === 'all' ? mine : mine.filter((i) => i.status === filter);

  return (
    <div className="stack" style={{ gap: 16 }}>
      <div className="chips" role="group" aria-label="Filter by status">
        <Chip active={filter === 'all'} onClick={() => setFilter('all')}>All ({mine.length})</Chip>
        {FILTERS.map((s) => <Chip key={s} active={filter === s} onClick={() => setFilter(s)}>{STATUS_LABEL[s]} ({mine.filter((i) => i.status === s).length})</Chip>)}
      </div>
      {!shown.length ? (
        <EmptyState title="No submissions here" message="Content you submit for approval appears here with its status." />
      ) : (
        <div className="grid grid-2">
          {shown.map((i) => (
            <ContentCard
              key={i.id}
              item={i}
              showStatus
              actions={i.status === 'rejected' && (
                <div><Link to={`/learning/contribute/${i.id}`} className="btn btn-primary btn-sm"><Pencil size={14} />Edit &amp; resubmit</Link></div>
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
