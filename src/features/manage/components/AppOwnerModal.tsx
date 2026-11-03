import { useState } from 'react';
import { Check, Plus, Trash2, X } from 'lucide-react';
import { Avatar, Badge, Button, Modal, Tabs } from '@/components/ui';
import { statusTone } from '@/components/apps/AppCard';
import type { AiApp } from '@/core/types';
import { usePlatform } from '@/core/PlatformContext';
import { getUser } from '@/data/users';
import { UsageSparkline } from './UsageSparkline';

type Tab = 'overview' | 'access' | 'feedback' | 'usage' | 'retire';

const lifecycleTone = (l: AiApp['lifecycle']) => (l === 'published' ? 'green' : l === 'retired' ? 'grey' : 'amber');

export function AppOwnerModal({ app, onClose }: { app: AiApp; onClose: () => void }) {
  const { updateApp, requestsForApp, resolveRequest, feedbackForApp, usageForApp, retireApp } = usePlatform();
  const [tab, setTab] = useState<Tab>('overview');

  const [tagline, setTagline] = useState(app.tagline);
  const [description, setDescription] = useState(app.description);
  const [version, setVersion] = useState(app.version);
  const [releaseDate, setReleaseDate] = useState(app.releaseDate);
  const [supportContact, setSupportContact] = useState(app.supportContact);
  const [whatsNew, setWhatsNew] = useState(app.whatsNew);
  const [newNote, setNewNote] = useState('');
  const [tokenLimit, setTokenLimit] = useState(app.tokenLimitPerUser ?? 0);
  const [requestLimit, setRequestLimit] = useState(app.requestLimitPerUser ?? 0);

  const [rejecting, setRejecting] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [retireNote, setRetireNote] = useState('');

  const requests = requestsForApp(app.id);
  const feedback = feedbackForApp(app.id);
  const usage = usageForApp(app.id);

  const saveMetadata = () => {
    updateApp(app.id, { tagline, description, version, releaseDate, supportContact, whatsNew });
  };

  const saveLimits = () => {
    updateApp(app.id, { tokenLimitPerUser: tokenLimit || undefined, requestLimitPerUser: requestLimit || undefined });
  };

  return (
    <Modal title={app.name} onClose={onClose} footer={<Button variant="ghost" onClick={onClose}>Close</Button>}>
      <div className="stack" style={{ gap: 16 }}>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <Badge tone={statusTone(app.status)}>{app.status}</Badge>
          <Badge tone={lifecycleTone(app.lifecycle)}>{app.lifecycle}</Badge>
          <Badge tone={app.health === 'healthy' ? 'green' : app.health === 'degraded' ? 'amber' : 'red'}>{app.health}</Badge>
        </div>

        <Tabs
          tabs={[
            { id: 'overview' as Tab, label: 'Metadata' },
            { id: 'access' as Tab, label: 'Access & limits', count: requests.filter((r) => r.status === 'pending').length || undefined },
            { id: 'feedback' as Tab, label: 'Feedback', count: feedback.length || undefined },
            { id: 'usage' as Tab, label: 'Usage' },
            { id: 'retire' as Tab, label: 'Retire' },
          ]}
          value={tab}
          onChange={setTab}
        />

        {tab === 'overview' && (
          <div className="stack" style={{ gap: 0 }}>
            <div className="field"><label htmlFor="tagline">Tagline</label><input id="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} /></div>
            <div className="field"><label htmlFor="desc">Description</label><textarea id="desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            <div className="row" style={{ gap: 14 }}>
              <div className="field grow"><label htmlFor="version">Version</label><input id="version" value={version} onChange={(e) => setVersion(e.target.value)} /></div>
              <div className="field grow"><label htmlFor="release">Release date</label><input id="release" type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} /></div>
            </div>
            <div className="field"><label htmlFor="support">Support contact</label><input id="support" value={supportContact} onChange={(e) => setSupportContact(e.target.value)} /></div>
            <div className="field">
              <label>What's new</label>
              <div className="stack" style={{ gap: 6 }}>
                {whatsNew.map((n, i) => (
                  <div key={i} className="row" style={{ gap: 8 }}>
                    <span className="grow" style={{ fontSize: 14 }}>{n}</span>
                    <button type="button" className="icon-btn" aria-label="Remove" onClick={() => setWhatsNew((w) => w.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
                  </div>
                ))}
                <div className="row" style={{ gap: 8 }}>
                  <input value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a release note" style={{ flex: 1 }} />
                  <Button size="sm" variant="ghost" onClick={() => { if (newNote.trim()) { setWhatsNew((w) => [...w, newNote.trim()]); setNewNote(''); } }}><Plus size={14} />Add</Button>
                </div>
              </div>
            </div>
            <Button size="sm" onClick={saveMetadata} style={{ alignSelf: 'flex-start', marginTop: 6 }}><Check size={14} />Save changes</Button>
          </div>
        )}

        {tab === 'access' && (
          <div className="stack" style={{ gap: 14 }}>
            <div className="row" style={{ gap: 14 }}>
              <div className="field grow"><label htmlFor="tl">Token limit per user (per 30 days)</label><input id="tl" type="number" min={0} value={tokenLimit} onChange={(e) => setTokenLimit(Number(e.target.value))} /></div>
              <div className="field grow"><label htmlFor="rl">Request limit per user (per 30 days)</label><input id="rl" type="number" min={0} value={requestLimit} onChange={(e) => setRequestLimit(Number(e.target.value))} /></div>
            </div>
            <Button size="sm" onClick={saveLimits} style={{ alignSelf: 'flex-start' }}><Check size={14} />Save limits</Button>

            <div>
              <h4 style={{ marginBottom: 8 }}>Access requests</h4>
              {requests.length ? (
                <div className="stack" style={{ gap: 10 }}>
                  {requests.map((r) => {
                    const requester = getUser(r.userId);
                    return (
                      <div key={r.id} className="card" style={{ padding: 12 }}>
                        <div className="row" style={{ gap: 10 }}>
                          <Avatar name={requester.name} color={requester.avatarColor} size={28} />
                          <div className="grow">
                            <strong style={{ fontSize: 14 }}>{requester.name}</strong>
                            <div className="muted" style={{ fontSize: 12 }}>{requester.department} · requested {r.createdAt}</div>
                          </div>
                          <Badge tone={r.status === 'approved' ? 'green' : r.status === 'rejected' ? 'red' : 'amber'}>{r.status}</Badge>
                        </div>
                        {r.status === 'pending' && (
                          rejecting === r.id ? (
                            <div className="reject-form" style={{ marginTop: 10 }}>
                              <textarea rows={2} placeholder="Reason for declining (required)" value={reason} onChange={(e) => setReason(e.target.value)} />
                              <div className="row" style={{ justifyContent: 'flex-end' }}>
                                <Button size="sm" variant="ghost" onClick={() => { setRejecting(null); setReason(''); }}>Cancel</Button>
                                <Button size="sm" variant="accent" disabled={reason.trim().length < 5} onClick={() => { resolveRequest(r.id, 'rejected', reason.trim()); setRejecting(null); setReason(''); }}>Confirm decline</Button>
                              </div>
                            </div>
                          ) : (
                            <div className="row" style={{ gap: 8, marginTop: 10 }}>
                              <Button size="sm" onClick={() => resolveRequest(r.id, 'approved')}><Check size={14} />Approve</Button>
                              <Button size="sm" variant="ghost" onClick={() => setRejecting(r.id)}><X size={14} />Decline</Button>
                            </div>
                          )
                        )}
                        {r.status === 'rejected' && r.reason && <p className="reject-note" style={{ marginTop: 10 }}>{r.reason}</p>}
                      </div>
                    );
                  })}
                </div>
              ) : <p className="muted" style={{ fontSize: 14 }}>No access requests for this app.</p>}
            </div>
          </div>
        )}

        {tab === 'feedback' && (
          feedback.length ? (
            <div className="stack" style={{ gap: 10 }}>
              {feedback.map((f) => {
                const author = getUser(f.userId);
                return (
                  <div key={f.id} className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
                    <Avatar name={author.name} color={author.avatarColor} size={26} />
                    <div className="grow">
                      <strong style={{ fontSize: 13 }}>{author.name}</strong> <span className="muted" style={{ fontSize: 12 }}>· {f.rating}/5 · {f.createdAt}</span>
                      {f.comment && <p className="muted" style={{ fontSize: 13, marginTop: 2 }}>{f.comment}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : <p className="muted" style={{ fontSize: 14 }}>No feedback yet.</p>
        )}

        {tab === 'usage' && <UsageSparkline entries={usage} hue={app.hue} />}

        {tab === 'retire' && (
          app.lifecycle === 'retired' ? (
            <p className="muted" style={{ fontSize: 14 }}>This app has already been retired.</p>
          ) : (
            <div className="stack" style={{ gap: 10 }}>
              <p className="muted" style={{ fontSize: 14 }}>Retiring removes {app.name} from Discover and Use for all users. Required audit records are kept.</p>
              <div className="field"><label htmlFor="retire-note">Retirement note (shared with affected users)</label><textarea id="retire-note" rows={2} value={retireNote} onChange={(e) => setRetireNote(e.target.value)} /></div>
              <Button variant="accent" size="sm" disabled={retireNote.trim().length < 5} onClick={() => { retireApp(app.id, retireNote.trim()); onClose(); }} style={{ alignSelf: 'flex-start' }}>Retire {app.name}</Button>
            </div>
          )
        )}
      </div>
    </Modal>
  );
}
