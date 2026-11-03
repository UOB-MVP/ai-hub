import { useState } from 'react';
import { Ban, Check, PackagePlus, Rocket, ShieldCheck, Trash2 } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { AppIcon } from '@/components/ui/AppIcon';
import { statusTone } from '@/components/apps/AppCard';
import { usePlatform } from '@/core/PlatformContext';
import { APP_CATEGORIES } from '@/data/apps';
import type { AiApp, AppCategory } from '@/core/types';
import { getUser } from '@/data/users';

const lifecycleTone = (l: AiApp['lifecycle']) => (l === 'published' ? 'green' : l === 'retired' ? 'grey' : 'amber');
const healthTone = (h: AiApp['health']) => (h === 'healthy' ? 'green' : h === 'degraded' ? 'amber' : 'red');
const raiTone = (r: AiApp['raiStatus']) => (r === 'approved' ? 'green' : r === 'pending' ? 'amber' : 'grey');

export function AppsTab() {
  const { apps, updateApp, publishApp, retireApp, assignOwner, toggleAppBlocked, createPlaceholder, users } = usePlatform();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AppCategory>(APP_CATEGORIES[0] as AppCategory);
  const [retiring, setRetiring] = useState<string | null>(null);
  const [retireNote, setRetireNote] = useState('');
  const [assigning, setAssigning] = useState<string | null>(null);
  const [ownerPick, setOwnerPick] = useState('');

  const onboarding = apps.filter((a) => a.lifecycle === 'onboarding');
  const assignableUsers = users.filter((u) => u.id !== 'u-unassigned');

  return (
    <div className="stack" style={{ gap: 28 }}>
      {onboarding.length > 0 && (
        <div>
          <h3 style={{ marginBottom: 10 }}>Pending onboarding ({onboarding.length})</h3>
          <div className="stack" style={{ gap: 10 }}>
            {onboarding.map((a) => (
              <div key={a.id} className="card" style={{ padding: 14 }}>
                <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
                  <AppIcon name={a.icon} hue={a.hue} size={36} />
                  <div className="grow">
                    <div className="row" style={{ gap: 8 }}><strong>{a.name}</strong><Badge tone="grey">{a.category}</Badge></div>
                    <span className="muted" style={{ fontSize: 13 }}>Owner: {getUser(a.ownerId).name} · {a.hosting === 'internal' ? 'AI Hub-hosted' : 'Externally hosted'}</span>
                  </div>
                  <Badge tone={raiTone(a.raiStatus)}><ShieldCheck size={12} />RAI: {a.raiStatus.replace('_', ' ')}</Badge>
                </div>
                {a.raiEvidence && <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>Guardrail evidence: {a.raiEvidence}</p>}
                <div className="row" style={{ gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  {a.raiStatus !== 'approved' && (
                    <Button size="sm" variant="ghost" onClick={() => updateApp(a.id, { raiStatus: 'approved' })}><ShieldCheck size={14} />Mark RAI approved</Button>
                  )}
                  {a.ownerId === 'u-unassigned' ? (
                    assigning === a.id ? (
                      <div className="row" style={{ gap: 8 }}>
                        <select value={ownerPick} onChange={(e) => setOwnerPick(e.target.value)} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '6px 10px' }}>
                          <option value="">Select owner…</option>
                          {assignableUsers.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                        <Button size="sm" disabled={!ownerPick} onClick={() => { assignOwner(a.id, ownerPick); setAssigning(null); setOwnerPick(''); }}>Assign</Button>
                        <Button size="sm" variant="ghost" onClick={() => setAssigning(null)}>Cancel</Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => setAssigning(a.id)}><PackagePlus size={14} />Assign owner</Button>
                    )
                  ) : (
                    <Button size="sm" disabled={a.raiStatus !== 'approved'} onClick={() => publishApp(a.id)}><Rocket size={14} />Publish</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
          <h3>All apps ({apps.length})</h3>
          <Button size="sm" variant="light" onClick={() => setCreating((c) => !c)}><PackagePlus size={14} />Create placeholder</Button>
        </div>
        {creating && (
          <div className="card" style={{ padding: 14, marginBottom: 14 }}>
            <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
              <input placeholder="App name" value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 1, minWidth: 180, border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px' }} />
              <select value={category} onChange={(e) => setCategory(e.target.value as AppCategory)} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px' }}>
                {APP_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <Button size="sm" disabled={name.trim().length < 3} onClick={() => { createPlaceholder(name.trim(), category); setName(''); setCreating(false); }}>Create</Button>
              <Button size="sm" variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>
            </div>
          </div>
        )}
        <div className="card" style={{ overflow: 'auto' }}>
          <table className="table">
            <thead><tr><th>App</th><th>Owner</th><th>Lifecycle</th><th>Status</th><th>Health</th><th /></tr></thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a.id}>
                  <td><div className="row" style={{ gap: 10 }}><AppIcon name={a.icon} hue={a.hue} size={30} /><strong>{a.name}</strong>{a.blocked && <Badge tone="red"><Ban size={11} />Blocked</Badge>}</div></td>
                  <td>{getUser(a.ownerId).name}</td>
                  <td><Badge tone={lifecycleTone(a.lifecycle)}>{a.lifecycle}</Badge></td>
                  <td><Badge tone={statusTone(a.status)}>{a.status}</Badge></td>
                  <td><Badge tone={healthTone(a.health)}>{a.health}</Badge></td>
                  <td>
                    <div className="row" style={{ gap: 6, justifyContent: 'flex-end' }}>
                      {a.lifecycle === 'published' && (
                        <Button size="sm" variant="ghost" onClick={() => toggleAppBlocked(a.id)}>{a.blocked ? <><Check size={14} />Unblock</> : <><Ban size={14} />Block</>}</Button>
                      )}
                      {a.lifecycle !== 'retired' && (
                        retiring === a.id ? (
                          <div className="row" style={{ gap: 6 }}>
                            <input placeholder="Retirement note" value={retireNote} onChange={(e) => setRetireNote(e.target.value)} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '4px 8px', fontSize: 13, width: 160 }} />
                            <Button size="sm" variant="accent" disabled={retireNote.trim().length < 5} onClick={() => { retireApp(a.id, retireNote.trim()); setRetiring(null); setRetireNote(''); }}>Confirm</Button>
                            <Button size="sm" variant="ghost" onClick={() => setRetiring(null)}>Cancel</Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="ghost" onClick={() => setRetiring(a.id)}><Trash2 size={14} />Retire</Button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
