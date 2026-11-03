import { useMemo, useState } from 'react';
import { APPS } from '@/data/apps';
import type { AppCategory, AppStatus } from '@/core/types';

export type AppSort = 'popular' | 'rating' | 'recent' | 'name';

export function useAppFilters() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<AppCategory | null>(null);
  const [status, setStatus] = useState<AppStatus | null>(null);
  const [sort, setSort] = useState<AppSort>('popular');

  const apps = useMemo(() => {
    const q = query.trim().toLowerCase();
    return APPS.filter((a) => !category || a.category === category)
      .filter((a) => !status || a.status === status)
      .filter((a) => !q || `${a.name} ${a.tagline} ${a.description} ${a.tags.join(' ')} ${a.department}`.toLowerCase().includes(q))
      .sort((a, b) =>
        sort === 'popular' ? b.monthlyUsers - a.monthlyUsers : sort === 'rating' ? b.rating - a.rating : sort === 'recent' ? b.updated.localeCompare(a.updated) : a.name.localeCompare(b.name));
  }, [query, category, status, sort]);

  return { query, setQuery, category, setCategory, status, setStatus, sort, setSort, apps };
}
