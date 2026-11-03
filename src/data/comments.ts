import type { LearningComment } from '@/core/types';

export const SEED_COMMENTS: LearningComment[] = [
  { id: 'lc-1', contentId: 'l-1', userId: 'u-ben', body: 'Used this on a 40-page credit memo this morning — cut my review time in half.', rating: 5, createdAt: '2026-10-14' },
  { id: 'lc-2', contentId: 'l-1', userId: 'u-grace', body: 'Works well, though I had to trim the prompt for very long documents.', rating: 4, createdAt: '2026-10-16' },
  { id: 'lc-3', contentId: 'l-4', userId: 'u-alex', body: 'Great starting point — adapted it for branch opening checklists.', rating: 4, createdAt: '2026-10-21' },
];
