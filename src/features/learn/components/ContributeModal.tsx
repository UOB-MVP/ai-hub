import { useState } from 'react';
import { Button, Modal } from '@/components/ui';
import { CONTENT_TYPES, LEARN_CATEGORIES } from '@/data/learning';
import type { ContentType, LearnCategory } from '@/core/types';
import { useContent } from '@/core/ContentContext';

export function ContributeModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const { contribute } = useContent();
  const [type, setType] = useState<ContentType>('tip');
  const [category, setCategory] = useState<LearnCategory>('Getting started');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const valid = title.trim().length >= 8 && summary.trim().length >= 20;

  const submit = () => {
    contribute({ type, category, title: title.trim(), summary: summary.trim(), body: body.trim() || undefined, tags: tags.split(',').map((t) => t.trim()).filter(Boolean) });
    onDone();
  };

  return (
    <Modal
      title="Contribute to the Learning Hub"
      onClose={onClose}
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button disabled={!valid} onClick={submit}>Submit for review</Button></>}
    >
      <p className="muted" style={{ marginBottom: 16, fontSize: 14 }}>Share what works. A Learning Moderator reviews every submission before it is published. Submissions are automatically screened for sensitive data; do not include customer data or confidential information.</p>
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
