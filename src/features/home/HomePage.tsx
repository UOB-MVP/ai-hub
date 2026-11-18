import { HomeHero } from './components/HomeHero';
import { HomeSearch } from './components/HomeSearch';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { PersonaPanel } from './components/PersonaPanel';
import { ThemeCards } from './components/ThemeCards';
import { FeaturedApps } from './components/FeaturedApps';
import { FavouritesRail } from './components/FavouritesRail';
import { SectionHeader } from '@/components/ui';
import { LearningAreaCards } from '@/components/learn/LearningAreaCards';

export function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeSearch />
      <AnnouncementBanner />
      <PersonaPanel />
      <ThemeCards />
      <FavouritesRail />
      <FeaturedApps />
      <section>
        <SectionHeader title="Learn" subtitle="Prompts, news and use cases to grow your AI skills" />
        <LearningAreaCards />
      </section>
    </>
  );
}
