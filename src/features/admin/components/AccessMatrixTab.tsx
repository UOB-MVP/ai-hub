import { Check, Minus } from 'lucide-react';
import { Badge } from '@/components/ui';
import { ACCESS_MATRIX, MATRIX_CATEGORIES, type MatrixRole, type MatrixValue } from '@/core/accessMatrix';

const ROLE_LABEL: Record<MatrixRole, string> = { 'platform-admin': 'Platform Admin', 'learning-moderator': 'Learning Moderator', 'ai-hub-user': 'Bank User' };
const ROLES: MatrixRole[] = ['platform-admin', 'learning-moderator', 'ai-hub-user'];

function Cell({ value }: { value: MatrixValue }) {
  if (value === 'yes') return <Check size={15} style={{ color: 'var(--uob-blue-700)' }} />;
  if (value === 'no') return <Minus size={15} className="muted" />;
  return <Badge tone="grey">{value === 'all' ? 'All' : value === 'own' ? 'Own' : 'View'}</Badge>;
}

/** Read-only reference transcribing the BRD's Access Matrix (Section 4). */
export function AccessMatrixTab() {
  return (
    <div className="stack" style={{ gap: 24 }}>
      <p className="muted" style={{ fontSize: 14 }}>Who can do what across the three AI Hub personas, as defined in the BRD. This is reference-only; actual gating lives in each feature.</p>
      {MATRIX_CATEGORIES.map((category) => (
        <div key={category}>
          <h3 style={{ marginBottom: 10 }}>{category}</h3>
          <div className="card" style={{ overflow: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Function</th>
                  {ROLES.map((r) => <th key={r}>{ROLE_LABEL[r]}</th>)}
                </tr>
              </thead>
              <tbody>
                {ACCESS_MATRIX.filter((row) => row.category === category).map((row) => (
                  <tr key={row.function}>
                    <td>{row.function}</td>
                    {ROLES.map((r) => <td key={r}><Cell value={row.values[r]} /></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
