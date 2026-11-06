import { Link } from 'react-router-dom';
import { ArrowRight, Award, CheckCircle2, Clock, Flame, Target } from 'lucide-react';
import { SectionHeader } from '@/components/ui';
import { AppIcon } from '@/components/ui/AppIcon';
import { MY_LEARNING, MY_LEARNING_SUMMARY as S } from '@/data/home';
import './home.css';

export function MyLearning() {
  const pct = Math.min(100, Math.round((S.weeklyMins / S.weeklyGoalMins) * 100));
  return (
    <section>
      <SectionHeader title="My learning" subtitle="Pick up where you left off"
        action={<Link to="/learn" className="theme-cta">Browse Learn <ArrowRight size={14} /></Link>} />
      <div className="ml-grid">
        <div className="card ml-summary">
          <div className="ml-ring" style={{ ['--p' as string]: pct }}><span><strong>{pct}%</strong>weekly goal</span></div>
          <p className="muted small">{S.weeklyMins} of {S.weeklyGoalMins} min this week</p>
          <div className="ml-pills">
            <span><Flame size={14} />{S.streakDays}-day streak</span>
            <span><Award size={14} />{S.badges} badges</span>
            <span><Target size={14} />{MY_LEARNING.filter((m) => m.kind === 'Learning path').length} in progress</span>
          </div>
        </div>
        <div className="ml-list">
          {MY_LEARNING.map((m) => (
            <Link key={m.id} to="/learn" className="card card-hover ml-item">
              <AppIcon name={m.icon} hue={m.hue} size={40} />
              <div className="grow">
                <div className="row" style={{ gap: 8 }}>
                  <h4>{m.title}</h4>
                  <span className={`badge ${m.kind === 'Completed' ? 'badge-green' : m.kind === 'Saved' ? 'badge-grey' : 'badge-blue'}`}>{m.kind}</span>
                </div>
                <div className="ml-bar"><span style={{ width: `${m.progress}%`, background: `hsl(${m.hue} 70% 45%)` }} /></div>
                <span className="muted small">
                  {m.kind === 'Completed' ? <><CheckCircle2 size={12} /> Completed</> : <>{m.lessonsDone}/{m.lessonsTotal} lessons · <Clock size={12} /> {m.minsLeft} min left</>}
                </span>
              </div>
              <ArrowRight size={16} className="muted" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
