import { Ban, Check, PauseCircle } from 'lucide-react';
import { Avatar, Badge, Button } from '@/components/ui';
import { usePlatform } from '@/core/PlatformContext';
import type { UserStatus } from '@/core/types';

const statusTone = (s: UserStatus) => (s === 'active' ? 'green' : s === 'suspended' ? 'amber' : 'red');

export function UsersTab() {
  const { users, setUserStatus } = usePlatform();

  return (
    <div className="card" style={{ overflow: 'auto' }}>
      <table className="table">
        <thead><tr><th>User</th><th>Department</th><th>Status</th><th /></tr></thead>
        <tbody>
          {users.filter((u) => u.id !== 'u-unassigned').map((u) => (
            <tr key={u.id}>
              <td><div className="row" style={{ gap: 10 }}><Avatar name={u.name} color={u.avatarColor} size={30} /><div><strong>{u.name}</strong><div className="muted" style={{ fontSize: 12 }}>{u.title}</div></div></div></td>
              <td>{u.department}</td>
              <td><Badge tone={statusTone(u.status)}>{u.status}</Badge></td>
              <td>
                <div className="row" style={{ gap: 6, justifyContent: 'flex-end' }}>
                  {u.status !== 'active' && <Button size="sm" variant="ghost" onClick={() => setUserStatus(u.id, 'active')}><Check size={14} />Activate</Button>}
                  {u.status !== 'suspended' && <Button size="sm" variant="ghost" onClick={() => setUserStatus(u.id, 'suspended')}><PauseCircle size={14} />Suspend</Button>}
                  {u.status !== 'blocked' && <Button size="sm" variant="ghost" onClick={() => setUserStatus(u.id, 'blocked')}><Ban size={14} />Block</Button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
