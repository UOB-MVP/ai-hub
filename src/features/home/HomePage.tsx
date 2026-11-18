import { HomeGreeting } from './components/HomeGreeting';
import { HomeSearch } from './components/HomeSearch';
import { FeaturedApps } from './components/FeaturedApps';
import { HomeFeaturedLearning } from './components/HomeFeaturedLearning';
import { FavouriteLearning } from './components/FavouriteLearning';
import { MyApps } from './components/MyApps';
import { MyLearning } from './components/MyLearning';

export function HomePage() {
  return (
    <>
      <HomeGreeting />
      <HomeSearch />
      <FeaturedApps />
      <HomeFeaturedLearning />
      <FavouriteLearning />
      <MyApps />
      <MyLearning />
    </>
  );
}
