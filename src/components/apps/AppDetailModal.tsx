import { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Clock, ExternalLink, Globe, Lock, Mail, Monitor, ShieldCheck, Star, ThumbsUp, Unlock, Users } from 'lucide-react';
import { Avatar, Badge, Button, Modal } from '@/components/ui';
import { AppIcon } from '@/components/ui/AppIcon';
import type { AiApp } from '@/core/types';
import { getUser } from '@/data/users';
import { usePlatform } from '@/core/PlatformContext';
import { useAppAccess } from '@/core/useAppAccess';
import { statusTone } from './AppCard';

interface Props { app: AiApp; hasAccess: boolean; requested: boolean; onClose: () => void; onLaunch: (a: AiApp) => void; onRequest: (a: AiApp) => void }

export function AppDetailModal({ app, hasAccess, requested, onClose, onLaunch, onRequest }: Props) {
  const owner = getUser(app.ownerId);
  const { feedbackForApp, addFeedback } = usePlatform();
  const { favourites, toggleFavourite, upvoted, toggleUpvote } = useAppAccess();
  const [more, setMore] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [comment, setComment] = useState('');
  const feedback = feedbackForApp(app.id);
  const isFav = favourites.includes(app.id);
  const hasUpvoted = upvoted.includes(app.id);

  const submitFeedback = () => {
    if (!myRating) return;
    addFeedback(app.id, myRating, comment.trim() || undefined);
    setMyRating(0);
    setComment('');
  };

  return (
    <Modal
      title={app.name}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          {hasAccess ? (
            <Button onClick={() => onLaunch(app)}><ExternalLink size={16} />Launch {app.name}</Button>
          ) : requested ? (
            <Button variant="ghost" disabled><Clock size={16} />Request pending</Button>
          ) : (
            <Button variant="accent" onClick={() => onRequest(app)}><Lock size={16} />Request access</Button>
          )}
        </>
      }
    >
      <div className="stack" style={{ gap: 20 }}>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <AppIcon name={app.icon} hue={app.hue} size={56} />
          <div className="grow">
            <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
              <Badge tone={statusTone(app.status)}>{app.status}</Badge><Badge>{app.category}</Badge>
              <Badge tone={hasAccess ? 'green' : 'amber'}>{hasAccess ? <><Unlock size={12} />You have access</> : <><Lock size={12} />{app.access}</>}</Badge>
              <Badge tone="grey">{app.hosting === 'internal' ? <><Monitor size={12} />AI Hub-hosted</> : <><Globe size={12} />Externally hosted</>}</Badge>
              {app.raiStatus !== 'not_required' && (
                <Badge tone={app.raiStatus === 'approved' ? 'green' : 'amber'}><ShieldCheck size={12} />RAI {app.raiStatus === 'approved' ? 'approved' : 'pending'}</Badge>
              )}
            </div>
            <p style={{ marginTop: 8, fontWeight: 600 }}>{app.tagline}</p>
          </div>
          <button className="icon-btn" aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'} aria-pressed={isFav} onClick={() => toggleFavourite(app.id)} style={{ color: isFav ? '#d99a00' : undefined }}>
            <Star size={20} fill={isFav ? 'currentColor' : 'none'} />
          </button>
        </div>
        <p className="muted">{app.description}</p>
        <div>
          <h4 style={{ marginBottom: 8 }}>What it can do</h4>
          <ul className="cap-list">{app.capabilities.map((c) => <li key={c}><CheckCircle2 size={16} />{c}</li>)}</ul>
        </div>
        <div className="detail-meta">
          <div><span>Owner</span><div className="row" style={{ gap: 8 }}><Avatar name={owner.name} color={owner.avatarColor} size={26} /><strong>{owner.name}</strong></div></div>
          <div><span>Department</span><strong>{app.department}</strong></div>
          <div><span>Support</span><div className="row" style={{ gap: 6 }}><Mail size={14} /><strong>{app.supportContact}</strong></div></div>
          <div><span>Users</span><div className="row" style={{ gap: 6 }}><Users size={14} /><strong>{app.userCount.toLocaleString()}</strong></div></div>
        </div>

        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setMore((m) => !m)} style={{ alignSelf: 'flex-start' }}>
          {more ? <ChevronUp size={14} /> : <ChevronDown size={14} />}{more ? 'Hide details' : 'More details'}
        </button>

        {more && (
          <div className="stack" style={{ gap: 16 }}>
            <div className="detail-meta">
              <div><span>Current version</span><strong>{app.version}</strong></div>
              <div><span>Release date</span><strong>{app.releaseDate}</strong></div>
              <div><span>Rating</span><div className="row" style={{ gap: 6 }}><Star size={14} fill="currentColor" /><strong>{app.ratingCount ? `${app.rating.toFixed(1)} (${app.ratingCount})` : 'No ratings yet'}</strong></div></div>
              <div><span>Upvotes</span>
                <button type="button" className={`like ${hasUpvoted ? 'on' : ''}`} onClick={() => toggleUpvote(app)} aria-pressed={hasUpvoted} aria-label="Upvote this app">
                  <ThumbsUp size={15} fill={hasUpvoted ? 'currentColor' : 'none'} />{app.upvotes}
                </button>
              </div>
            </div>
            {app.whatsNew.length > 0 && (
              <div>
                <h4 style={{ marginBottom: 8 }}>What's new</h4>
                <ul className="cap-list" style={{ gridTemplateColumns: '1fr' }}>{app.whatsNew.map((n) => <li key={n}><CheckCircle2 size={16} />{n}</li>)}</ul>
              </div>
            )}
          </div>
        )}

        <div>
          <h4 style={{ marginBottom: 8 }}>Ratings &amp; feedback</h4>
          {hasAccess ? (
            <div className="stack" style={{ gap: 8, marginBottom: 12 }}>
              <div className="row" style={{ gap: 4 }} role="radiogroup" aria-label="Your rating">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" className="icon-btn" aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`} aria-pressed={myRating >= n} onClick={() => setMyRating(n)} style={{ color: myRating >= n ? '#d99a00' : undefined }}>
                    <Star size={18} fill={myRating >= n ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
              <textarea rows={2} placeholder="Share feedback for the app owner (optional)" value={comment} onChange={(e) => setComment(e.target.value)} />
              <Button size="sm" disabled={!myRating} onClick={submitFeedback} style={{ alignSelf: 'flex-start' }}>Submit feedback</Button>
            </div>
          ) : (
            <p className="muted" style={{ fontSize: 14, marginBottom: 12 }}>Only users with access to {app.name} can submit ratings and feedback.</p>
          )}
          {feedback.length ? (
            <div className="stack" style={{ gap: 10 }}>
              {feedback.map((f) => {
                const author = getUser(f.userId);
                return (
                  <div key={f.id} className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
                    <Avatar name={author.name} color={author.avatarColor} size={26} />
                    <div className="grow">
                      <div className="row" style={{ gap: 6 }}><strong style={{ fontSize: 13 }}>{author.name}</strong><span className="row" style={{ gap: 2 }}>{Array.from({ length: f.rating }).map((_, i) => <Star key={i} size={12} fill="currentColor" style={{ color: '#d99a00' }} />)}</span></div>
                      {f.comment && <p className="muted" style={{ fontSize: 13, marginTop: 2 }}>{f.comment}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="muted" style={{ fontSize: 14 }}>No feedback yet.</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
