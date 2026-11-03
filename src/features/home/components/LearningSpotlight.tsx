import { Link } from 'react-router-dom';
import { SectionHeader } from '@/components/ui';
import { ContentCard } from '@/features/learn/components/ContentCard';
import { useContent } from '@/core/ContentContext';

export function LearningSpotlight() {
  const { items } = useContent();
  const top = items.filter((i) => i.status === 'published').sort((a, b) => b.likes - a.likes).slice(0, 2);
  return (
    <section>
      <SectionHeader title="Popular in Learn" subtitle="What colleagues are finding useful" action={<Link to="/learn" className="btn btn-ghost btn-sm">Go to Learn</Link>} />
      <div className="grid grid-2">{top.map((i) => <ContentCard key={i.id} item={i} />)}</div>
    </section>
  );
}
