import { Activity, Coins, PackageSearch, Users } from 'lucide-react';
import { Badge } from '@/components/ui';
import { AppIcon } from '@/components/ui/AppIcon';
import { usePlatform } from '@/core/PlatformContext';
import type { AppHealth, AppLifecycle, UserStatus } from '@/core/types';
import './admin.css';

const healthTone = (h: AppHealth) => (h === 'healthy' ? 'green' : h === 'degraded' ? 'amber' : 'red');
const lifecycleTone = (l: AppLifecycle) => (l === 'published' ? 'green' : l === 'retired' ? 'grey' : 'amber');
const userTone = (s: UserStatus) => (s === 'active' ? 'green' : s === 'suspended' ? 'amber' : 'red');

function countBy<T extends string>(values: T[]): Record<string, number> {
  return values.reduce((acc, v) => ({ ...acc, [v]: (acc[v] ?? 0) + 1 }), {} as Record<string, number>);
}

export function MonitoringTab() {
  const { apps, users } = usePlatform();

  const byLifecycle = countBy(apps.map((a) => a.lifecycle));
  const byHealth = countBy(apps.map((a) => a.health));
  const byUserStatus = countBy(users.filter((u) => u.id !== 'u-unassigned').map((u) => u.status));
  const totalTokens = apps.reduce((s, a) => s + a.tokenUsage30d, 0);
  const totalRequests = apps.reduce((s, a) => s + a.requests30d, 0);

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div className="admin-kpi-grid">
        <div className="card admin-kpi">
          <span className="admin-kpi-label"><PackageSearch size={14} style={{ marginRight: 4, verticalAlign: -2 }} />Apps</span>
          <span className="admin-kpi-value">{apps.length}</span>
          <div className="admin-kpi-breakdown">{Object.entries(byLifecycle).map(([k, v]) => <Badge key={k} tone={lifecycleTone(k as AppLifecycle)}>{v} {k}</Badge>)}</div>
        </div>
        <div className="card admin-kpi">
          <span className="admin-kpi-label"><Users size={14} style={{ marginRight: 4, verticalAlign: -2 }} />Users</span>
          <span className="admin-kpi-value">{users.length - 1}</span>
          <div className="admin-kpi-breakdown">{Object.entries(byUserStatus).map(([k, v]) => <Badge key={k} tone={userTone(k as UserStatus)}>{v} {k}</Badge>)}</div>
        </div>
        <div className="card admin-kpi">
          <span className="admin-kpi-label"><Coins size={14} style={{ marginRight: 4, verticalAlign: -2 }} />Tokens (30d)</span>
          <span className="admin-kpi-value">{(totalTokens / 1_000_000).toFixed(1)}M</span>
          <span className="muted" style={{ fontSize: 12 }}>{totalRequests.toLocaleString()} requests</span>
        </div>
        <div className="card admin-kpi">
          <span className="admin-kpi-label"><Activity size={14} style={{ marginRight: 4, verticalAlign: -2 }} />App health</span>
          <span className="admin-kpi-value">{byHealth.healthy ?? 0}/{apps.length} healthy</span>
          <div className="admin-kpi-breakdown">{Object.entries(byHealth).map(([k, v]) => <Badge key={k} tone={healthTone(k as AppHealth)}>{v} {k}</Badge>)}</div>
        </div>
      </div>

      <div className="card" style={{ overflow: 'auto' }}>
        <table className="table">
          <thead><tr><th>App</th><th>Lifecycle</th><th>Health</th><th>DAU</th><th>Requests (30d)</th><th>Tokens (30d)</th></tr></thead>
          <tbody>
            {apps.map((a) => (
              <tr key={a.id}>
                <td><div className="row" style={{ gap: 10 }}><AppIcon name={a.icon} hue={a.hue} size={28} /><strong>{a.name}</strong></div></td>
                <td><Badge tone={lifecycleTone(a.lifecycle)}>{a.lifecycle}</Badge></td>
                <td><Badge tone={healthTone(a.health)}>{a.health}</Badge></td>
                <td>{a.dau.toLocaleString()}</td>
                <td>{a.requests30d.toLocaleString()}</td>
                <td>{a.tokenUsage30d.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
