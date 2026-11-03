import { AppWindow, BookOpen, TrendingUp, Users } from 'lucide-react';
import { APPS } from '@/data/apps';
import { useContent } from '@/core/ContentContext';
import { compact } from '@/components/apps/AppCard';
import { KPI_SPARKS } from '../data';
import { Sparkline } from './Sparkline';
import './home.css';

export function KpiStrip() {
  const { items } = useContent();
  const published = items.filter((i) => i.status === 'published').length;
  const users = APPS.reduce((s, a) => s + a.monthlyUsers, 0);
  const kpis = [
    { label: 'AI apps on the hub', value: APPS.length, delta: '+2 this quarter', icon: AppWindow, spark: KPI_SPARKS.apps },
    { label: 'Monthly app sessions', value: compact(users), delta: '+14% vs last month', icon: Users, spark: KPI_SPARKS.users },
    { label: 'Learning resources', value: published, delta: '+6 this month', icon: BookOpen, spark: KPI_SPARKS.learning },
    { label: 'Active contributors', value: 31, delta: '+4 this month', icon: TrendingUp, spark: KPI_SPARKS.contributors },
  ];
  return (
    <section className="kpi-grid" aria-label="Platform highlights">
      {kpis.map((k) => (
        <div key={k.label} className="card kpi">
          <div className="row"><span className="kpi-icon"><k.icon size={18} /></span><span className="grow" /><Sparkline data={k.spark} /></div>
          <strong className="kpi-value">{k.value}</strong>
          <span className="kpi-label">{k.label}</span>
          <span className="kpi-delta">{k.delta}</span>
        </div>
      ))}
    </section>
  );
}
