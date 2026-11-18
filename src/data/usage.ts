import type { UsageEntry } from '@/core/types';
import { getUser } from './users';

/**
 * ~13 months of mock per-user daily activity, used by the consumer "My Usage" view and
 * owner/admin usage charts, and aggregated by Platform Monitoring across daily/weekly/
 * monthly/yearly/custom ranges (BRD 7.3).
 */
function buildDailyUsage(appId: string, userId: string, baseTokens: number, baseRequests: number, days = 400): UsageEntry[] {
  const out: UsageEntry[] = [];
  const end = new Date('2026-11-18T00:00:00Z');
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - days);
  const country = getUser(userId).country;
  for (let i = 0; i < days; i += 1) {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + i);
    const wiggle = 0.6 + Math.abs(Math.sin(i * 1.7)) * 0.8;
    const requests = Math.max(1, Math.round(baseRequests * wiggle));
    out.push({
      appId,
      userId,
      date: d.toISOString().slice(0, 10),
      tokens: Math.round(baseTokens * wiggle),
      requests,
      country,
      sessionId: `sess-${appId}-${userId}-${i}`,
      activityType: i % 7 === 0 ? 'heavy_use' : 'normal_use',
      requestCount: requests,
    });
  }
  return out;
}

export const SEED_USAGE: UsageEntry[] = [
  ...buildDailyUsage('rcp-bot', 'u-me', 2400, 14),
  ...buildDailyUsage('doc-intel', 'u-me', 900, 6),
  ...buildDailyUsage('byob-studio', 'u-me', 650, 4),
  ...buildDailyUsage('hr-bot', 'u-sarah', 1800, 22),
  ...buildDailyUsage('hr-bot', 'u-grace', 1200, 10),
  ...buildDailyUsage('branch-bot', 'u-wei', 1500, 12),
  ...buildDailyUsage('rcp-bot', 'u-ben', 2000, 11),
];
