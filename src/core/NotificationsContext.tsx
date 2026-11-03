import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Announcement, AnnouncementAudience, AppNotification, NotificationKind, PersonaId } from './types';
import { SEED_NOTIFICATIONS } from '@/data/notifications';
import { SEED_ANNOUNCEMENTS } from '@/data/announcements';
import { CURRENT_USER } from '@/data/users';

interface NotificationsState {
  notifications: AppNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  notify: (n: { kind: NotificationKind; title: string; body: string; link?: string; userId?: string }) => void;
  announcements: Announcement[];
  /** Announcements relevant to the given persona, most recent first. */
  announcementsFor: (persona: PersonaId) => Announcement[];
  publishAnnouncement: (a: { title: string; body: string; audience: AnnouncementAudience }) => void;
}

const Ctx = createContext<NotificationsState | null>(null);

const audienceMatches = (audience: AnnouncementAudience, persona: PersonaId) => {
  if (audience === 'all') return true;
  if (audience === 'app-owner') return persona === 'app-owner' || persona === 'platform-admin';
  return true; // 'consumer' is visible to everyone, including richer roles
};

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(SEED_NOTIFICATIONS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(SEED_ANNOUNCEMENTS);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const notify = useCallback<NotificationsState['notify']>(({ kind, title, body, link, userId }) => {
    setNotifications((prev) => [
      { id: `n-${Date.now()}`, userId: userId ?? CURRENT_USER.id, kind, title, body, link, read: false, createdAt: new Date().toISOString().slice(0, 10) },
      ...prev,
    ]);
  }, []);

  const publishAnnouncement = useCallback<NotificationsState['publishAnnouncement']>(({ title, body, audience }) => {
    setAnnouncements((prev) => [
      { id: `ann-${Date.now()}`, title, body, audience, authorId: CURRENT_USER.id, createdAt: new Date().toISOString().slice(0, 10) },
      ...prev,
    ]);
    notify({ kind: 'announcement', title: `New announcement: ${title}`, body, link: '/home' });
  }, [notify]);

  const announcementsFor = useCallback(
    (persona: PersonaId) => announcements.filter((a) => audienceMatches(a.audience, persona)).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [announcements],
  );

  const value = useMemo<NotificationsState>(() => ({
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    markRead,
    markAllRead,
    notify,
    announcements,
    announcementsFor,
    publishAnnouncement,
  }), [notifications, markRead, markAllRead, notify, announcements, announcementsFor, publishAnnouncement]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNotifications() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useNotifications must be used inside NotificationsProvider');
  return v;
}
