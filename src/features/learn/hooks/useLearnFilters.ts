import { useState } from 'react';
import type { ContentType, LearnCategory } from '@/core/types';

export type LearnView = 'all' | ContentType | 'mine' | 'review';

/** Single source of truth for everything filterable on the Learn page (feed + leaderboard share it). */
export function useLearnFilters() {
  const [view, setView] = useState<LearnView>('all');
  const [category, setCategory] = useState<LearnCategory | null>(null);
  const [authorId, setAuthorId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const toggleCategory = (c: LearnCategory) => setCategory((cur) => (cur === c ? null : c));
  const toggleAuthor = (id: string) => setAuthorId((cur) => (cur === id ? null : id));
  const clear = () => { setCategory(null); setAuthorId(null); setQuery(''); };

  return { view, setView, category, setCategory, toggleCategory, authorId, toggleAuthor, setAuthorId, query, setQuery, clear };
}
export type LearnFilters = ReturnType<typeof useLearnFilters>;
