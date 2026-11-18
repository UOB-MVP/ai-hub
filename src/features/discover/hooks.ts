import { useMemo, useState } from 'react';
import { usePlatform } from '@/core/PlatformContext';
import type { AppCategory, AppStatus } from '@/core/types';

export type AppSort = 'featured' | 'name' | 'date' | 'country';

function compareSort(sort: AppSort, a: ReturnType<typeof usePlatform>['publishedApps'][number], b: typeof a) {
  if (sort === 'name') return a.name.localeCompare(b.name);
  if (sort === 'date') return b.releaseDate.localeCompare(a.releaseDate);
  if (sort === 'country') {
    if (!a.countries?.length && !b.countries?.length) return a.name.localeCompare(b.name);
    if (!a.countries?.length) return 1;
    if (!b.countries?.length) return -1;
    return a.countries[0].localeCompare(b.countries[0]) || a.name.localeCompare(b.name);
  }
  return (a.featuredPriority ?? 99) - (b.featuredPriority ?? 99) || Number(!!b.featured) - Number(!!a.featured);
}

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
      .sort((a, b) => compareSort(sort, a, b));
  }, [publishedApps, query, category, status, sort]);

  return { query, setQuery, category, setCategory, status, setStatus, sort, setSort, apps };
}
