import { Chip } from '@/components/ui';
import { APP_CATEGORIES } from '@/data/apps';
import type { AppCategory, AppStatus } from '@/core/types';
import type { AppSort } from '../hooks';

const STATUSES: AppStatus[] = ['Live', 'Beta', 'Pilot'];

interface Props {
  category: AppCategory | null; onCategory: (c: AppCategory | null) => void;
  status: AppStatus | null; onStatus: (s: AppStatus | null) => void;
  sort: AppSort; onSort: (s: AppSort) => void;
  total: number;
}

export function AppFilters({ category, onCategory, status, onStatus, sort, onSort, total }: Props) {
  return (
    <div className="stack" style={{ gap: 12 }}>
      <div className="chips" role="group" aria-label="Category">
        <Chip active={!category} onClick={() => onCategory(null)}>All categories</Chip>
        {APP_CATEGORIES.map((c) => <Chip key={c} active={category === c} onClick={() => onCategory(category === c ? null : c)}>{c}</Chip>)}
      </div>
      <div className="row" style={{ flexWrap: 'wrap' }}>
        <div className="chips" role="group" aria-label="Status">
          {STATUSES.map((s) => <Chip key={s} active={status === s} onClick={() => onStatus(status === s ? null : s)}>{s}</Chip>)}
        </div>
        <span className="grow" />
        <span className="muted" style={{ fontSize: 14 }}>{total} app{total === 1 ? '' : 's'}</span>
        <label className="row" style={{ gap: 8, fontSize: 14 }}>Sort
          <select value={sort} onChange={(e) => onSort(e.target.value as AppSort)} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '6px 10px', background: 'var(--surface)' }}>
            <option value="featured">Featured first</option><option value="name">A–Z</option>
          </select>
        </label>
      </div>
    </div>
  );
}
