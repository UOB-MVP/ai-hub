import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AiApp } from './types';
import { usePlatform } from './PlatformContext';

interface AccessState {
  hasAccess: (a: AiApp) => boolean;
  isRequested: (a: AiApp) => boolean;
  requestAccess: (a: AiApp) => void;
  favourites: string[];
  toggleFavourite: (id: string) => void;
  launch: (a: AiApp) => void;
  recent: string[];
  upvoted: string[];
  toggleUpvote: (a: AiApp) => void;
}

const Ctx = createContext<AccessState | null>(null);

/** Personal favourites, recents and launch behaviour. Entitlement logic lives in PlatformContext. */
export function AppAccessProvider({ children }: { children: ReactNode }) {
  const platform = usePlatform();
  const navigate = useNavigate();
  const [favourites, setFav] = useState<string[]>(['rcp-bot', 'hr-bot']);
  const [recent, setRecent] = useState<string[]>(['rcp-bot', 'doc-intel']);
  const [upvoted, setUpvoted] = useState<string[]>([]);

  const value = useMemo<AccessState>(() => ({
    hasAccess: platform.hasAccess,
    isRequested: platform.isRequested,
    requestAccess: (a) => platform.submitAccessRequest(a.id),
    favourites,
    toggleFavourite: (id) => setFav((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
    launch: (a) => {
      setRecent((r) => [a.id, ...r.filter((x) => x !== a.id)].slice(0, 6));
      // AI Hub-hosted apps stay in the same tab with back navigation; externally hosted apps open in a new tab.
      if (a.hosting === 'external') window.open(`/external/${a.id}`, '_blank', 'noopener');
      else navigate(`/apps/${a.id}`);
    },
    recent,
    upvoted,
    toggleUpvote: (a) => {
      const already = upvoted.includes(a.id);
      setUpvoted((u) => (already ? u.filter((x) => x !== a.id) : [...u, a.id]));
      platform.updateApp(a.id, { upvotes: Math.max(0, a.upvotes + (already ? -1 : 1)) });
    },
  }), [platform, favourites, recent, upvoted, navigate]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppAccess() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAppAccess must be used inside AppAccessProvider');
  return v;
}
