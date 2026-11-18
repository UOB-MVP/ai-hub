import { useMemo, useState } from 'react';
import { Check, Plus, Star, Trash2 } from 'lucide-react';
import { Badge, Button, Chip } from '@/components/ui';
import { useContent } from '@/core/ContentContext';
import { getUser } from '@/data/users';
import type { ContentStatus, LearningContent } from '@/core/types';

const STATUSES: ContentStatus[] = ['draft', 'submitted', 'published', 'rejected', 'archived'];
type SortKey = 'title' | 'author' | 'version' | 'status' | 'category' | 'createdAt';

export function LearningManagementTab() {
  const { items, toggleLearningFeatured, learningTags, addLearningTag, removeLearningTag, guideline, setGuideline } = useContent();
  const [status, setStatus] = useState<ContentStatus | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<1 | -1>(-1);
  const [newTag, setNewTag] = useState('');
  const [guidelineDraft, setGuidelineDraft] = useState(guideline);

  const sortValue = (i: LearningContent, key: SortKey): string | number => {
    if (key === 'author') return getUser(i.authorId).name;
    return i[key];
  };

  const rows = useMemo(() => {
    const filtered = status === 'all' ? items : items.filter((i) => i.status === status);
    return [...filtered].sort((a, b) => {
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      return (av < bv ? -1 : av > bv ? 1 : 0) * sortDir;
    });
  }, [items, status, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === 1 ? -1 : 1));
    else { setSortKey(key); setSortDir(1); }
  };

  const featured = items.filter((i) => i.featured);
  const featurable = items.filter((i) => i.status === 'published' && !i.featured);
  const archived = items.filter((i) => i.status === 'archived');
  const guidelineDirty = guidelineDraft !== guideline;

  return (
    <div className="stack" style={{ gap: 28 }}>
      <div>
        <h3 style={{ marginBottom: 10 }}>All learning artifacts ({items.length})</h3>
        <div className="chips" role="group" aria-label="Filter by status" style={{ marginBottom: 10 }}>
          <Chip active={status === 'all'} onClick={() => setStatus('all')}>All</Chip>
          {STATUSES.map((s) => <Chip key={s} active={status === s} onClick={() => setStatus(s)}>{s} ({items.filter((i) => i.status === s).length})</Chip>)}
        </div>
        <div className="card" style={{ overflow: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                {(['title', 'author', 'version', 'status', 'category', 'createdAt'] as SortKey[]).map((k) => (
                  <th key={k} style={{ cursor: 'pointer' }} onClick={() => toggleSort(k)}>{k}{sortKey === k ? (sortDir === 1 ? ' ▲' : ' ▼') : ''}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((i) => (
                <tr key={i.id}>
                  <td><strong>{i.title}</strong>{i.revisionOf && <span className="muted" style={{ fontSize: 12 }}> · revision</span>}</td>
                  <td>{getUser(i.authorId).name}</td>
                  <td>v{i.version}</td>
                  <td><Badge tone={i.status === 'published' ? 'green' : i.status === 'rejected' ? 'red' : 'grey'}>{i.status}</Badge></td>
                  <td>{i.category}</td>
                  <td className="muted" style={{ fontSize: 12 }}>{i.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && <p className="muted" style={{ fontSize: 14, padding: 16 }}>No artifacts match this filter.</p>}
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: 10 }}>Featured learning</h3>
        <div className="row" style={{ gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          {featurable.length ? featurable.map((i) => (
            <Button key={i.id} size="sm" variant="ghost" onClick={() => toggleLearningFeatured(i.id)}><Star size={14} />Feature "{i.title}"</Button>
          )) : <span className="muted" style={{ fontSize: 14 }}>No published artifacts available to feature.</span>}
        </div>
        <div className="stack" style={{ gap: 8 }}>
          {featured.map((i) => (
            <div key={i.id} className="card row" style={{ padding: 12, gap: 12 }}>
              <div className="grow"><strong>{i.title}</strong> <Badge tone="grey">{i.category}</Badge></div>
              <Button size="sm" variant="ghost" onClick={() => toggleLearningFeatured(i.id)}>Remove</Button>
            </div>
          ))}
          {!featured.length && <p className="muted" style={{ fontSize: 14 }}>No learning content is currently featured.</p>}
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: 10 }}>Predefined tag list</h3>
        <div className="chips" style={{ marginBottom: 10 }}>
          {learningTags.map((t) => (
            <span key={t} className="chip" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {t}
              <button type="button" className="icon-btn" aria-label={`Remove tag ${t}`} onClick={() => removeLearningTag(t)}><Trash2 size={12} /></button>
            </span>
          ))}
        </div>
        <div className="row" style={{ gap: 8 }}>
          <input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add a tag" style={{ flex: 1, maxWidth: 240 }} />
          <Button size="sm" variant="ghost" onClick={() => { if (newTag.trim()) { addLearningTag(newTag.trim()); setNewTag(''); } }}><Plus size={14} />Add</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: 10 }}>Publishing guideline</h3>
        <div className="field">
          <textarea rows={3} value={guidelineDraft} onChange={(e) => setGuidelineDraft(e.target.value)} />
        </div>
        <Button size="sm" disabled={!guidelineDirty} onClick={() => setGuideline(guidelineDraft)}><Check size={14} />Save guideline</Button>
      </div>

      <div>
        <h3 style={{ marginBottom: 10 }}>Archived artifacts ({archived.length})</h3>
        <div className="stack" style={{ gap: 8 }}>
          {archived.map((i) => (
            <div key={i.id} className="card" style={{ padding: 12 }}>
              <strong>{i.title}</strong> <span className="muted" style={{ fontSize: 12 }}>· by {getUser(i.authorId).name} · {i.createdAt}</span>
            </div>
          ))}
          {!archived.length && <p className="muted" style={{ fontSize: 14 }}>No archived artifacts.</p>}
        </div>
      </div>
    </div>
  );
}
