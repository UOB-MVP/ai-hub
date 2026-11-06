import type { UsageEntry } from '@/core/types';

/** 14 days of mock per-user activity, used by the Bank User "My Usage" view and owner/admin usage charts. */
function buildDailyUsage(appId: string, userId: string, baseTokens: number, baseRequests: number): UsageEntry[] {
  const days = 14;
  const out: UsageEntry[] = [];
  const start = new Date('2026-10-20T00:00:00Z');
  for (let i = 0; i < days; i += 1) {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + i);
    const wiggle = 0.6 + Math.abs(Math.sin(i * 1.7)) * 0.8;
    out.push({
      appId,
      userId,
      date: d.toISOString().slice(0, 10),
      tokens: Math.round(baseTokens * wiggle),
      requests: Math.max(1, Math.round(baseRequests * wiggle)),
    });
  }
  return out;
}

export const SEED_USAGE: UsageEntry[] = [
  ...buildDailyUsage('rcp-bot', 'u-me', 2400, 14),
  ...buildDailyUsage('doc-intel', 'u-me', 900, 6),
  ...buildDailyUsage('byob-studio', 'u-me', 650, 4),
];
