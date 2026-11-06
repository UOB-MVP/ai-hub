import type { Announcement } from '@/core/types';

export const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Welcome to AI Hub',
    body: 'AI Hub is UOB’s governed home for approved AI applications. Discover what’s available, request access and learn from the community — all in one place.',
    audience: 'all',
    createdAt: '2026-10-01',
    authorId: 'u-me',
  },
  {
    id: 'ann-2',
    title: 'Branch BOT: investigating elevated response times',
    body: 'We are aware of intermittent slow responses on Branch BOT during peak hours and are investigating with the EGP Core team. No action is needed from app owners.',
    audience: 'all',
    createdAt: '2026-10-30',
    authorId: 'u-me',
  },
];
