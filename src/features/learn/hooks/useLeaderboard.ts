import { useMemo } from 'react';
import type { LearningContent, LearnCategory, LeaderboardMetric } from '@/core/types';

export interface LeaderRow { authorId: string; posts: number; likes: number; rank: number }

/** Ranks authors of PUBLISHED content, optionally scoped to a category. */
export function useLeaderboard(items: LearningContent[], metric: LeaderboardMetric, category: LearnCategory | null): LeaderRow[] {
  return useMemo(() => {
    const map = new Map<string, { posts: number; likes: number }>();
    for (const i of items) {
      if (i.status !== 'published') continue;
      if (category && i.category !== category) continue;
      const cur = map.get(i.authorId) ?? { posts: 0, likes: 0 };
      cur.posts += 1; cur.likes += i.likes;
      map.set(i.authorId, cur);
    }
    return [...map.entries()]
      .map(([authorId, v]) => ({ authorId, ...v }))
      .sort((a, b) => b[metric] - a[metric] || b.likes - a.likes)
      .map((r, idx) => ({ ...r, rank: idx + 1 }));
  }, [items, metric, category]);
}
