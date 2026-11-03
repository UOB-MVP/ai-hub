import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { AiApp } from './types';

interface AccessState {
  hasAccess: (a: AiApp) => boolean;
  isRequested: (a: AiApp) => boolean;
  requestAccess: (a: AiApp) => void;
  favourites: string[];
  toggleFavourite: (id: string) => void;
  launch: (a: AiApp) => void;
  recent: string[];
}

const Ctx = createContext<AccessState | null>(null);

/** Entitlements, favourites and recents. Replace with API-backed state later. */
export function AppAccessProvider({ children }: { children: ReactNode }) {
  const [requested, setRequested] = useState<string[]>([]);
  const [favourites, setFav] = useState<string[]>(['uob-assist', 'code-pilot']);
  const [recent, setRecent] = useState<string[]>(['uob-assist', 'insight-studio', 'reg-radar']);

  const hasAccess = useCallback((a: AiApp) => a.access === 'All staff', []);
  const value = useMemo<AccessState>(() => ({
    hasAccess,
    isRequested: (a) => requested.includes(a.id),
    requestAccess: (a) => setRequested((r) => [...new Set([...r, a.id])]),
    favourites,
    toggleFavourite: (id) => setFav((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
    launch: (a) => {
      setRecent((r) => [a.id, ...r.filter((x) => x !== a.id)].slice(0, 6));
      if (a.url && a.url !== '#') window.open(a.url, '_blank', 'noopener');
    },
    recent,
  }), [requested, favourites, recent, hasAccess]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppAccess() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAppAccess must be used inside AppAccessProvider');
  return v;
}
