import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button, EmptyState } from '@/components/ui';
import type { LearningContent } from '@/core/types';
import { useContent } from '@/core/ContentContext';
import { ContentCard } from './ContentCard';

export function ReviewQueue({ items }: { items: LearningContent[] }) {
  const { approve, reject } = useContent();
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  if (!items.length) return <EmptyState title="Queue is clear" message="No submissions are waiting for review." />;
  return (
    <div className="grid grid-2">
      {items.map((i) => (
        <ContentCard
          key={i.id}
          item={i}
          showStatus
          actions={
            rejecting === i.id ? (
              <div className="reject-form">
                <textarea rows={2} placeholder="Feedback for the author (required)" value={reason} onChange={(e) => setReason(e.target.value)} />
                <div className="row" style={{ justifyContent: 'flex-end' }}>
                  <Button size="sm" variant="ghost" onClick={() => { setRejecting(null); setReason(''); }}>Cancel</Button>
                  <Button size="sm" variant="accent" disabled={reason.trim().length < 5} onClick={() => { reject(i.id, reason.trim()); setRejecting(null); setReason(''); }}>Confirm reject</Button>
                </div>
              </div>
            ) : (
              <div className="row" style={{ gap: 8 }}>
                <Button size="sm" onClick={() => approve(i.id)}><Check size={14} />Approve & publish</Button>
                <Button size="sm" variant="ghost" onClick={() => setRejecting(i.id)}><X size={14} />Reject</Button>
              </div>
            )
          }
        />
      ))}
    </div>
  );
}
