import type { AccessRequest } from '@/core/types';

export const SEED_REQUESTS: AccessRequest[] = [
  { id: 'req-1', appId: 'branch-bot', userId: 'u-me', status: 'pending', createdAt: '2026-10-20' },
  { id: 'req-2', appId: 'byob-studio', userId: 'u-me', status: 'approved', createdAt: '2026-10-05', resolvedAt: '2026-10-06' },
  { id: 'req-3', appId: 'rcp-bot', userId: 'u-ben', status: 'pending', createdAt: '2026-10-29' },
  { id: 'req-4', appId: 'branch-bot', userId: 'u-alex', status: 'rejected', createdAt: '2026-09-18', resolvedAt: '2026-09-19', reason: 'Access limited to branch-facing staff during the pilot.' },
];
