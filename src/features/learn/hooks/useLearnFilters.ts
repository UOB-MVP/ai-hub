import { useState } from 'react';
import type { ContentType, LearnCategory } from '@/core/types';

export type LearnType = 'all' | ContentType;

/** Filter state for the "All" feed (type chips, search, and the leaderboard's category/author filters). */
export function useLearnFilters() {
  const [type, setType] = useState<LearnType>('all');
  const [category, setCategory] = useState<LearnCategory | null>(null);
  const [authorId, setAuthorId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const toggleCategory = (c: LearnCategory) => setCategory((cur) => (cur === c ? null : c));
  const toggleAuthor = (id: string) => setAuthorId((cur) => (cur === id ? null : id));
  const clear = () => { setCategory(null); setAuthorId(null); setQuery(''); };

  return { type, setType, category, setCategory, toggleCategory, authorId, toggleAuthor, setAuthorId, query, setQuery, clear };
}
