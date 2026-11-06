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
  /** Create or update the author's own content. `submit` sends it for moderator approval; otherwise it is kept as a draft. Returns the item id. */
  save: (c: NewContent, opts?: { id?: string; submit?: boolean }) => string;
  submitDraft: (id: string) => void;
  remove: (id: string) => void;
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

  const save = useCallback((c: NewContent, opts: { id?: string; submit?: boolean } = {}) => {
    const id = opts.id ?? `c-${Date.now()}`;
    const status = opts.submit ? 'submitted' : 'draft';
    const screened = opts.submit ? screenContent(c) : { flagged: false, flagReason: undefined };
    const readMins = Math.max(1, Math.round(((c.body ?? c.summary).length) / 600));
    setItems((prev) => {
      const patch = { ...c, status: status as LearningContent['status'], readMins, rejectionReason: undefined, ...screened };
      if (prev.some((i) => i.id === id)) return prev.map((i) => (i.id === id ? { ...i, ...patch } : i));
      return [{ id, authorId: CURRENT_USER.id, likes: 0, createdAt: new Date().toISOString().slice(0, 10), ...patch }, ...prev];
    });
    return id;
  }, []);

  const submitDraft = useCallback((id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'submitted', rejectionReason: undefined, ...screenContent({ ...i, tags: i.tags }) } : i)));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.authorId === CURRENT_USER.id && i.status === 'draft')));
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

  const value = useMemo(() => ({ items, save, submitDraft, remove, toggleLike, approve, reject, commentsFor, addComment }), [items, save, submitDraft, remove, toggleLike, approve, reject, commentsFor, addComment]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useContent() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useContent must be used inside ContentProvider');
  return v;
}
