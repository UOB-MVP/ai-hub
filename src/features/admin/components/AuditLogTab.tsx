import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { Button, SearchInput } from '@/components/ui';
import { useAuditLog } from '@/core/AuditLogContext';
import type { AuditAction } from '@/core/types';

const ACTIONS: AuditAction[] = [
  'login', 'app_launch', 'favourite_app_add', 'favourite_app_remove', 'favourite_learning_add', 'favourite_learning_remove',
  'access_requested', 'access_approved', 'access_rejected', 'app_onboarded', 'app_metadata_updated', 'app_archived', 'app_tag_updated',
  'learning_submitted', 'learning_approved', 'learning_rejected', 'learning_tag_updated', 'learning_archived', 'role_upgrade_requested',
];

/** Audit trail for Platform Admins – activity/session tracking and governance events (BRD 7.1/7.4/7.6). */
export function AuditLogTab() {
  const { entries, exportAuditLog } = useAuditLog();
  const [query, setQuery] = useState('');
  const [action, setAction] = useState<AuditAction | ''>('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries
      .filter((e) => !action || e.action === action)
      .filter((e) => !q || `${e.detail} ${e.lanId} ${e.appId ?? ''}`.toLowerCase().includes(q));
  }, [entries, query, action]);

  return (
    <div className="stack" style={{ gap: 16 }}>
      <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 220 }}><SearchInput value={query} onChange={setQuery} placeholder="Search by LAN ID, app or detail…" /></div>
        <select value={action} onChange={(e) => setAction(e.target.value as AuditAction | '')} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px' }}>
          <option value="">All actions</option>
          {ACTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <Button size="sm" variant="ghost" onClick={() => exportAuditLog(filtered)}><Download size={14} />Export CSV</Button>
      </div>
      <div className="card" style={{ overflow: 'auto' }}>
        <table className="table">
          <thead><tr><th>Timestamp</th><th>LAN ID</th><th>Country</th><th>Action</th><th>App</th><th>Detail</th><th>Requests</th></tr></thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id}>
                <td className="muted" style={{ fontSize: 12 }}>{new Date(e.timestamp).toLocaleString()}</td>
                <td>{e.lanId}</td>
                <td>{e.country}</td>
                <td>{e.action}</td>
                <td>{e.appId ?? '—'}</td>
                <td style={{ maxWidth: 360 }}>{e.detail}</td>
                <td>{e.requestCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && <p className="muted" style={{ fontSize: 14, padding: 16 }}>No audit events match these filters.</p>}
      </div>
    </div>
  );
}
