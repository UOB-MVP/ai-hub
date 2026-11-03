import { Badge, PageHero, SectionHeader } from '@/components/ui';
import { useContent } from '@/core/ContentContext';
import { usePlatform } from '@/core/PlatformContext';
import { PERSONAS } from '@/core/personas';

export function AdminPage() {
  const { items } = useContent();
  const { apps: APPS } = usePlatform();
  const pending = items.filter((i) => i.status === 'draft').length;
  return (
    <>
      <PageHero eyebrow="Platform Admin" title="Govern the AI Hub" description="Oversee onboarded apps, content moderation and the roles that shape the experience." />
      <section>
        <SectionHeader title="Onboarded apps" subtitle={`${APPS.length} apps on the hub · ${pending} learning items awaiting moderation`} />
        <div className="card" style={{ overflow: 'auto' }}>
          <table className="table"><thead><tr><th>App</th><th>Category</th><th>Access</th><th>Status</th></tr></thead>
            <tbody>{APPS.map((a) => <tr key={a.id}><td><strong>{a.name}</strong></td><td>{a.category}</td><td>{a.access}</td><td><Badge tone="green">{a.status}</Badge></td></tr>)}</tbody></table>
        </div>
      </section>
      <section>
        <SectionHeader title="Roles" />
        <div className="card" style={{ overflow: 'auto' }}>
          <table className="table"><thead><tr><th>Role</th><th>Purpose</th></tr></thead>
            <tbody>{PERSONAS.map((p) => <tr key={p.id}><td><strong>{p.label}</strong></td><td className="muted">{p.tagline}</td></tr>)}</tbody></table>
        </div>
      </section>
    </>
  );
}
