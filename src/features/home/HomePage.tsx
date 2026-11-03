import { HomeHero } from './components/HomeHero';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { PersonaPanel } from './components/PersonaPanel';
import { ThemeCards } from './components/ThemeCards';
import { FeaturedApps } from './components/FeaturedApps';
import { SectionHeader } from '@/components/ui';
import { LearningAreaCards } from '@/components/learn/LearningAreaCards';

export function HomePage() {
  return (
    <>
      <HomeHero />
      <AnnouncementBanner />
      <PersonaPanel />
      <ThemeCards />
      <FeaturedApps />
      <section>
        <SectionHeader title="Learn" subtitle="Prompts, news and use cases to grow your AI skills" />
        <LearningAreaCards />
      </section>
    </>
  );
}
