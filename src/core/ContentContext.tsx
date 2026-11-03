import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { LearningContent, ContentType, LearnCategory } from './types';
import { SEED_CONTENT } from '@/data/learning';
import { CURRENT_USER } from '@/data/users';

export interface NewContent {
  type: ContentType;
  title: string;
  summary: string;
  body?: string;
  category: LearnCategory;
  tags: string[];
}

interface ContentState {
  items: LearningContent[];
  contribute: (c: NewContent, asDraft?: boolean) => void;
  toggleLike: (id: string) => void;
  approve: (id: string) => void;
  reject: (id: string, reason: string) => void;
}

const Ctx = createContext<ContentState | null>(null);

/** In-memory store. Swap each action for an API mutation when the backend lands. */
export function ContentProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LearningContent[]>(SEED_CONTENT);

  const contribute = useCallback((c: NewContent) => {
    setItems((prev) => [
      {
        ...c,
        id: `c-${Date.now()}`,
        authorId: CURRENT_USER.id,
        status: 'draft', // every contribution is reviewed by a Learning Moderator
        likes: 0,
        createdAt: new Date().toISOString().slice(0, 10),
        readMins: Math.max(1, Math.round(((c.body ?? c.summary).length) / 600)),
      },
      ...prev,
    ]);
  }, []);

  const toggleLike = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, likedByMe: !i.likedByMe, likes: i.likes + (i.likedByMe ? -1 : 1) } : i)),
    );
  }, []);

  const approve = useCallback((id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'published', rejectionReason: undefined } : i)));
  }, []);

  const reject = useCallback((id: string, reason: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'rejected', rejectionReason: reason } : i)));
  }, []);

  const value = useMemo(() => ({ items, contribute, toggleLike, approve, reject }), [items, contribute, toggleLike, approve, reject]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useContent() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useContent must be used inside ContentProvider');
  return v;
}
