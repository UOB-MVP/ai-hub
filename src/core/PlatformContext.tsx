import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type {
  AccessRequest, AiApp, AppCategory, AppFeedback, AppHosting, AppLifecycle, RequestStatus, UserStatus,
} from './types';
import { APPS } from '@/data/apps';
import { SEED_REQUESTS } from '@/data/requests';
import { SEED_FEEDBACK } from '@/data/feedback';
import { SEED_USAGE } from '@/data/usage';
import { USERS, CURRENT_USER } from '@/data/users';
import { useNotifications } from './NotificationsContext';

interface PlatformState {
  apps: AiApp[];
  /** Apps visible in Discover/Use – published, non-retired. */
  publishedApps: AiApp[];
  getApp: (id: string) => AiApp | undefined;
  updateApp: (id: string, patch: Partial<AiApp>) => void;
  setLifecycle: (id: string, lifecycle: AppLifecycle) => void;
  publishApp: (id: string) => void;
  retireApp: (id: string, note: string) => void;
  createPlaceholder: (name: string, category: AppCategory) => void;
  submitApp: (input: { name: string; category: AppCategory; description: string; hosting: AppHosting; raiEvidence?: string; ownerId?: string }) => void;
  assignOwner: (id: string, ownerId: string) => void;
  toggleFeatured: (id: string) => void;

  requests: AccessRequest[];
  requestsForApp: (appId: string) => AccessRequest[];
  requestsForUser: (userId: string) => AccessRequest[];
  submitAccessRequest: (appId: string, userId?: string) => void;
  resolveRequest: (id: string, status: Extract<RequestStatus, 'approved' | 'rejected'>, reason?: string) => void;
  hasAccess: (app: AiApp, userId?: string) => boolean;
  isRequested: (app: AiApp, userId?: string) => boolean;

  feedback: AppFeedback[];
  feedbackForApp: (appId: string) => AppFeedback[];
  addFeedback: (appId: string, rating: number, comment?: string, userId?: string) => void;

  users: typeof USERS;
  setUserStatus: (userId: string, status: UserStatus) => void;

  usageForApp: (appId: string) => typeof SEED_USAGE;
  usageForUser: (userId: string) => typeof SEED_USAGE;
}

const Ctx = createContext<PlatformState | null>(null);

/** Central mock store for apps, access requests, feedback and user status. Replace each action with an API mutation later. */
export function PlatformProvider({ children }: { children: ReactNode }) {
  const { notify } = useNotifications();
  const [apps, setApps] = useState<AiApp[]>(APPS);
  const [requests, setRequests] = useState<AccessRequest[]>(SEED_REQUESTS);
  const [feedback, setFeedback] = useState<AppFeedback[]>(SEED_FEEDBACK);
  const [users, setUsers] = useState(USERS);

  const getApp = useCallback((id: string) => apps.find((a) => a.id === id), [apps]);

  const updateApp = useCallback((id: string, patch: Partial<AiApp>) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }, []);

  const setLifecycle = useCallback((id: string, lifecycle: AppLifecycle) => updateApp(id, { lifecycle }), [updateApp]);

  const publishApp = useCallback((id: string) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, lifecycle: 'published', placeholder: false } : a)));
  }, []);

  const retireApp = useCallback((id: string, note: string) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, lifecycle: 'retired' } : a)));
    const app = apps.find((a) => a.id === id);
    if (app) notify({ kind: 'health', title: `${app.name} retired`, body: note || `${app.name} has been retired from AI Hub.`, link: '/discover', userId: app.ownerId });
  }, [apps, notify]);

  const createPlaceholder = useCallback((name: string, category: AppCategory) => {
    const id = `app-${Date.now()}`;
    setApps((prev) => [
      {
        id, name, icon: 'sparkles', hue: 230, lifecycle: 'onboarding', placeholder: true,
        tagline: 'Awaiting owner assignment', description: 'Placeholder created by Platform Admin — awaiting owner assignment and onboarding details.',
        category, status: 'Pilot', access: 'Request access', ownerId: 'u-unassigned', department: '—',
        tags: [], capabilities: [], url: '#', hosting: 'internal',
        version: '—', releaseDate: '—', whatsNew: [], supportContact: '—',
        rating: 0, ratingCount: 0, upvotes: 0, userCount: 0, health: 'healthy', raiStatus: 'pending',
        tokenUsage30d: 0, requests30d: 0, dau: 0,
      },
      ...prev,
    ]);
  }, []);

  const submitApp = useCallback((input: { name: string; category: AppCategory; description: string; hosting: AppHosting; raiEvidence?: string; ownerId?: string }) => {
    const id = `app-${Date.now()}`;
    setApps((prev) => [
      {
        id, name: input.name, icon: 'sparkles', hue: 240, lifecycle: 'onboarding',
        tagline: input.description.slice(0, 80), description: input.description,
        category: input.category, status: 'Pilot', access: 'Request access', ownerId: input.ownerId ?? CURRENT_USER.id, department: '—',
        tags: [], capabilities: [], url: '#', hosting: input.hosting,
        version: 'v0.1', releaseDate: new Date().toISOString().slice(0, 10), whatsNew: [], supportContact: '—',
        rating: 0, ratingCount: 0, upvotes: 0, userCount: 0, health: 'healthy', raiStatus: 'pending',
        tokenUsage30d: 0, requests30d: 0, dau: 0, raiEvidence: input.raiEvidence,
      },
      ...prev,
    ]);
  }, []);

  const assignOwner = useCallback((id: string, ownerId: string) => {
    updateApp(id, { ownerId });
    notify({ kind: 'access', title: 'You were assigned as app owner', body: `You now own ${getApp(id)?.name ?? 'an app'} on AI Hub.`, link: '/my-apps', userId: ownerId });
  }, [updateApp, notify, getApp]);

  const toggleFeatured = useCallback((id: string) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, featured: !a.featured, featuredPriority: !a.featured ? (Math.max(0, ...prev.map((x) => x.featuredPriority ?? 0)) + 1) : undefined } : a)));
  }, []);

  const requestsForApp = useCallback((appId: string) => requests.filter((r) => r.appId === appId), [requests]);
  const requestsForUser = useCallback((userId: string) => requests.filter((r) => r.userId === userId), [requests]);

  const submitAccessRequest = useCallback((appId: string, userId: string = CURRENT_USER.id) => {
    setRequests((prev) => {
      if (prev.some((r) => r.appId === appId && r.userId === userId && r.status === 'pending')) return prev;
      return [{ id: `req-${Date.now()}`, appId, userId, status: 'pending', createdAt: new Date().toISOString().slice(0, 10) }, ...prev];
    });
  }, []);

  const resolveRequest = useCallback((id: string, status: Extract<RequestStatus, 'approved' | 'rejected'>, reason?: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status, reason, resolvedAt: new Date().toISOString().slice(0, 10) } : r)));
    const req = requests.find((r) => r.id === id);
    if (req) {
      const app = getApp(req.appId);
      notify({
        kind: 'access',
        title: status === 'approved' ? `Access approved: ${app?.name ?? req.appId}` : `Access request declined: ${app?.name ?? req.appId}`,
        body: status === 'approved' ? 'You can now launch this app from Use.' : (reason || 'Contact the app owner for details.'),
        link: '/use',
        userId: req.userId,
      });
    }
  }, [requests, getApp, notify]);

  const hasAccess = useCallback((app: AiApp, userId: string = CURRENT_USER.id) => (
    app.access === 'All staff' || app.ownerId === userId || requests.some((r) => r.appId === app.id && r.userId === userId && r.status === 'approved')
  ), [requests]);

  const isRequested = useCallback((app: AiApp, userId: string = CURRENT_USER.id) => (
    requests.some((r) => r.appId === app.id && r.userId === userId && r.status === 'pending')
  ), [requests]);

  const feedbackForApp = useCallback((appId: string) => feedback.filter((f) => f.appId === appId), [feedback]);

  const addFeedback = useCallback((appId: string, rating: number, comment?: string, userId: string = CURRENT_USER.id) => {
    setFeedback((prev) => [{ id: `fb-${Date.now()}`, appId, userId, rating, comment, createdAt: new Date().toISOString().slice(0, 10) }, ...prev]);
    setApps((prev) => prev.map((a) => {
      if (a.id !== appId) return a;
      const total = a.rating * a.ratingCount + rating;
      const count = a.ratingCount + 1;
      return { ...a, rating: Math.round((total / count) * 10) / 10, ratingCount: count };
    }));
  }, []);

  const setUserStatus = useCallback((userId: string, status: UserStatus) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status } : u)));
  }, []);

  const usageForApp = useCallback((appId: string) => SEED_USAGE.filter((u) => u.appId === appId), []);
  const usageForUser = useCallback((userId: string) => SEED_USAGE.filter((u) => u.userId === userId), []);

  const publishedApps = useMemo(() => apps.filter((a) => a.lifecycle === 'published'), [apps]);

  const value = useMemo<PlatformState>(() => ({
    apps, publishedApps, getApp, updateApp, setLifecycle, publishApp, retireApp, createPlaceholder, submitApp, assignOwner, toggleFeatured,
    requests, requestsForApp, requestsForUser, submitAccessRequest, resolveRequest, hasAccess, isRequested,
    feedback, feedbackForApp, addFeedback,
    users, setUserStatus,
    usageForApp, usageForUser,
  }), [apps, publishedApps, getApp, updateApp, setLifecycle, publishApp, retireApp, createPlaceholder, submitApp, assignOwner, toggleFeatured,
    requests, requestsForApp, requestsForUser, submitAccessRequest, resolveRequest, hasAccess, isRequested,
    feedback, feedbackForApp, addFeedback, users, setUserStatus, usageForApp, usageForUser]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePlatform() {
  const v = useContext(Ctx);
  if (!v) throw new Error('usePlatform must be used inside PlatformProvider');
  return v;
}
