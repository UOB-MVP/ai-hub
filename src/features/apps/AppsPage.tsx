import { FeaturedApps } from '@/features/home/components/FeaturedApps';
import { Marketplace } from './Marketplace';

/** Apps: featured apps first, then the searchable marketplace (grid or detailed list). */
export function AppsPage() {
  return (
    <>
      <FeaturedApps />
      <Marketplace />
    </>
  );
}
