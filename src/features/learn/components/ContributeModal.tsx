import { useState } from 'react';
import { Button, Modal } from '@/components/ui';
import { CONTENT_TYPES, LEARN_CATEGORIES } from '@/data/learning';
import type { ContentType, LearnCategory, LearningContent } from '@/core/types';
import { useContent } from '@/core/ContentContext';

interface Props {
  onClose: () => void;
  onDone: () => void;
  /** When set, edits this item instead of creating a new one. A published item is edited as a pending revision. */
  editing?: LearningContent;
}

export function ContributeModal({ onClose, onDone, editing }: Props) {
  const { contribute, editDraft, submitForReview, revisePublished, guideline } = useContent();
  const [type, setType] = useState<ContentType>(editing?.type ?? 'tip');
  const [category, setCategory] = useState<LearnCategory>(editing?.category ?? 'Getting started');
  const [title, setTitle] = useState(editing?.title ?? '');
  const [summary, setSummary] = useState(editing?.summary ?? '');
  const [body, setBody] = useState(editing?.body ?? '');
  const [tags, setTags] = useState(editing?.tags.join(', ') ?? '');
  const [preview, setPreview] = useState(false);
  const valid = title.trim().length >= 8 && summary.trim().length >= 20;

  const mode: 'create' | 'edit' | 'revise' = !editing ? 'create' : editing.status === 'published' ? 'revise' : 'edit';
  const content = () => ({ type, category, title: title.trim(), summary: summary.trim(), body: body.trim() || undefined, tags: tags.split(',').map((t) => t.trim()).filter(Boolean) });

  const saveDraft = () => { contribute(content(), true); onDone(); };
  const submitNew = () => { contribute(content(), false); onDone(); };
  const saveEdit = () => { editDraft(editing!.id, content()); onDone(); };
  const resubmitEdit = () => { editDraft(editing!.id, content()); submitForReview(editing!.id); onDone(); };
  const submitRevision = () => { revisePublished(editing!.id, content()); onDone(); };

  const footer = mode === 'create' ? (
    <><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="ghost" disabled={!valid} onClick={() => setPreview(true)}>Preview</Button><Button variant="ghost" disabled={!valid} onClick={saveDraft}>Save as draft</Button><Button disabled={!valid} onClick={submitNew}>Submit for review</Button></>
  ) : mode === 'revise' ? (
    <><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="ghost" disabled={!valid} onClick={() => setPreview(true)}>Preview</Button><Button disabled={!valid} onClick={submitRevision}>Submit update for review</Button></>
  ) : editing!.status === 'rejected' ? (
    <><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="ghost" disabled={!valid} onClick={() => setPreview(true)}>Preview</Button><Button disabled={!valid} onClick={resubmitEdit}>Edit &amp; resubmit</Button></>
  ) : (
    <><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="ghost" disabled={!valid} onClick={() => setPreview(true)}>Preview</Button><Button variant="ghost" disabled={!valid} onClick={saveEdit}>Save as draft</Button><Button disabled={!valid} onClick={resubmitEdit}>Submit for review</Button></>
  );

  const modalTitle = mode === 'revise' ? `Edit ${editing!.title} (new version)` : mode === 'edit' ? `Edit ${editing!.title}` : 'Contribute to the Learning Hub';

  if (preview) {
    return (
      <Modal title="Preview" onClose={onClose} footer={<><Button variant="ghost" onClick={() => setPreview(false)}>Back to edit</Button>{footer}</>}>
        <div className="stack" style={{ gap: 10 }}>
          <span className="muted small">This is how your contribution will look once published.</span>
          <h3>{title || 'Untitled'}</h3>
          <p className="muted">{summary}</p>
          {body && <p>{body}</p>}
          <div className="chips tags">{tags.split(',').map((t) => t.trim()).filter(Boolean).map((t) => <span key={t} className="badge badge-grey">{t}</span>)}</div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title={modalTitle} onClose={onClose} footer={footer}>
      {mode === 'revise' && <p className="muted" style={{ marginBottom: 16, fontSize: 14 }}>This creates a new pending version for Learning Moderator review. "{editing!.title}" stays published as-is until the update is approved.</p>}
      {mode === 'create' && <p className="muted" style={{ marginBottom: 16, fontSize: 14 }}>{guideline}</p>}
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
      <div className="field"><label htmlFor="c-body">{type === 'prompt' ? 'Prompt text' : 'Details'} (optional)</label><textarea id="c-body" rows={4} value={body} onChange={(e) => setBody(e.target.value)} /></div>
      <div className="field"><label htmlFor="c-tags">Tags</label><input id="c-tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="comma, separated" /></div>
    </Modal>
  );
}
