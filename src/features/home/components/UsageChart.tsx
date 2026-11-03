import { SectionHeader } from '@/components/ui';
import { USAGE_TREND } from '../data';
import './home.css';

export function UsageChart() {
  const max = Math.max(...USAGE_TREND.map((d) => d.value));
  return (
    <div className="card card-pad">
      <SectionHeader title="AI adoption" subtitle="Monthly app sessions across the bank" />
      <div className="chart" role="img" aria-label={`Monthly sessions grew from ${USAGE_TREND[0].value} to ${USAGE_TREND[USAGE_TREND.length - 1].value}`}>
        {USAGE_TREND.map((d, i) => (
          <div key={d.label} className="chart-col">
            <span className="chart-val">{(d.value / 1000).toFixed(1)}k</span>
            <div className="chart-bar" style={{ height: `${(d.value / max) * 100}%`, opacity: 0.45 + (i / USAGE_TREND.length) * 0.55 }} />
            <span className="chart-lbl">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
