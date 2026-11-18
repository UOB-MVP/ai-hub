import { useMemo } from 'react';
import { SectionHeader } from '@/components/ui';
import { AppCatalogue } from '@/components/apps/AppCatalogue';
import { ContentCard } from '@/features/learn/components/ContentCard';
import { usePlatform } from '@/core/PlatformContext';
import { useAppAccess } from '@/core/useAppAccess';
import { useContent } from '@/core/ContentContext';

/** "Your favourites" rail on the landing page – favourited apps and favourited learning (BRD 2.1). */
export function FavouritesRail() {
  const { apps } = usePlatform();
  const { favourites: favouriteAppIds } = useAppAccess();
  const { items, favourites: favouriteLearningIds } = useContent();

  const favouriteApps = useMemo(() => favouriteAppIds.map((id) => apps.find((a) => a.id === id)).filter((a): a is NonNullable<typeof a> => !!a), [favouriteAppIds, apps]);
  const favouriteLearning = useMemo(() => favouriteLearningIds.map((id) => items.find((i) => i.id === id)).filter((i): i is NonNullable<typeof i> => !!i && i.status === 'published'), [favouriteLearningIds, items]);

  if (!favouriteApps.length && !favouriteLearning.length) return null;

  return (
    <section>
      <SectionHeader title="Your favourites" subtitle="Apps and learning content you've starred" />
      <div className="stack" style={{ gap: 20 }}>
        {favouriteApps.length > 0 && <AppCatalogue apps={favouriteApps} mode="use" />}
        {favouriteLearning.length > 0 && (
          <div className="grid grid-2">{favouriteLearning.map((i) => <ContentCard key={i.id} item={i} />)}</div>
        )}
      </div>
    </section>
  );
}
