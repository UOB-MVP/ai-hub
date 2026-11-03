import { Clock, Heart, Lightbulb, MessageSquareText, Newspaper, Presentation, type LucideIcon } from 'lucide-react';
import { Avatar, Badge } from '@/components/ui';
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
export const STATUS_TONE: Record<ContentStatus, 'grey' | 'green' | 'red'> = { draft: 'grey', published: 'green', rejected: 'red' };
export const STATUS_LABEL: Record<ContentStatus, string> = { draft: 'Draft · in review', published: 'Published', rejected: 'Rejected' };

export function ContentCard({ item, showStatus = false, actions }: { item: LearningContent; showStatus?: boolean; actions?: React.ReactNode }) {
  const { toggleLike } = useContent();
  const meta = TYPE_META[item.type];
  const Icon = meta.icon;
  const author = getUser(item.authorId);
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
      {actions}
      <div className="content-foot">
        <div className="row" style={{ gap: 8 }}>
          <Avatar name={author.name} color={author.avatarColor} size={26} />
          <span className="author">{author.name}</span>
        </div>
        <span className="grow" />
        <span className="stat"><Clock size={14} />{item.readMins} min</span>
        <button className={`like ${item.likedByMe ? 'on' : ''}`} onClick={() => toggleLike(item.id)} disabled={item.status !== 'published'} aria-pressed={!!item.likedByMe} aria-label="Like">
          <Heart size={15} fill={item.likedByMe ? 'currentColor' : 'none'} />{item.likes}
        </button>
      </div>
    </article>
  );
}
