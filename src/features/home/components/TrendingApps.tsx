import { Link } from 'react-router-dom';
import { SectionHeader } from '@/components/ui';
import { AppCatalogue } from '@/components/apps/AppCatalogue';
import { APPS } from '@/data/apps';

export function TrendingApps() {
  const top = [...APPS].sort((a, b) => b.monthlyUsers - a.monthlyUsers).slice(0, 3);
  return (
    <section>
      <SectionHeader title="Trending apps" subtitle="Most used across UOB this month" action={<Link to="/discover" className="btn btn-ghost btn-sm">See all</Link>} />
      <AppCatalogue apps={top} mode="discover" />
    </section>
  );
}
