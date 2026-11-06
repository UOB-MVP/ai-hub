import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';
import { CONTENT_TYPES, LEARN_CATEGORIES } from '@/data/learning';
import type { ContentType, LearnCategory } from '@/core/types';
import { useContent } from '@/core/ContentContext';
import { usePersona } from '@/core/PersonaContext';

/** /learning/contribute (new) and /learning/contribute/:id (edit a draft, or fix a rejected item and resubmit). */
export function ContributePage() {
  const { id } = useParams();
  const { items, save } = useContent();
  const { user } = usePersona();
  const nav = useNavigate();
  const existing = id ? items.find((i) => i.id === id) : undefined;

  const [type, setType] = useState<ContentType>(existing?.type ?? 'tip');
  const [category, setCategory] = useState<LearnCategory>(existing?.category ?? 'Getting started');
  const [title, setTitle] = useState(existing?.title ?? '');
  const [summary, setSummary] = useState(existing?.summary ?? '');
  const [body, setBody] = useState(existing?.body ?? '');
  const [tags, setTags] = useState(existing?.tags.join(', ') ?? '');

  // Only the author may edit, and only while it is a draft or has been rejected.
  if (id && (!existing || existing.authorId !== user.id || (existing.status !== 'draft' && existing.status !== 'rejected'))) {
    return <Navigate to="/learning/submission" replace />;
  }
  const resubmitting = existing?.status === 'rejected';
  const valid = title.trim().length >= 8 && summary.trim().length >= 20;
  const payload = () => ({ type, category, title: title.trim(), summary: summary.trim(), body: body.trim() || undefined, tags: tags.split(',').map((t) => t.trim()).filter(Boolean) });

  return (
    <section className="contribute">
      <Link to={existing?.status === 'rejected' ? '/learning/submission' : '/learning/all'} className="app-row-link"><ArrowLeft size={14} />Back</Link>
      <h2>{resubmitting ? 'Edit & resubmit' : existing ? 'Edit draft' : 'Contribute to Learning'}</h2>
      <p className="muted" style={{ fontSize: 14 }}>
        Share what works. A Learning Moderator reviews every submission before it is published. Submissions are screened for sensitive data, so do not include customer data or confidential information.
      </p>
      {resubmitting && existing?.rejectionReason && <p className="reject-note"><strong>Moderator feedback:</strong> {existing.rejectionReason}</p>}
      <div className="card contribute-form">
        <div className="field"><label htmlFor="c-type">Content type</label>
          <select id="c-type" value={type} onChange={(e) => setType(e.target.value as ContentType)}>
            {CONTENT_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label} – {t.blurb}</option>)}
          </select></div>
        <div className="field"><label htmlFor="c-cat">Category</label>
          <select id="c-cat" value={category} onChange={(e) => setCategory(e.target.value as LearnCategory)}>
            {LEARN_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select></div>
        <div className="field"><label htmlFor="c-title">Title</label><input id="c-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Summarise a 40-page policy in 5 bullets" /><span className="hint">Minimum 8 characters</span></div>
        <div className="field"><label htmlFor="c-sum">Summary</label><textarea id="c-sum" rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="What will a colleague learn or be able to do?" /><span className="hint">Minimum 20 characters</span></div>
        <div className="field"><label htmlFor="c-body">{type === 'prompt' ? 'Prompt text' : 'Details'} (optional)</label><textarea id="c-body" rows={6} value={body} onChange={(e) => setBody(e.target.value)} /></div>
        <div className="field"><label htmlFor="c-tags">Tags</label><input id="c-tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="comma, separated" /></div>
        <div className="row" style={{ gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          {!resubmitting && (
            <Button variant="ghost" disabled={title.trim().length < 3} onClick={() => { save(payload(), { id: existing?.id }); nav('/learning/draft'); }}>Save as draft</Button>
          )}
          <Button disabled={!valid} onClick={() => { save(payload(), { id: existing?.id, submit: true }); nav('/learning/submission'); }}>{resubmitting ? 'Resubmit for approval' : 'Submit for approval'}</Button>
        </div>
      </div>
    </section>
  );
}
