import { useState } from 'react';
import { PageHero, SectionHeader, Tabs } from '@/components/ui';
import { useContent } from '@/core/ContentContext';
import { usePlatform } from '@/core/PlatformContext';
import { PERSONAS } from '@/core/personas';
import { AppsTab } from './components/AppsTab';
import { UsersTab } from './components/UsersTab';
import { FeaturedTab } from './components/FeaturedTab';
import { AnnouncementsTab } from './components/AnnouncementsTab';
import { MonitoringTab } from './components/MonitoringTab';

type Tab = 'apps' | 'users' | 'featured' | 'announcements' | 'monitoring';

export function AdminPage() {
  const { items } = useContent();
  const { apps } = usePlatform();
  const pending = items.filter((i) => i.status === 'draft').length;
  const onboarding = apps.filter((a) => a.lifecycle === 'onboarding').length;
  const [tab, setTab] = useState<Tab>('apps');

  return (
    <>
      <PageHero eyebrow="Platform Admin" title="Govern the AI Hub" description="Oversee onboarded apps, users, content moderation and platform adoption." />
      <section>
        <SectionHeader title="Platform" subtitle={`${apps.length} apps · ${onboarding} awaiting onboarding review · ${pending} learning items awaiting moderation`} />
        <Tabs
          tabs={[
            { id: 'apps' as Tab, label: 'Apps', count: apps.length },
            { id: 'users' as Tab, label: 'Users' },
            { id: 'featured' as Tab, label: 'Featured' },
            { id: 'announcements' as Tab, label: 'Announcements' },
            { id: 'monitoring' as Tab, label: 'Monitoring' },
          ]}
          value={tab}
          onChange={setTab}
        />
        <div style={{ marginTop: 20 }}>
          {tab === 'apps' && <AppsTab />}
          {tab === 'users' && <UsersTab />}
          {tab === 'featured' && <FeaturedTab />}
          {tab === 'announcements' && <AnnouncementsTab />}
          {tab === 'monitoring' && <MonitoringTab />}
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
