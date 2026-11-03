import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AppIcon } from '@/components/ui/AppIcon';
import { LEARNING_AREAS } from '@/data/learning';
import { useContent } from '@/core/ContentContext';
import './learning-areas.css';

/** Entry cards for the learning areas. Reused by Home and Discover. */
export function LearningAreaCards() {
  const { items } = useContent();
  return (
    <div className="grid grid-3">
      {LEARNING_AREAS.map((a) => {
        const n = items.filter((i) => i.type === a.id && i.status === 'published').length;
        return (
          <Link key={a.id} to={`/learn?type=${a.id}`} className="card card-hover area-card">
            <div className="row" style={{ gap: 14 }}>
              <AppIcon name={a.icon} hue={a.hue} size={48} />
              <div className="grow"><h3>{a.title}</h3><span className="muted small">{n ? `${n} published` : 'Be the first to contribute'}</span></div>
            </div>
            <p className="muted">{a.description}</p>
            <span className="area-cta">Open <ArrowRight size={15} /></span>
          </Link>
        );
      })}
    </div>
  );
}
