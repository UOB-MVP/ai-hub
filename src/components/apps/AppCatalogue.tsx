import { useState } from 'react';
import { AppCard } from './AppCard';
import { AppDetailModal } from './AppDetailModal';
import { EmptyState } from '@/components/ui';
import type { AiApp } from '@/core/types';
import { useAppAccess } from '@/core/useAppAccess';

/** Renders a grid of apps plus the detail modal. Reused by Home, Discover and Use. */
export function AppCatalogue({ apps, mode, emptyMessage }: { apps: AiApp[]; mode: 'discover' | 'use'; emptyMessage?: string }) {
  const [selected, setSelected] = useState<AiApp | null>(null);
  const { hasAccess, isRequested, requestAccess, launch } = useAppAccess();

  if (!apps.length) return <EmptyState title="No apps found" message={emptyMessage ?? 'Try adjusting your search or filters.'} />;
  return (
    <>
      <div className="grid grid-3">
        {apps.map((a) => {
          const ok = hasAccess(a);
          const action =
            mode === 'use'
              ? ok ? { label: 'Launch', onClick: launch } : { label: isRequested(a) ? 'Requested' : 'Request access', onClick: () => (isRequested(a) ? null : requestAccess(a)) }
              : { label: 'View details', onClick: setSelected, variant: 'ghost' as const };
          return <AppCard key={a.id} app={a} onOpen={setSelected} hasAccess={mode === 'use' ? ok : true} action={action} />;
        })}
      </div>
      {selected && (
        <AppDetailModal app={selected} hasAccess={hasAccess(selected)} requested={isRequested(selected)} onClose={() => setSelected(null)} onLaunch={launch} onRequest={requestAccess} />
      )}
    </>
  );
}
