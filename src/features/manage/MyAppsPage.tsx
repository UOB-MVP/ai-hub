import { useState } from 'react';
import { PackagePlus } from 'lucide-react';
import { Badge, Button, EmptyState, PageHero, SectionHeader } from '@/components/ui';
import { AppIcon } from '@/components/ui/AppIcon';
import { statusTone } from '@/components/apps/AppCard';
import { usePersona } from '@/core/PersonaContext';
import { usePlatform } from '@/core/PlatformContext';
import type { AiApp } from '@/core/types';
import { AppOwnerModal } from './components/AppOwnerModal';
import { RegisterAppModal } from './components/RegisterAppModal';

const lifecycleTone = (l: AiApp['lifecycle']) => (l === 'published' ? 'green' : l === 'retired' ? 'grey' : 'amber');
const healthTone = (h: AiApp['health']) => (h === 'healthy' ? 'green' : h === 'degraded' ? 'amber' : 'red');

/** Owner view: apps owned by the signed-in user. */
export function MyAppsPage() {
  const { user } = usePersona();
  const { apps } = usePlatform();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const mine = apps.filter((a) => a.ownerId === user.id);
  const selected = selectedId ? apps.find((a) => a.id === selectedId) ?? null : null;

  return (
    <>
      <PageHero eyebrow="App Owner" title="Manage your AI apps" description="Keep track of the apps you own, and register new apps for publishing on the hub.">
        <div style={{ marginTop: 20 }}><Button variant="light" onClick={() => setOpen(true)}><PackagePlus size={16} />Register new app</Button></div>
      </PageHero>

      <section>
        <SectionHeader title="Your portfolio" subtitle={`${mine.length} app${mine.length === 1 ? '' : 's'}`} />
        <div className="card" style={{ overflow: 'auto' }}>
          <table className="table">
            <thead><tr><th>App</th><th>Lifecycle</th><th>Status</th><th>Health</th><th>Access</th><th /></tr></thead>
            <tbody>
              {mine.map((a) => (
                <tr key={a.id}>
                  <td><div className="row" style={{ gap: 10 }}><AppIcon name={a.icon} hue={a.hue} size={34} /><strong>{a.name}</strong></div></td>
                  <td><Badge tone={lifecycleTone(a.lifecycle)}>{a.lifecycle}</Badge></td>
                  <td><Badge tone={statusTone(a.status)}>{a.status}</Badge></td>
                  <td><Badge tone={healthTone(a.health)}>{a.health}</Badge></td>
                  <td>{a.access}</td>
                  <td><Button size="sm" variant="ghost" onClick={() => setSelectedId(a.id)}>Manage</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!mine.length && <EmptyState title="No apps yet" message="Register your first app to begin onboarding." />}
        </div>
      </section>

      {open && <RegisterAppModal onClose={() => setOpen(false)} onDone={() => setOpen(false)} />}
      {selected && <AppOwnerModal key={selected.id} app={selected} onClose={() => setSelectedId(null)} />}
    </>
  );
}
