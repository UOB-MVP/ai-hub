import { useState } from 'react';
import { Button, Modal } from '@/components/ui';
import { APP_CATEGORIES } from '@/data/apps';
import type { AppCategory, AppHosting } from '@/core/types';
import { usePlatform } from '@/core/PlatformContext';

export function RegisterAppModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const { submitApp } = usePlatform();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AppCategory>(APP_CATEGORIES[0] as AppCategory);
  const [hosting, setHosting] = useState<AppHosting>('internal');
  const [description, setDescription] = useState('');
  const [raiEvidence, setRaiEvidence] = useState('');
  const valid = name.trim().length >= 3 && description.trim().length >= 20;

  const submit = () => {
    submitApp({ name: name.trim(), category, hosting, description: description.trim(), raiEvidence: raiEvidence.trim() || undefined });
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
      <div className="field"><label htmlFor="d">Description</label><textarea id="d" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /><span className="hint">Minimum 20 characters. A Platform Admin reviews every new app before it appears in Discover.</span></div>
      <div className="field"><label htmlFor="rai">Responsible AI guardrail evidence</label><textarea id="rai" rows={2} value={raiEvidence} onChange={(e) => setRaiEvidence(e.target.value)} placeholder="Reference to safety testing, model card, or review sign-off (optional at submission, required before publish)" /></div>
    </Modal>
  );
}
