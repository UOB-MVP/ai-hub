import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { AccessReportRow, AuditAction, AuditLogEntry } from './types';
import { SEED_AUDIT_LOG } from '@/data/auditLog';
import { getUser, USERS } from '@/data/users';
import { downloadCsv } from './csv';

export type DurationPreset = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

/** Resolves a duration preset (relative to `now`) to an inclusive [from, to] ISO date pair. */
export function resolveRange(preset: DurationPreset, now: Date, custom?: { from: string; to: string }): { from: string; to: string } {
  if (preset === 'custom' && custom) return custom;
  const to = now.toISOString().slice(0, 10);
  const from = new Date(now);
  if (preset === 'daily') from.setUTCDate(from.getUTCDate() - 1);
  else if (preset === 'weekly') from.setUTCDate(from.getUTCDate() - 7);
  else if (preset === 'monthly') from.setUTCMonth(from.getUTCMonth() - 1);
  else from.setUTCFullYear(from.getUTCFullYear() - 1);
  return { from: from.toISOString().slice(0, 10), to };
}

const KEY = 'uob-ai-hub:audit-log';

function loadPersisted(): AuditLogEntry[] {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuditLogEntry[]) : [];
  } catch { return []; }
}

interface AuditLogState {
  entries: AuditLogEntry[];
  log: (e: { userId: string; action: AuditAction; activityType: AuditLogEntry['activityType']; detail: string; appId?: string; requestCount?: number }) => void;
  entriesInRange: (from: string, to: string) => AuditLogEntry[];
  favouriteEvents: () => AuditLogEntry[];
  accessReport: () => AccessReportRow[];
  exportActivity: (from: string, to: string) => void;
  exportAccessReport: () => void;
  exportAuditLog: (entries: AuditLogEntry[]) => void;
}

const Ctx = createContext<AuditLogState | null>(null);

/**
 * Centralised event log backing Platform Monitoring (BRD 7.1-7.6): activity/session
 * tracking, favourite-toggle visibility, and exportable access/activity reports.
 * Persisted to sessionStorage so the demo trail survives a refresh.
 */
export function AuditLogProvider({ children }: { children: ReactNode }) {
  const [runtime, setRuntime] = useState<AuditLogEntry[]>(loadPersisted);

  const log = useCallback<AuditLogState['log']>(({ userId, action, activityType, detail, appId, requestCount = 1 }) => {
    const user = getUser(userId);
    const next: AuditLogEntry = {
      id: `al-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      userId, action, activityType, detail, appId, requestCount,
      lanId: user.lanId, country: user.country,
      sessionId: `sess-${userId}-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setRuntime((prev) => {
      const out = [next, ...prev].slice(0, 500);
      try { sessionStorage.setItem(KEY, JSON.stringify(out)); } catch { /* storage unavailable */ }
      return out;
    });
  }, []);

  const entries = useMemo(() => [...runtime, ...SEED_AUDIT_LOG].sort((a, b) => b.timestamp.localeCompare(a.timestamp)), [runtime]);

  const entriesInRange = useCallback((from: string, to: string) => (
    entries.filter((e) => { const d = e.timestamp.slice(0, 10); return d >= from && d <= to; })
  ), [entries]);

  const favouriteEvents = useCallback(() => (
    entries.filter((e) => e.action === 'favourite_app_add' || e.action === 'favourite_app_remove' || e.action === 'favourite_learning_add' || e.action === 'favourite_learning_remove')
  ), [entries]);

  const accessReport = useCallback((): AccessReportRow[] => {
    const today = new Date().toISOString().slice(0, 10);
    return USERS.filter((u) => u.id !== 'u-unassigned').map((u) => ({
      lanId: u.lanId,
      country: u.country,
      appId: '-',
      appName: 'AI Hub (platform access)',
      role: u.status === 'active' ? 'AI Hub User' : u.status,
      domain: u.department,
      subDomain: u.title,
      remarks: u.status === 'active' ? 'In good standing' : `Account ${u.status}`,
      isActive: u.status === 'active',
      date: today,
    }));
  }, []);

  const exportActivity = useCallback((from: string, to: string) => {
    const rows = entriesInRange(from, to).map((e) => ({
      lan_id: e.lanId, country: e.country, app_id: e.appId ?? '-', date: e.timestamp.slice(0, 10),
      session_id: e.sessionId, activity_type: e.activityType, request_count: e.requestCount, detail: e.detail,
    }));
    downloadCsv(`ai-hub-activity-${from}_to_${to}.csv`, rows);
  }, [entriesInRange]);

  const exportAccessReport = useCallback(() => {
    const rows = accessReport().map((r) => ({
      lan_id: r.lanId, country: r.country, app_id: r.appId, app_name: r.appName, role: r.role,
      domain: r.domain, sub_domain: r.subDomain, remarks: r.remarks, is_active: r.isActive, date: r.date,
    }));
    downloadCsv(`ai-hub-weekly-access-report-${new Date().toISOString().slice(0, 10)}.csv`, rows);
  }, [accessReport]);

  const exportAuditLog = useCallback((list: AuditLogEntry[]) => {
    const rows = list.map((e) => ({
      timestamp: e.timestamp, lan_id: e.lanId, country: e.country, action: e.action, activity_type: e.activityType,
      app_id: e.appId ?? '-', request_count: e.requestCount, detail: e.detail,
    }));
    downloadCsv(`ai-hub-audit-log-${new Date().toISOString().slice(0, 10)}.csv`, rows);
  }, []);

  const value = useMemo<AuditLogState>(() => ({
    entries, log, entriesInRange, favouriteEvents, accessReport, exportActivity, exportAccessReport, exportAuditLog,
  }), [entries, log, entriesInRange, favouriteEvents, accessReport, exportActivity, exportAccessReport, exportAuditLog]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuditLog() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuditLog must be used inside AuditLogProvider');
  return v;
}
