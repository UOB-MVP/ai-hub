import { HomeGreeting } from './components/HomeGreeting';
import { FeaturedApps } from './components/FeaturedApps';
import { HomeFeaturedLearning } from './components/HomeFeaturedLearning';
import { MyApps } from './components/MyApps';
import { MyLearning } from './components/MyLearning';

export function HomePage() {
  return (
    <>
      <HomeGreeting />
      <FeaturedApps />
      <HomeFeaturedLearning />
      <MyApps />
      <MyLearning />
    </>
  );
}
