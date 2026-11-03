import { useMemo } from 'react';
import { Badge, EmptyState, PageHero, SectionHeader } from '@/components/ui';
import { AppIcon } from '@/components/ui/AppIcon';
import { usePersona } from '@/core/PersonaContext';
import { usePlatform } from '@/core/PlatformContext';
import { UsageSparkline } from '@/features/manage/components/UsageSparkline';

export function MyUsagePage() {
  const { user } = usePersona();
  const { usageForUser, requestsForUser, getApp } = usePlatform();
  const usage = usageForUser(user.id);
  const requests = requestsForUser(user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const byApp = useMemo(() => {
    const ids = Array.from(new Set(usage.map((u) => u.appId)));
    return ids.map((id) => ({ app: getApp(id), entries: usage.filter((u) => u.appId === id) })).filter((x) => x.app);
  }, [usage, getApp]);

  const totalTokens = usage.reduce((s, u) => s + u.tokens, 0);
  const totalRequests = usage.reduce((s, u) => s + u.requests, 0);

  return (
    <>
      <PageHero eyebrow="My Statistics" title="Your activity on AI Hub" description="A personal view of the apps you use, your token consumption and your access requests." />

      <section>
        <SectionHeader title="Usage summary" subtitle={`${totalTokens.toLocaleString()} tokens · ${totalRequests.toLocaleString()} requests over the last 14 days`} />
        {byApp.length ? (
          <div className="grid grid-2">
            {byApp.map(({ app, entries }) => app && (
              <div key={app.id} className="card" style={{ padding: 18 }}>
                <div className="row" style={{ gap: 10, marginBottom: 10 }}><AppIcon name={app.icon} hue={app.hue} size={32} /><strong>{app.name}</strong></div>
                <UsageSparkline entries={entries} hue={app.hue} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No usage recorded yet" message="Launch an app from Use to start building your activity history." />
        )}
      </section>

      <section>
        <SectionHeader title="Access requests" subtitle={`${requests.length} request${requests.length === 1 ? '' : 's'}`} />
        {requests.length ? (
          <div className="card" style={{ overflow: 'auto' }}>
            <table className="table">
              <thead><tr><th>App</th><th>Requested</th><th>Status</th></tr></thead>
              <tbody>
                {requests.map((r) => {
                  const app = getApp(r.appId);
                  return (
                    <tr key={r.id}>
                      <td><strong>{app?.name ?? r.appId}</strong></td>
                      <td>{r.createdAt}</td>
                      <td><Badge tone={r.status === 'approved' ? 'green' : r.status === 'rejected' ? 'red' : 'amber'}>{r.status}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No access requests yet" />
        )}
      </section>
    </>
  );
}
