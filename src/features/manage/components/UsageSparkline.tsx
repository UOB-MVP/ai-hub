import type { UsageEntry } from '@/core/types';

/** Minimal single-series trend + stat tiles for a mock usage log. No chart library needed for 14 points. */
export function UsageSparkline({ entries, hue = 215 }: { entries: UsageEntry[]; hue?: number }) {
  if (!entries.length) return <p className="muted" style={{ fontSize: 14 }}>No usage recorded yet.</p>;

  const totalTokens = entries.reduce((s, e) => s + e.tokens, 0);
  const totalRequests = entries.reduce((s, e) => s + e.requests, 0);
  const max = Math.max(...entries.map((e) => e.tokens), 1);

  return (
    <div className="stack" style={{ gap: 14 }}>
      <div className="detail-meta">
        <div><span>Tokens (last {entries.length} days)</span><strong>{totalTokens.toLocaleString()}</strong></div>
        <div><span>Requests (last {entries.length} days)</span><strong>{totalRequests.toLocaleString()}</strong></div>
      </div>
      <div role="img" aria-label={`Daily token usage trend, ${entries.length} days`} style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 64 }}>
        {entries.map((e) => (
          <div
            key={e.date}
            title={`${e.date}: ${e.tokens.toLocaleString()} tokens, ${e.requests} requests`}
            style={{
              flex: 1, minWidth: 4, height: `${Math.max(6, (e.tokens / max) * 100)}%`,
              background: `hsl(${hue} 70% 45%)`, borderRadius: 3,
            }}
          />
        ))}
      </div>
    </div>
  );
}
