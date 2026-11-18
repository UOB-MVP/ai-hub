import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type {
  AccessRequest, AiApp, AppCategory, AppFeedback, AppHosting, AppLifecycle, RequestStatus, UserStatus,
} from './types';
import { APPS } from '@/data/apps';
import { SEED_REQUESTS } from '@/data/requests';
import { SEED_FEEDBACK } from '@/data/feedback';
import { SEED_USAGE } from '@/data/usage';
import { USERS, CURRENT_USER, getUser } from '@/data/users';
import { INITIAL_APP_TAGS } from '@/data/tags';
import { useNotifications } from './NotificationsContext';
import { useAuditLog } from './AuditLogContext';
import { downloadCsv } from './csv';

/** True while an app's "NEW" banner has not yet expired. */
export const isAppNew = (app: Pick<AiApp, 'newBadge'>) => !!app.newBadge && new Date(app.newBadge.expiresAt).getTime() > Date.now();

interface PlatformState {
  apps: AiApp[];
  /** Apps visible in Discover/Use – published, non-retired. */
  publishedApps: AiApp[];
  getApp: (id: string) => AiApp | undefined;
  updateApp: (id: string, patch: Partial<AiApp>) => void;
  /** Metadata edits a Platform Admin makes from App Management – logged to the audit trail. */
  updateAppMetadata: (id: string, patch: Partial<AiApp>) => void;
  setLifecycle: (id: string, lifecycle: AppLifecycle) => void;
  publishApp: (id: string) => void;
  retireApp: (id: string, note: string) => void;
  createPlaceholder: (name: string, category: AppCategory) => void;
  submitApp: (input: { name: string; category: AppCategory; description: string; hosting: AppHosting; url: string; tags?: string[]; countries?: string[]; languages?: string[]; newBadgeDays?: number; raiEvidence?: string; ownerId?: string }) => void;
  assignOwner: (id: string, ownerId: string) => void;
  toggleFeatured: (id: string) => void;
  toggleAppBlocked: (id: string) => void;
  setAppSessionTimeout: (id: string, minutes: number | undefined) => void;
  setNewBadge: (id: string, days: number | null) => void;

  /** Platform Admin-managed predefined tag list for apps (BRD 6.6). */
  appTags: string[];
  addAppTag: (tag: string) => void;
  removeAppTag: (tag: string) => void;

  /** Global defaults a Platform Admin controls (BRD "configure session timeout for apps"). */
  defaultSessionTimeoutMinutes: number;
  setDefaultSessionTimeout: (minutes: number) => void;

  requests: AccessRequest[];
  requestsForApp: (appId: string) => AccessRequest[];
  requestsForUser: (userId: string) => AccessRequest[];
  submitAccessRequest: (appId: string, userId?: string) => void;
  resolveRequest: (id: string, status: Extract<RequestStatus, 'approved' | 'rejected'>, reason?: string) => void;
  hasAccess: (app: AiApp, userId?: string) => boolean;
  isRequested: (app: AiApp, userId?: string) => boolean;

  feedback: AppFeedback[];
  feedbackForApp: (appId: string) => AppFeedback[];
  /** Feedback a given viewer is allowed to see for an app: everyone sees their own; Platform Admin and the app owner see all (BRD 3.7/3.11). */
  visibleFeedbackForApp: (appId: string, viewerId: string, isAdmin: boolean) => AppFeedback[];
  addFeedback: (appId: string, rating: number, comment?: string, userId?: string) => void;
  exportFeedback: (appId: string) => void;

  users: typeof USERS;
  setUserStatus: (userId: string, status: UserStatus) => void;

  usageForApp: (appId: string) => typeof SEED_USAGE;
  usageForUser: (userId: string) => typeof SEED_USAGE;
}

const Ctx = createContext<PlatformState | null>(null);

/** Central mock store for apps, access requests, feedback and user status. Replace each action with an API mutation later. */
export function PlatformProvider({ children }: { children: ReactNode }) {
  const { notify } = useNotifications();
  const { log } = useAuditLog();
  const [apps, setApps] = useState<AiApp[]>(APPS);
  const [requests, setRequests] = useState<AccessRequest[]>(SEED_REQUESTS);
  const [feedback, setFeedback] = useState<AppFeedback[]>(SEED_FEEDBACK);
  const [users, setUsers] = useState(USERS);
  const [appTags, setAppTags] = useState<string[]>(INITIAL_APP_TAGS);
  const [defaultSessionTimeoutMinutes, setDefaultSessionTimeout] = useState(30);

  const getApp = useCallback((id: string) => apps.find((a) => a.id === id), [apps]);

  const updateApp = useCallback((id: string, patch: Partial<AiApp>) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }, []);

  const updateAppMetadata = useCallback((id: string, patch: Partial<AiApp>) => {
    updateApp(id, patch);
    log({ userId: CURRENT_USER.id, action: 'app_metadata_updated', activityType: 'governance', detail: `Updated metadata for ${getApp(id)?.name ?? id}`, appId: id });
  }, [updateApp, log, getApp]);

  const setLifecycle = useCallback((id: string, lifecycle: AppLifecycle) => updateApp(id, { lifecycle }), [updateApp]);

  const publishApp = useCallback((id: string) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, lifecycle: 'published', placeholder: false } : a)));
  }, []);

  const retireApp = useCallback((id: string, note: string) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, lifecycle: 'retired' } : a)));
    const app = apps.find((a) => a.id === id);
    if (app) {
      notify({ kind: 'health', title: `${app.name} retired`, body: note || `${app.name} has been retired from AI Hub.`, link: '/apps', userId: app.ownerId });
      log({ userId: CURRENT_USER.id, action: 'app_archived', activityType: 'governance', detail: `Archived ${app.name}: ${note}`, appId: id });
    }
  }, [apps, notify, log]);

  const setAppSessionTimeout = useCallback((id: string, minutes: number | undefined) => updateAppMetadata(id, { sessionTimeoutMinutes: minutes }), [updateAppMetadata]);

  const setNewBadge = useCallback((id: string, days: number | null) => {
    if (days === null) { updateApp(id, { newBadge: undefined }); return; }
    const expires = new Date();
    expires.setUTCDate(expires.getUTCDate() + days);
    updateApp(id, { newBadge: { expiresAt: expires.toISOString().slice(0, 10) } });
  }, [updateApp]);

  const addAppTag = useCallback((tag: string) => {
    const t = tag.trim();
    if (!t) return;
    setAppTags((prev) => (prev.includes(t) ? prev : [...prev, t]));
    log({ userId: CURRENT_USER.id, action: 'app_tag_updated', activityType: 'governance', detail: `Added app tag "${t}" to the predefined list` });
  }, [log]);

  const removeAppTag = useCallback((tag: string) => {
    setAppTags((prev) => prev.filter((t) => t !== tag));
    log({ userId: CURRENT_USER.id, action: 'app_tag_updated', activityType: 'governance', detail: `Removed app tag "${tag}" from the predefined list` });
  }, [log]);

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

  const submitApp = useCallback((input: { name: string; category: AppCategory; description: string; hosting: AppHosting; url: string; tags?: string[]; countries?: string[]; languages?: string[]; newBadgeDays?: number; raiEvidence?: string; ownerId?: string }) => {
    const id = `app-${Date.now()}`;
    const newBadge = input.newBadgeDays
      ? { expiresAt: new Date(Date.now() + input.newBadgeDays * 86400000).toISOString().slice(0, 10) }
      : undefined;
    setApps((prev) => [
      {
        id, name: input.name, icon: 'sparkles', hue: 240, lifecycle: 'onboarding',
        tagline: input.description.slice(0, 80), description: input.description,
        category: input.category, status: 'Pilot', access: 'Request access', ownerId: input.ownerId ?? CURRENT_USER.id, department: '—',
        tags: input.tags ?? [], capabilities: [], url: input.url || '#', hosting: input.hosting,
        version: 'v0.1', releaseDate: new Date().toISOString().slice(0, 10), whatsNew: [], supportContact: '—',
        rating: 0, ratingCount: 0, upvotes: 0, userCount: 0, health: 'healthy', raiStatus: 'pending',
        tokenUsage30d: 0, requests30d: 0, dau: 0, raiEvidence: input.raiEvidence,
        countries: input.countries, languages: input.languages, newBadge,
      },
      ...prev,
    ]);
    log({ userId: CURRENT_USER.id, action: 'app_onboarded', activityType: 'governance', detail: `Onboarded ${input.name}`, appId: id });
  }, [log]);

  const assignOwner = useCallback((id: string, ownerId: string) => {
    updateApp(id, { ownerId });
    notify({ kind: 'access', title: 'You were assigned as app owner', body: `You now own ${getApp(id)?.name ?? 'an app'} on AI Hub.`, link: '/console', userId: ownerId });
  }, [updateApp, notify, getApp]);

  const toggleFeatured = useCallback((id: string) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, featured: !a.featured, featuredPriority: !a.featured ? (Math.max(0, ...prev.map((x) => x.featuredPriority ?? 0)) + 1) : undefined } : a)));
  }, []);

  const toggleAppBlocked = useCallback((id: string) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, blocked: !a.blocked } : a)));
    const app = apps.find((a) => a.id === id);
    if (app) {
      notify({
        kind: 'health',
        title: app.blocked ? `${app.name} unblocked` : `${app.name} blocked`,
        body: app.blocked ? `${app.name} is available again on AI Hub.` : `${app.name} has been blocked from launch and catalogue visibility by a Platform Admin.`,
        link: '/console',
        userId: app.ownerId,
      });
    }
  }, [apps, notify]);

  const requestsForApp = useCallback((appId: string) => requests.filter((r) => r.appId === appId), [requests]);
  const requestsForUser = useCallback((userId: string) => requests.filter((r) => r.userId === userId), [requests]);

  const submitAccessRequest = useCallback((appId: string, userId: string = CURRENT_USER.id) => {
    setRequests((prev) => {
      if (prev.some((r) => r.appId === appId && r.userId === userId && r.status === 'pending')) return prev;
      return [{ id: `req-${Date.now()}`, appId, userId, status: 'pending', createdAt: new Date().toISOString().slice(0, 10) }, ...prev];
    });
    log({ userId, action: 'access_requested', activityType: 'request', detail: `Requested access to ${getApp(appId)?.name ?? appId}`, appId });
  }, [log, getApp]);

  const resolveRequest = useCallback((id: string, status: Extract<RequestStatus, 'approved' | 'rejected'>, reason?: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status, reason, resolvedAt: new Date().toISOString().slice(0, 10) } : r)));
    const req = requests.find((r) => r.id === id);
    if (req) {
      const app = getApp(req.appId);
      notify({
        kind: 'access',
        title: status === 'approved' ? `Access approved: ${app?.name ?? req.appId}` : `Access request declined: ${app?.name ?? req.appId}`,
        body: status === 'approved' ? 'You can now launch this app from Use.' : (reason || 'Contact the app owner for details.'),
        link: '/apps?tab=mine',
        userId: req.userId,
      });
      log({ userId: CURRENT_USER.id, action: status === 'approved' ? 'access_approved' : 'access_rejected', activityType: 'request', detail: `${status === 'approved' ? 'Approved' : 'Declined'} ${req.userId} for ${app?.name ?? req.appId}`, appId: req.appId });
    }
  }, [requests, getApp, notify, log]);

  /** Apps are only reachable (catalogue, launch, direct/bookmarked URL) while not blocked and not archived. */
  const hasAccess = useCallback((app: AiApp, userId: string = CURRENT_USER.id) => (
    !app.blocked && app.lifecycle !== 'retired'
    && (app.access === 'All staff' || app.ownerId === userId || requests.some((r) => r.appId === app.id && r.userId === userId && r.status === 'approved'))
  ), [requests]);

  const isRequested = useCallback((app: AiApp, userId: string = CURRENT_USER.id) => (
    requests.some((r) => r.appId === app.id && r.userId === userId && r.status === 'pending')
  ), [requests]);

  const feedbackForApp = useCallback((appId: string) => feedback.filter((f) => f.appId === appId), [feedback]);

  /** Ratings/feedback are private between the author, the app owner and Platform Admin (BRD 3.7/3.11). */
  const visibleFeedbackForApp = useCallback((appId: string, viewerId: string, isAdmin: boolean) => {
    const all = feedback.filter((f) => f.appId === appId);
    const app = getApp(appId);
    if (isAdmin || app?.ownerId === viewerId) return all;
    return all.filter((f) => f.userId === viewerId);
  }, [feedback, getApp]);

  const addFeedback = useCallback((appId: string, rating: number, comment?: string, userId: string = CURRENT_USER.id) => {
    setFeedback((prev) => [{ id: `fb-${Date.now()}`, appId, userId, rating, comment, createdAt: new Date().toISOString().slice(0, 10) }, ...prev]);
    setApps((prev) => prev.map((a) => {
      if (a.id !== appId) return a;
      const total = a.rating * a.ratingCount + rating;
      const count = a.ratingCount + 1;
      return { ...a, rating: Math.round((total / count) * 10) / 10, ratingCount: count };
    }));
  }, []);

  const exportFeedback = useCallback((appId: string) => {
    const app = getApp(appId);
    const rows = feedback.filter((f) => f.appId === appId).map((f) => ({
      app: app?.name ?? appId, user: getUser(f.userId).name, lan_id: getUser(f.userId).lanId, rating: f.rating, comment: f.comment ?? '', date: f.createdAt,
    }));
    downloadCsv(`${app?.name ?? appId}-feedback-${new Date().toISOString().slice(0, 10)}.csv`, rows);
  }, [feedback, getApp]);

  const setUserStatus = useCallback((userId: string, status: UserStatus) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status } : u)));
  }, []);

  const usageForApp = useCallback((appId: string) => SEED_USAGE.filter((u) => u.appId === appId), []);
  const usageForUser = useCallback((userId: string) => SEED_USAGE.filter((u) => u.userId === userId), []);

  const publishedApps = useMemo(() => apps.filter((a) => a.lifecycle === 'published' && !a.blocked), [apps]);

  const value = useMemo<PlatformState>(() => ({
    apps, publishedApps, getApp, updateApp, updateAppMetadata, setLifecycle, publishApp, retireApp, createPlaceholder, submitApp, assignOwner, toggleFeatured, toggleAppBlocked,
    setAppSessionTimeout, setNewBadge, appTags, addAppTag, removeAppTag, defaultSessionTimeoutMinutes, setDefaultSessionTimeout,
    requests, requestsForApp, requestsForUser, submitAccessRequest, resolveRequest, hasAccess, isRequested,
    feedback, feedbackForApp, visibleFeedbackForApp, addFeedback, exportFeedback,
    users, setUserStatus,
    usageForApp, usageForUser,
  }), [apps, publishedApps, getApp, updateApp, updateAppMetadata, setLifecycle, publishApp, retireApp, createPlaceholder, submitApp, assignOwner, toggleFeatured, toggleAppBlocked,
    setAppSessionTimeout, setNewBadge, appTags, addAppTag, removeAppTag, defaultSessionTimeoutMinutes,
    requests, requestsForApp, requestsForUser, submitAccessRequest, resolveRequest, hasAccess, isRequested,
    feedback, feedbackForApp, visibleFeedbackForApp, addFeedback, exportFeedback, users, setUserStatus, usageForApp, usageForUser]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePlatform() {
  const v = useContext(Ctx);
  if (!v) throw new Error('usePlatform must be used inside PlatformProvider');
  return v;
}
