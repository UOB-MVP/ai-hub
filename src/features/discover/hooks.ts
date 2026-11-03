import { useMemo, useState } from 'react';
import { usePlatform } from '@/core/PlatformContext';
import type { AppCategory, AppStatus } from '@/core/types';

export type AppSort = 'featured' | 'name';

export function useAppFilters() {
  const { publishedApps } = usePlatform();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<AppCategory | null>(null);
  const [status, setStatus] = useState<AppStatus | null>(null);
  const [sort, setSort] = useState<AppSort>('featured');

  const apps = useMemo(() => {
    const q = query.trim().toLowerCase();
    return publishedApps.filter((a) => !category || a.category === category)
      .filter((a) => !status || a.status === status)
      .filter((a) => !q || `${a.name} ${a.tagline} ${a.description} ${a.tags.join(' ')} ${a.department}`.toLowerCase().includes(q))
      .sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name) : (a.featuredPriority ?? 99) - (b.featuredPriority ?? 99) || Number(!!b.featured) - Number(!!a.featured)));
  }, [publishedApps, query, category, status, sort]);

  return { query, setQuery, category, setCategory, status, setStatus, sort, setSort, apps };
}
