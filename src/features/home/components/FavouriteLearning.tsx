import { useMemo } from 'react';
import { SectionHeader } from '@/components/ui';
import { ContentCard } from '@/features/learn/components/ContentCard';
import { useContent } from '@/core/ContentContext';

/** "Favorite Learning" rail on the landing page (BRD 2.1/Access Matrix) – favourited apps already surface via "My apps". */
export function FavouriteLearning() {
  const { items, favourites } = useContent();
  const favourited = useMemo(
    () => favourites.map((id) => items.find((i) => i.id === id)).filter((i): i is NonNullable<typeof i> => !!i && i.status === 'published'),
    [favourites, items],
  );
  if (!favourited.length) return null;
  return (
    <section>
      <SectionHeader title="Favorite learning" subtitle="Content you've starred" />
      <div className="grid grid-2">{favourited.map((i) => <ContentCard key={i.id} item={i} />)}</div>
    </section>
  );
}
