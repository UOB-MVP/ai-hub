import { AlertTriangle, CheckCircle2, ClipboardCheck, XCircle } from 'lucide-react';
import { PageHero, SectionHeader } from '@/components/ui';
import { useContent } from '@/core/ContentContext';
import { usePersona } from '@/core/PersonaContext';
import { ReviewQueue } from '@/features/learn/components/ReviewQueue';
import '@/features/home/components/home.css';

export function ModerationDesk() {
  const { items } = useContent();
  const { user } = usePersona();
  const queue = items.filter((i) => i.status === 'submitted' && i.authorId !== user.id);
  const flagged = queue.filter((i) => i.flagged).length;
  const kpis = [
    { icon: ClipboardCheck, label: 'Awaiting your review', value: queue.length },
    { icon: AlertTriangle, label: 'Flagged by safety filter', value: flagged },
    { icon: CheckCircle2, label: 'Published', value: items.filter((i) => i.status === 'published').length },
    { icon: XCircle, label: 'Rejected', value: items.filter((i) => i.status === 'rejected').length },
  ];
  return (
    <>
      <PageHero eyebrow="Learning Moderator" title="Moderation Desk" description="Every learning contribution waiting for approval, in one queue. Approve to publish, or reject with feedback for the author." />
      <div className="kpi-grid">
        {kpis.map((k) => (
          <div key={k.label} className="card kpi">
            <span className="kpi-icon"><k.icon size={18} /></span>
            <span className="kpi-value">{k.value}</span>
            <span className="kpi-label">{k.label}</span>
          </div>
        ))}
      </div>
      <section>
        <SectionHeader title="Approval requests" subtitle={`${queue.length} pending`} />
        <ReviewQueue items={queue} />
      </section>
    </>
  );
}
