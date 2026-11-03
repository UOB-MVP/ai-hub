import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Badge, Button, PageHero, SectionHeader } from '@/components/ui';
import { KpiStrip } from '@/features/home/components/KpiStrip';
import { UsageChart } from '@/features/home/components/UsageChart';
import { useContent } from '@/core/ContentContext';
import { PERSONAS } from '@/core/personas';

const REQUESTS = [
  { id: 'r1', app: 'PolicyPal', owner: 'Hannah Ong', category: 'Risk & Compliance', note: 'Policy Q&A assistant – pilot' },
  { id: 'r2', app: 'TreasuryBrief', owner: 'Arjun Mehta', category: 'Data & Analytics', note: 'Daily market narrative generator' },
];
const SEATS: Record<string, number> = { consumer: 18240, 'app-owner': 46, 'learning-moderator': 12, 'platform-admin': 5 };

export function AdminPage() {
  const { items } = useContent();
  const [reqs, setReqs] = useState(REQUESTS);
  const pending = items.filter((i) => i.status === 'draft').length;
  return (
    <>
      <PageHero eyebrow="Platform Admin" title="Govern the AI Hub" description="Approve app onboarding, keep an eye on content moderation and monitor adoption across UOB." />
      <KpiStrip />
      <div className="home-split">
        <section>
          <SectionHeader title="App onboarding requests" subtitle={`${reqs.length} awaiting approval`} />
          <div className="stack">
            {reqs.length === 0 && <div className="empty">All caught up.</div>}
            {reqs.map((r) => (
              <div key={r.id} className="card row" style={{ padding: 16, gap: 14, flexWrap: 'wrap' }}>
                <div className="grow"><strong>{r.app}</strong> <Badge>{r.category}</Badge><p className="muted" style={{ fontSize: 13 }}>{r.note} · requested by {r.owner}</p></div>
                <Button size="sm" onClick={() => setReqs((x) => x.filter((y) => y.id !== r.id))}><Check size={14} />Approve</Button>
                <Button size="sm" variant="ghost" onClick={() => setReqs((x) => x.filter((y) => y.id !== r.id))}><X size={14} />Decline</Button>
              </div>
            ))}
          </div>
          <div style={{ height: 28 }} />
          <SectionHeader title="Users by role" subtitle={`${pending} content items awaiting moderation`} />
          <div className="card" style={{ overflow: 'auto' }}>
            <table className="table"><thead><tr><th>Role</th><th>Capability</th><th>Users</th></tr></thead>
              <tbody>{PERSONAS.map((p) => <tr key={p.id}><td><strong>{p.label}</strong></td><td className="muted">{p.tagline}</td><td>{SEATS[p.id].toLocaleString()}</td></tr>)}</tbody></table>
          </div>
        </section>
        <UsageChart />
      </div>
    </>
  );
}
