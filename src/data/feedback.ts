import type { AppFeedback } from '@/core/types';

export const SEED_FEEDBACK: AppFeedback[] = [
  { id: 'fb-1', appId: 'rcp-bot', userId: 'u-ben', rating: 5, comment: 'Cut my case write-up time in half.', createdAt: '2026-10-11' },
  { id: 'fb-2', appId: 'rcp-bot', userId: 'u-grace', rating: 4, comment: 'Great for playbook lookups, occasionally slow during month-end.', createdAt: '2026-10-22' },
  { id: 'fb-3', appId: 'hr-bot', userId: 'u-grace', rating: 5, comment: 'Finally an easy way to check leave policy without logging a ticket.', createdAt: '2026-09-30' },
  { id: 'fb-4', appId: 'branch-bot', userId: 'u-alex', rating: 3, comment: 'Useful but the opening checklist module needs more branch-specific detail.', createdAt: '2026-09-25' },
  { id: 'fb-5', appId: 'byob-studio', userId: 'u-me', rating: 4, comment: 'Promising pilot — prompt templates save a lot of setup time.', createdAt: '2026-10-29' },
];
