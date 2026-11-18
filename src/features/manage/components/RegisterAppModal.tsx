import { useState } from 'react';
import { Button, Chip, Modal } from '@/components/ui';
import { APP_CATEGORIES } from '@/data/apps';
import { COUNTRIES, LANGUAGES } from '@/data/tags';
import type { AppCategory, AppHosting } from '@/core/types';
import { usePlatform } from '@/core/PlatformContext';

const NEW_BADGE_OPTIONS = [{ label: 'None', days: 0 }, { label: '7 days', days: 7 }, { label: '14 days', days: 14 }, { label: '30 days', days: 30 }];

export function RegisterAppModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const { submitApp, appTags } = usePlatform();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AppCategory>(APP_CATEGORIES[0] as AppCategory);
  const [hosting, setHosting] = useState<AppHosting>('internal');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [raiEvidence, setRaiEvidence] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [newBadgeDays, setNewBadgeDays] = useState(0);
  const valid = name.trim().length >= 3 && description.trim().length >= 20 && url.trim().length > 3;

  const toggle = (list: string[], set: (v: string[]) => void, value: string) => set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const submit = () => {
    submitApp({
      name: name.trim(), category, hosting, description: description.trim(), url: url.trim(), raiEvidence: raiEvidence.trim() || undefined,
      tags, countries, languages, newBadgeDays: newBadgeDays || undefined,
    });
    onDone();
  };

  return (
    <Modal
      title="Register a new app"
      onClose={onClose}
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button disabled={!valid} onClick={submit}>Submit for approval</Button></>}
    >
      <div className="field"><label htmlFor="n">App name</label><input id="n" value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div className="field"><label htmlFor="c">Category</label>
        <select id="c" value={category} onChange={(e) => setCategory(e.target.value as AppCategory)}>
          {APP_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="field"><label htmlFor="h">Hosting</label>
        <select id="h" value={hosting} onChange={(e) => setHosting(e.target.value as AppHosting)}>
          <option value="internal">AI Hub-hosted (opens in the same tab)</option>
          <option value="external">Externally hosted (opens in a new tab)</option>
        </select>
      </div>
      <div className="field"><label htmlFor="url">App URL</label><input id="url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" /></div>
      <div className="field"><label htmlFor="d">Description</label><textarea id="d" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /><span className="hint">Minimum 20 characters. A Platform Admin reviews every new app before it appears in Discover.</span></div>
      <div className="field"><label htmlFor="rai">Responsible AI guardrail evidence</label><textarea id="rai" rows={2} value={raiEvidence} onChange={(e) => setRaiEvidence(e.target.value)} placeholder="Reference to safety testing, model card, or review sign-off (optional at submission, required before publish)" /></div>
      <div className="field"><label>Tags</label>
        <div className="chips">{appTags.map((t) => <Chip key={t} active={tags.includes(t)} onClick={() => toggle(tags, setTags, t)}>{t}</Chip>)}</div>
      </div>
      <div className="field"><label>Countries</label>
        <div className="chips">{COUNTRIES.map((c) => <Chip key={c} active={countries.includes(c)} onClick={() => toggle(countries, setCountries, c)}>{c}</Chip>)}</div>
      </div>
      <div className="field"><label>Languages</label>
        <div className="chips">{LANGUAGES.map((l) => <Chip key={l} active={languages.includes(l)} onClick={() => toggle(languages, setLanguages, l)}>{l}</Chip>)}</div>
      </div>
      <div className="field"><label htmlFor="newbadge">"NEW" banner</label>
        <select id="newbadge" value={newBadgeDays} onChange={(e) => setNewBadgeDays(Number(e.target.value))}>
          {NEW_BADGE_OPTIONS.map((o) => <option key={o.days} value={o.days}>{o.label}</option>)}
        </select>
      </div>
    </Modal>
  );
}
