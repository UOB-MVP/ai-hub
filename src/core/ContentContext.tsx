import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { LearningComment, LearningContent, ContentType, LearnCategory } from './types';
import { SEED_CONTENT } from '@/data/learning';
import { SEED_COMMENTS } from '@/data/comments';
import { CURRENT_USER } from '@/data/users';
import { INITIAL_LEARNING_TAGS } from '@/data/tags';
import { useAuditLog } from './AuditLogContext';

export interface NewContent {
  type: ContentType;
  title: string;
  summary: string;
  body?: string;
  category: LearnCategory;
  tags: string[];
}

const DEFAULT_GUIDELINE = 'Share what works. Do not include customer data, confidential figures or anything that could identify a customer. Test prompts at least twice before sharing, and keep code or data samples generic.';

/** Illustrative only – a short list of terms that trip the mock content-safety filter. */
const FLAGGED_TERMS = ['nric', 'ssn', 'passport number', 'credit card number', 'password', 'confidential'];

function screenContent(c: NewContent): { flagged: boolean; flagReason?: string } {
  const haystack = `${c.title} ${c.summary} ${c.body ?? ''}`.toLowerCase();
  const hit = FLAGGED_TERMS.find((term) => haystack.includes(term));
  return hit ? { flagged: true, flagReason: `Possible sensitive data detected ("${hit}") – review before publishing.` } : { flagged: false };
}

interface ContentState {
  items: LearningContent[];
  /**
   * Create or update the author's own content. `submit` sends it for moderator
   * approval; otherwise it is kept as a draft. Editing an already-published item
   * creates a new pending revision instead of mutating it, so the original stays
   * live until the revision is approved (BRD 5.10). Returns the affected item id.
   */
  save: (c: NewContent, opts?: { id?: string; submit?: boolean }) => string;
  submitDraft: (id: string) => void;
  remove: (id: string) => void;
  toggleLike: (id: string) => void;
  toggleFavourite: (id: string) => void;
  favourites: string[];
  approve: (id: string) => void;
  reject: (id: string, reason: string) => void;
  /** Platform Admin / Learning Moderator can archive any artifact; authors can archive their own (BRD "Archive Artifacts: All/All/Own"). */
  archive: (id: string) => void;
  toggleLearningFeatured: (id: string) => void;
  commentsFor: (contentId: string) => LearningComment[];
  addComment: (contentId: string, body: string, rating?: number) => void;

  /** Predefined, governed learning tag list (BRD 5.7). */
  learningTags: string[];
  addLearningTag: (tag: string) => void;
  removeLearningTag: (tag: string) => void;

  /** Contributor publishing guideline, editable by Learning Moderator/Platform Admin (BRD 5.6). */
  guideline: string;
  setGuideline: (text: string) => void;
}

const Ctx = createContext<ContentState | null>(null);

/** In-memory store. Swap each action for an API mutation when the backend lands. */
export function ContentProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LearningContent[]>(SEED_CONTENT);
  const [comments, setComments] = useState<LearningComment[]>(SEED_COMMENTS);
  const [favourites, setFavourites] = useState<string[]>(['l-1', 'l-4']);
  const [learningTags, setLearningTags] = useState<string[]>(INITIAL_LEARNING_TAGS);
  const [guideline, setGuidelineText] = useState(DEFAULT_GUIDELINE);
  const { log } = useAuditLog();

  const save = useCallback((c: NewContent, opts: { id?: string; submit?: boolean } = {}) => {
    const existing = opts.id ? items.find((i) => i.id === opts.id) : undefined;
    const screened = opts.submit ? screenContent(c) : { flagged: false, flagReason: undefined };
    const readMins = Math.max(1, Math.round(((c.body ?? c.summary).length) / 600));

    // Editing a published item creates a new pending revision; the original stays published until approved.
    if (existing?.status === 'published') {
      const revisionId = `c-${Date.now()}`;
      setItems((prev) => [
        {
          ...c, id: revisionId, authorId: existing.authorId, likes: 0, readMins,
          status: opts.submit ? 'submitted' : 'draft',
          version: existing.version + 1, revisionOf: existing.id,
          createdAt: new Date().toISOString().slice(0, 10), rejectionReason: undefined, ...screened,
        },
        ...prev,
      ]);
      if (opts.submit) log({ userId: CURRENT_USER.id, action: 'learning_submitted', activityType: 'content', detail: `Submitted an update to "${existing.title}" for review (v${existing.version + 1})` });
      return revisionId;
    }

    const id = opts.id ?? `c-${Date.now()}`;
    const status = opts.submit ? 'submitted' : 'draft';
    setItems((prev) => {
      const patch = { ...c, status: status as LearningContent['status'], readMins, rejectionReason: undefined, ...screened };
      if (prev.some((i) => i.id === id)) return prev.map((i) => (i.id === id ? { ...i, ...patch } : i));
      return [{ id, authorId: CURRENT_USER.id, likes: 0, version: 1, createdAt: new Date().toISOString().slice(0, 10), ...patch }, ...prev];
    });
    if (opts.submit) log({ userId: CURRENT_USER.id, action: 'learning_submitted', activityType: 'content', detail: `Submitted "${c.title}" for review` });
    return id;
  }, [items, log]);

  const submitDraft = useCallback((id: string) => {
    const item = items.find((i) => i.id === id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'submitted', rejectionReason: undefined, ...screenContent({ ...i, tags: i.tags }) } : i)));
    if (item) log({ userId: CURRENT_USER.id, action: 'learning_submitted', activityType: 'content', detail: `Submitted "${item.title}" for review` });
  }, [items, log]);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.authorId === CURRENT_USER.id && i.status === 'draft')));
  }, []);

  const toggleLike = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, likedByMe: !i.likedByMe, likes: i.likes + (i.likedByMe ? -1 : 1) } : i)),
    );
  }, []);

  const toggleFavourite = useCallback((id: string) => {
    const already = favourites.includes(id);
    setFavourites((f) => (already ? f.filter((x) => x !== id) : [...f, id]));
    log({ userId: CURRENT_USER.id, action: already ? 'favourite_learning_remove' : 'favourite_learning_add', activityType: 'content', detail: `${already ? 'Removed' : 'Added'} favourite on learning content ${id}` });
  }, [favourites, log]);

  const approve = useCallback((id: string) => {
    const item = items.find((i) => i.id === id);
    setItems((prev) => prev.map((i) => {
      if (i.id === id) return { ...i, status: 'published', rejectionReason: undefined };
      // Approving a revision retires the artifact it supersedes.
      if (item?.revisionOf && i.id === item.revisionOf) return { ...i, status: 'archived' };
      return i;
    }));
    if (item) log({ userId: CURRENT_USER.id, action: 'learning_approved', activityType: 'governance', detail: `Approved and published "${item.title}"` });
  }, [items, log]);

  const reject = useCallback((id: string, reason: string) => {
    const item = items.find((i) => i.id === id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'rejected', rejectionReason: reason } : i)));
    if (item) log({ userId: CURRENT_USER.id, action: 'learning_rejected', activityType: 'governance', detail: `Rejected "${item.title}": ${reason}` });
  }, [items, log]);

  const archive = useCallback((id: string) => {
    const item = items.find((i) => i.id === id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'archived' } : i)));
    if (item) log({ userId: CURRENT_USER.id, action: 'learning_archived', activityType: 'governance', detail: `Archived "${item.title}"` });
  }, [items, log]);

  const toggleLearningFeatured = useCallback((id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, featured: !i.featured } : i)));
  }, []);

  const commentsFor = useCallback((contentId: string) => comments.filter((c) => c.contentId === contentId), [comments]);

  const addComment = useCallback((contentId: string, body: string, rating?: number) => {
    setComments((prev) => [...prev, { id: `lc-${Date.now()}`, contentId, userId: CURRENT_USER.id, body, rating, createdAt: new Date().toISOString().slice(0, 10) }]);
  }, []);

  const addLearningTag = useCallback((tag: string) => {
    const t = tag.trim();
    if (!t) return;
    setLearningTags((prev) => (prev.includes(t) ? prev : [...prev, t]));
    log({ userId: CURRENT_USER.id, action: 'learning_tag_updated', activityType: 'governance', detail: `Added learning tag "${t}" to the predefined list` });
  }, [log]);

  const removeLearningTag = useCallback((tag: string) => {
    setLearningTags((prev) => prev.filter((t) => t !== tag));
    log({ userId: CURRENT_USER.id, action: 'learning_tag_updated', activityType: 'governance', detail: `Removed learning tag "${tag}" from the predefined list` });
  }, [log]);

  const setGuideline = useCallback((text: string) => {
    setGuidelineText(text);
    log({ userId: CURRENT_USER.id, action: 'learning_tag_updated', activityType: 'governance', detail: 'Updated the Learning contributor publishing guideline' });
  }, [log]);

  const value = useMemo<ContentState>(() => ({
    items, save, submitDraft, remove, toggleLike, toggleFavourite, favourites,
    approve, reject, archive, toggleLearningFeatured, commentsFor, addComment,
    learningTags, addLearningTag, removeLearningTag, guideline, setGuideline,
  }), [items, save, submitDraft, remove, toggleLike, toggleFavourite, favourites,
    approve, reject, archive, toggleLearningFeatured, commentsFor, addComment,
    learningTags, addLearningTag, removeLearningTag, guideline, setGuideline]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useContent() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useContent must be used inside ContentProvider');
  return v;
}
