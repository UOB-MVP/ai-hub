import { useState } from 'react';
import { PackagePlus } from 'lucide-react';
import { Badge, Button, EmptyState, Modal, PageHero, SectionHeader } from '@/components/ui';
import { AppIcon } from '@/components/ui/AppIcon';
import { statusTone } from '@/components/apps/AppCard';
import { usePersona } from '@/core/PersonaContext';
import { APPS, APP_CATEGORIES } from '@/data/apps';

/** Owner view: apps owned by the signed-in user. */
export function MyAppsPage() {
  const { user } = usePersona();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState<string[]>([]);
  const [name, setName] = useState('');
  const mine = APPS.filter((a) => a.ownerId === user.id);

  return (
    <>
      <PageHero eyebrow="App Owner" title="Manage your AI apps" description="Keep track of the apps you own, and register new apps for publishing on the hub.">
        <div style={{ marginTop: 20 }}><Button variant="light" onClick={() => setOpen(true)}><PackagePlus size={16} />Register new app</Button></div>
      </PageHero>

      <section>
        <SectionHeader title="Your portfolio" subtitle={`${mine.length} apps`} />
        <div className="card" style={{ overflow: 'auto' }}>
          <table className="table">
            <thead><tr><th>App</th><th>Status</th><th>Access</th><th>Department</th></tr></thead>
            <tbody>
              {mine.map((a) => (
                <tr key={a.id}>
                  <td><div className="row" style={{ gap: 10 }}><AppIcon name={a.icon} hue={a.hue} size={34} /><strong>{a.name}</strong></div></td>
                  <td><Badge tone={statusTone(a.status)}>{a.status}</Badge></td><td>{a.access}</td><td>{a.department}</td>
                </tr>
              ))}
              {submitted.map((n) => (
                <tr key={n}><td><strong>{n}</strong></td><td><Badge tone="amber">Pending approval</Badge></td><td>—</td><td>—</td></tr>
              ))}
            </tbody>
          </table>
          {!mine.length && <EmptyState title="No apps yet" />}
        </div>
      </section>

      {open && (
        <Modal title="Register a new app" onClose={() => setOpen(false)} footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button disabled={name.trim().length < 3} onClick={() => { setSubmitted((s) => [...s, name.trim()]); setName(''); setOpen(false); }}>Submit for approval</Button></>}>
          <div className="field"><label htmlFor="n">App name</label><input id="n" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="field"><label htmlFor="c">Category</label><select id="c">{APP_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div className="field"><label htmlFor="d">Description</label><textarea id="d" rows={3} /><span className="hint">A Platform Admin reviews every new app before it appears in Discover.</span></div>
        </Modal>
      )}
    </>
  );
}
