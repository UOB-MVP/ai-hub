import { useState } from 'react';
import { AlertTriangle, Check, Clock, Heart, Lightbulb, MessageSquareText, Newspaper, Presentation, Share2, Star, type LucideIcon } from 'lucide-react';
import { Avatar, Badge, Button } from '@/components/ui';
import type { ContentStatus, ContentType, LearningContent } from '@/core/types';
import { getUser } from '@/data/users';
import { useContent } from '@/core/ContentContext';
import './learn.css';

export const TYPE_META: Record<ContentType, { label: string; icon: LucideIcon; hue: number }> = {
  tip: { label: 'Tip', icon: Lightbulb, hue: 38 },
  prompt: { label: 'Prompt', icon: MessageSquareText, hue: 215 },
  news: { label: 'News', icon: Newspaper, hue: 160 },
  showcase: { label: 'Showcase', icon: Presentation, hue: 335 },
};
export const STATUS_TONE: Record<ContentStatus, 'grey' | 'amber' | 'green' | 'red'> = { draft: 'grey', submitted: 'amber', published: 'green', rejected: 'red' };
export const STATUS_LABEL: Record<ContentStatus, string> = { draft: 'Draft', submitted: 'Submitted · in review', published: 'Approved', rejected: 'Rejected' };

export function ContentCard({ item, showStatus = false, actions }: { item: LearningContent; showStatus?: boolean; actions?: React.ReactNode }) {
  const { toggleLike, commentsFor, addComment } = useContent();
  const meta = TYPE_META[item.type];
  const Icon = meta.icon;
  const author = getUser(item.authorId);
  const comments = commentsFor(item.id);
  const rated = comments.filter((c) => c.rating);
  const avgRating = rated.length ? rated.reduce((s, c) => s + (c.rating ?? 0), 0) / rated.length : 0;

  const [open, setOpen] = useState(false);
  const [draftRating, setDraftRating] = useState(0);
  const [draftBody, setDraftBody] = useState('');
  const [shared, setShared] = useState(false);

  const submitComment = () => {
    if (!draftBody.trim()) return;
    addComment(item.id, draftBody.trim(), draftRating || undefined);
    setDraftBody('');
    setDraftRating(0);
  };

  const share = async () => {
    const url = `${window.location.origin}/learning/all#${item.id}`;
    try { await navigator.clipboard.writeText(url); } catch { /* clipboard unavailable */ }
    setShared(true);
    setTimeout(() => setShared(false), 1500);
  };

  return (
    <article className="card card-hover content-card">
      <div className="row" style={{ gap: 10 }}>
        <span className="type-pill" style={{ background: `hsl(${meta.hue} 85% 93%)`, color: `hsl(${meta.hue} 70% 30%)` }}><Icon size={14} />{meta.label}</span>
        <Badge tone="grey">{item.category}</Badge>
        <span className="grow" />
        {showStatus && <Badge tone={STATUS_TONE[item.status]}>{STATUS_LABEL[item.status]}</Badge>}
      </div>
      <h3>{item.title}</h3>
      <p className="muted">{item.summary}</p>
      {item.status === 'rejected' && item.rejectionReason && (
        <p className="reject-note"><strong>Moderator feedback:</strong> {item.rejectionReason}</p>
      )}
      {showStatus && item.flagged && (
        <p className="flag-note"><AlertTriangle size={14} /><strong>Flagged for review:</strong> {item.flagReason}</p>
      )}
      {actions}
      <div className="content-foot">
        <div className="row" style={{ gap: 8 }}>
          <Avatar name={author.name} color={author.avatarColor} size={26} />
          <span className="author">{author.name}</span>
        </div>
        <span className="grow" />
        <span className="stat"><Clock size={14} />{item.readMins} min</span>
        {avgRating > 0 && <span className="stat"><Star size={13} fill="currentColor" />{avgRating.toFixed(1)}</span>}
        {item.status === 'published' && (
          <button type="button" className="like" onClick={share} aria-label="Share">
            {shared ? <Check size={14} /> : <Share2 size={14} />}{shared ? 'Copied' : 'Share'}
          </button>
        )}
        <button className={`like ${item.likedByMe ? 'on' : ''}`} onClick={() => toggleLike(item.id)} disabled={item.status !== 'published'} aria-pressed={!!item.likedByMe} aria-label="Like">
          <Heart size={15} fill={item.likedByMe ? 'currentColor' : 'none'} />{item.likes}
        </button>
      </div>

      {item.status === 'published' && (
        <div className="comments">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen((o) => !o)} style={{ alignSelf: 'flex-start' }}>
            {open ? 'Hide comments' : `Comments (${comments.length})`}
          </button>
          {open && (
            <div className="stack" style={{ gap: 12, marginTop: 10 }}>
              <div className="stack" style={{ gap: 6 }}>
                <div className="row" style={{ gap: 2 }} role="radiogroup" aria-label="Your rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" className="icon-btn" aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`} aria-pressed={draftRating >= n} onClick={() => setDraftRating(n)} style={{ color: draftRating >= n ? '#d99a00' : undefined }}>
                      <Star size={16} fill={draftRating >= n ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
                <textarea rows={2} placeholder="Add a comment" value={draftBody} onChange={(e) => setDraftBody(e.target.value)} />
                <Button size="sm" disabled={!draftBody.trim()} onClick={submitComment} style={{ alignSelf: 'flex-start' }}>Post comment</Button>
              </div>
              {comments.length ? (
                <div className="stack" style={{ gap: 10 }}>
                  {comments.map((c) => {
                    const commenter = getUser(c.userId);
                    return (
                      <div key={c.id} className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
                        <Avatar name={commenter.name} color={commenter.avatarColor} size={24} />
                        <div className="grow">
                          <div className="row" style={{ gap: 6 }}>
                            <strong style={{ fontSize: 13 }}>{commenter.name}</strong>
                            {!!c.rating && <span className="row" style={{ gap: 1 }}>{Array.from({ length: c.rating }).map((_, i) => <Star key={i} size={11} fill="currentColor" style={{ color: '#d99a00' }} />)}</span>}
                          </div>
                          <p className="muted" style={{ fontSize: 13, marginTop: 2 }}>{c.body}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="muted" style={{ fontSize: 13 }}>No comments yet.</p>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
