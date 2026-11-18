import { useMemo, useState } from 'react';
import { Activity, Coins, Download, PackageSearch, Users } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { AppIcon } from '@/components/ui/AppIcon';
import { usePlatform } from '@/core/PlatformContext';
import { resolveRange, useAuditLog, type DurationPreset } from '@/core/AuditLogContext';
import type { AppHealth, AppLifecycle, UserStatus } from '@/core/types';
import './admin.css';

const healthTone = (h: AppHealth) => (h === 'healthy' ? 'green' : h === 'degraded' ? 'amber' : 'red');
const lifecycleTone = (l: AppLifecycle) => (l === 'published' ? 'green' : l === 'retired' ? 'grey' : 'amber');
const userTone = (s: UserStatus) => (s === 'active' ? 'green' : s === 'suspended' ? 'amber' : 'red');

const DURATIONS: { id: DurationPreset; label: string }[] = [
  { id: 'daily', label: 'Daily' }, { id: 'weekly', label: 'Weekly' }, { id: 'monthly', label: 'Monthly' },
  { id: 'yearly', label: 'Yearly' }, { id: 'custom', label: 'Custom' },
];

function countBy<T extends string>(values: T[]): Record<string, number> {
  return values.reduce((acc, v) => ({ ...acc, [v]: (acc[v] ?? 0) + 1 }), {} as Record<string, number>);
}

export function MonitoringTab() {
  const { apps, users, usageForApp } = usePlatform();
  const { favouriteEvents, accessReport, exportAccessReport } = useAuditLog();
  const [preset, setPreset] = useState<DurationPreset>('weekly');
  const [customFrom, setCustomFrom] = useState('2026-10-01');
  const [customTo, setCustomTo] = useState('2026-11-18');

  const byLifecycle = countBy(apps.map((a) => a.lifecycle));
  const byHealth = countBy(apps.map((a) => a.health));
  const byUserStatus = countBy(users.filter((u) => u.id !== 'u-unassigned').map((u) => u.status));
  const totalTokens = apps.reduce((s, a) => s + a.tokenUsage30d, 0);
  const totalRequests = apps.reduce((s, a) => s + a.requests30d, 0);

  const { from, to } = resolveRange(preset, new Date('2026-11-18T00:00:00Z'), { from: customFrom, to: customTo });

  const usageInRange = useMemo(() => (
    apps.flatMap((a) => usageForApp(a.id)).filter((u) => u.date >= from && u.date <= to)
  ), [apps, usageForApp, from, to]);

  const rangeTokens = usageInRange.reduce((s, u) => s + u.tokens, 0);
  const rangeRequests = usageInRange.reduce((s, u) => s + u.requestCount, 0);

  const byApp = useMemo(() => {
    const map = new Map<string, { tokens: number; requests: number }>();
    for (const u of usageInRange) {
      const cur = map.get(u.appId) ?? { tokens: 0, requests: 0 };
      cur.tokens += u.tokens; cur.requests += u.requestCount;
      map.set(u.appId, cur);
    }
    return [...map.entries()].map(([appId, v]) => ({ appId, ...v })).sort((a, b) => b.tokens - a.tokens);
  }, [usageInRange]);

  const favourites = favouriteEvents();
  const access = accessReport();

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

      <div>
        <h3 style={{ marginBottom: 10 }}>User consumption</h3>
        <div className="row" style={{ gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          {DURATIONS.map((d) => (
            <button key={d.id} type="button" className="chip" aria-pressed={preset === d.id} onClick={() => setPreset(d.id)}>{d.label}</button>
          ))}
          {preset === 'custom' && (
            <div className="row" style={{ gap: 8 }}>
              <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
              <span className="muted">to</span>
              <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
            </div>
          )}
          <span className="muted" style={{ fontSize: 13 }}>{from} – {to}</span>
        </div>
        <div className="admin-kpi-grid" style={{ marginBottom: 14 }}>
          <div className="card admin-kpi">
            <span className="admin-kpi-label">Tokens in range</span>
            <span className="admin-kpi-value">{rangeTokens.toLocaleString()}</span>
          </div>
          <div className="card admin-kpi">
            <span className="admin-kpi-label">Requests in range</span>
            <span className="admin-kpi-value">{rangeRequests.toLocaleString()}</span>
          </div>
        </div>
        <div className="card" style={{ overflow: 'auto' }}>
          <table className="table">
            <thead><tr><th>App</th><th>Tokens</th><th>Requests</th></tr></thead>
            <tbody>
              {byApp.map((row) => {
                const app = apps.find((a) => a.id === row.appId);
                return (
                  <tr key={row.appId}>
                    <td>{app?.name ?? row.appId}</td>
                    <td>{row.tokens.toLocaleString()}</td>
                    <td>{row.requests.toLocaleString()}</td>
                  </tr>
                );
              })}
              {!byApp.length && <tr><td colSpan={3} className="muted" style={{ padding: 14 }}>No usage recorded in this range.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: 10 }}>Favourite activity</h3>
        <div className="card" style={{ overflow: 'auto' }}>
          <table className="table">
            <thead><tr><th>LAN ID</th><th>Country</th><th>App</th><th>Action</th><th>When</th></tr></thead>
            <tbody>
              {favourites.map((e) => (
                <tr key={e.id}>
                  <td>{e.lanId}</td>
                  <td>{e.country}</td>
                  <td>{e.appId ?? '—'}</td>
                  <td>{e.action.replace(/_/g, ' ')}</td>
                  <td className="muted" style={{ fontSize: 12 }}>{new Date(e.timestamp).toLocaleString()}</td>
                </tr>
              ))}
              {!favourites.length && <tr><td colSpan={5} className="muted" style={{ padding: 14 }}>No favourite activity recorded yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
          <h3>Weekly access report</h3>
          <Button size="sm" variant="ghost" onClick={exportAccessReport}><Download size={14} />Export CSV</Button>
        </div>
        <div className="card" style={{ overflow: 'auto' }}>
          <table className="table">
            <thead><tr><th>LAN ID</th><th>Country</th><th>Role</th><th>Domain</th><th>Sub-domain</th><th>Remarks</th><th>Active</th></tr></thead>
            <tbody>
              {access.map((r) => (
                <tr key={r.lanId}>
                  <td>{r.lanId}</td>
                  <td>{r.country}</td>
                  <td>{r.role}</td>
                  <td>{r.domain}</td>
                  <td>{r.subDomain}</td>
                  <td>{r.remarks}</td>
                  <td><Badge tone={r.isActive ? 'green' : 'red'}>{r.isActive ? 'Active' : 'Inactive'}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
