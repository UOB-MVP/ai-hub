import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AiApp } from './types';
import { usePlatform } from './PlatformContext';
import { useAuditLog } from './AuditLogContext';
import { CURRENT_USER } from '@/data/users';

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

const LOCK_KEY_PREFIX = 'uob-ai-hub:app-lock:';

/**
 * Enforces "one active instance of an app per user at a time" (BRD 1.5) across tabs/
 * windows using localStorage as a cross-tab broadcast: launching writes a fresh
 * instance id; any other tab holding that same app reacts to the `storage` event and
 * flags itself as superseded.
 */
function claimInstance(appId: string, userId: string): string {
  const key = `${LOCK_KEY_PREFIX}${appId}:${userId}`;
  const instanceId = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
  try { localStorage.setItem(key, instanceId); } catch { /* storage unavailable */ }
  return instanceId;
}

/** Hook used by AppRunPage/ExternalAppPage to know when another tab has taken over this app session. */
export function useInstanceSupersession(appId: string | undefined, userId: string = CURRENT_USER.id) {
  const [instanceId] = useState(() => (appId ? claimInstance(appId, userId) : ''));
  const [superseded, setSuperseded] = useState(false);

  useEffect(() => {
    if (!appId) return;
    const key = `${LOCK_KEY_PREFIX}${appId}:${userId}`;
    const onStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue && e.newValue !== instanceId) setSuperseded(true);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [appId, userId, instanceId]);

  return superseded;
}

/** Personal favourites, recents and launch behaviour. Entitlement logic lives in PlatformContext. */
export function AppAccessProvider({ children }: { children: ReactNode }) {
  const platform = usePlatform();
  const navigate = useNavigate();
  const { log } = useAuditLog();
  const [favourites, setFav] = useState<string[]>(['rcp-bot', 'hr-bot']);
  const [recent, setRecent] = useState<string[]>(['rcp-bot', 'doc-intel']);
  const [upvoted, setUpvoted] = useState<string[]>([]);

  const value = useMemo<AccessState>(() => ({
    hasAccess: platform.hasAccess,
    isRequested: platform.isRequested,
    requestAccess: (a) => platform.submitAccessRequest(a.id),
    favourites,
    toggleFavourite: (id) => {
      const already = favourites.includes(id);
      setFav((f) => (already ? f.filter((x) => x !== id) : [...f, id]));
      log({ userId: CURRENT_USER.id, action: already ? 'favourite_app_remove' : 'favourite_app_add', activityType: 'content', detail: `${already ? 'Removed' : 'Added'} favourite on app ${id}`, appId: id });
    },
    launch: (a) => {
      // The actual audit log entry is written on mount by AppRunPage/ExternalAppPage, which
      // covers both this path and apps reached directly via a saved/bookmarked URL (BRD 1.4).
      setRecent((r) => [a.id, ...r.filter((x) => x !== a.id)].slice(0, 6));
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
  }), [platform, favourites, recent, upvoted, navigate, log]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppAccess() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAppAccess must be used inside AppAccessProvider');
  return v;
}
