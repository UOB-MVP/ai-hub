import { HomeHero } from './components/HomeHero';
import { PersonaPanel } from './components/PersonaPanel';
import { KpiStrip } from './components/KpiStrip';
import { ThemeCards } from './components/ThemeCards';
import { TrendingApps } from './components/TrendingApps';
import { UsageChart } from './components/UsageChart';
import { LearningSpotlight } from './components/LearningSpotlight';

export function HomePage() {
  return (
    <>
      <HomeHero />
      <PersonaPanel />
      <ThemeCards />
      <KpiStrip />
      <TrendingApps />
      <div className="home-split">
        <LearningSpotlight />
        <UsageChart />
      </div>
    </>
  );
}
