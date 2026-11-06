import type { AppNotification } from '@/core/types';

/** Seeded notifications for the demo identity (`u-me`). New ones are pushed by PlatformContext actions. */
export const SEED_NOTIFICATIONS: AppNotification[] = [
  { id: 'n-1', userId: 'u-me', kind: 'access', title: 'Access request submitted', body: 'Your request for Branch BOT is pending approval.', createdAt: '2026-10-20', read: true, link: '/apps?tab=mine' },
  { id: 'n-2', userId: 'u-me', kind: 'access', title: 'Access approved', body: 'Your request for BYOB Studio was approved.', createdAt: '2026-10-06', read: true, link: '/apps?tab=mine' },
  { id: 'n-3', userId: 'u-me', kind: 'announcement', title: 'New announcement: Welcome to AI Hub', body: 'Platform Admin published a new announcement.', createdAt: '2026-10-01', read: false, link: '/home' },
  { id: 'n-4', userId: 'u-me', kind: 'health', title: 'Branch BOT health: degraded', body: 'Branch BOT is reporting elevated response times.', createdAt: '2026-10-30', read: false, link: '/control-centre' },
];
