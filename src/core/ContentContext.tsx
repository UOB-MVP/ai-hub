import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { LearningComment, LearningContent, ContentType, LearnCategory } from './types';
import { SEED_CONTENT } from '@/data/learning';
import { SEED_COMMENTS } from '@/data/comments';
import { CURRENT_USER } from '@/data/users';

export interface NewContent {
  type: ContentType;
  title: string;
  summary: string;
  body?: string;
  category: LearnCategory;
  tags: string[];
}

/** Illustrative only – a short list of terms that trip the mock content-safety filter. */
const FLAGGED_TERMS = ['nric', 'ssn', 'passport number', 'credit card number', 'password', 'confidential'];

function screenContent(c: NewContent): { flagged: boolean; flagReason?: string } {
  const haystack = `${c.title} ${c.summary} ${c.body ?? ''}`.toLowerCase();
  const hit = FLAGGED_TERMS.find((term) => haystack.includes(term));
  return hit ? { flagged: true, flagReason: `Possible sensitive data detected ("${hit}") – review before publishing.` } : { flagged: false };
}

interface ContentState {
  items: LearningContent[];
  contribute: (c: NewContent, asDraft?: boolean) => void;
  toggleLike: (id: string) => void;
  approve: (id: string) => void;
  reject: (id: string, reason: string) => void;
  commentsFor: (contentId: string) => LearningComment[];
  addComment: (contentId: string, body: string, rating?: number) => void;
}

const Ctx = createContext<ContentState | null>(null);

/** In-memory store. Swap each action for an API mutation when the backend lands. */
export function ContentProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LearningContent[]>(SEED_CONTENT);
  const [comments, setComments] = useState<LearningComment[]>(SEED_COMMENTS);

  const contribute = useCallback((c: NewContent) => {
    const screened = screenContent(c);
    setItems((prev) => [
      {
        ...c,
        id: `c-${Date.now()}`,
        authorId: CURRENT_USER.id,
        status: 'draft', // every contribution is reviewed by a Learning Moderator
        likes: 0,
        createdAt: new Date().toISOString().slice(0, 10),
        readMins: Math.max(1, Math.round(((c.body ?? c.summary).length) / 600)),
        ...screened,
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

  const commentsFor = useCallback((contentId: string) => comments.filter((c) => c.contentId === contentId), [comments]);

  const addComment = useCallback((contentId: string, body: string, rating?: number) => {
    setComments((prev) => [...prev, { id: `lc-${Date.now()}`, contentId, userId: CURRENT_USER.id, body, rating, createdAt: new Date().toISOString().slice(0, 10) }]);
  }, []);

  const value = useMemo(() => ({ items, contribute, toggleLike, approve, reject, commentsFor, addComment }), [items, contribute, toggleLike, approve, reject, commentsFor, addComment]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useContent() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useContent must be used inside ContentProvider');
  return v;
}
