import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';
import { BrandMark } from './Logo';
import { NAV } from './nav';
import { Avatar } from '@/components/ui';
import { usePersona } from '@/core/PersonaContext';
import { useNotifications } from '@/core/NotificationsContext';

function timeAgo(date: string) {
  const days = Math.round((Date.now() - new Date(date).getTime()) / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const nav = useNavigate();

  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="notif" ref={ref}>
      <button className="icon-btn notif-bell" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`} onClick={() => setOpen((o) => !o)}>
        <Bell size={19} />
        {unreadCount > 0 && <span className="notif-dot">{unreadCount}</span>}
      </button>
      {open && (
        <div className="notif-panel">
          <div className="notif-panel-head">
            <strong>Notifications</strong>
            {unreadCount > 0 && <button type="button" className="notif-mark-all" onClick={markAllRead}>Mark all read</button>}
          </div>
          <div className="notif-list">
            {notifications.length ? notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                className={`notif-item ${n.read ? '' : 'unread'}`}
                onClick={() => { markRead(n.id); setOpen(false); if (n.link) nav(n.link); }}
              >
                <strong>{n.title}</strong>
                <span className="muted" style={{ fontSize: 13 }}>{n.body}</span>
                <span className="notif-time">{timeAgo(n.createdAt)}</span>
              </button>
            )) : <p className="muted" style={{ padding: 16, fontSize: 14 }}>No notifications yet.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { user, persona, signOut } = usePersona();
  const nav = useNavigate();
  const { pathname } = useLocation();
  return (
    <header className="site-header">
      <div className="container header-inner">
        <NavLink to="/home" className="brand" aria-label="AI Hub home">
          <BrandMark />
        </NavLink>
        <nav className="main-nav" aria-label="Primary">
          {NAV.filter((n) => !n.visible || n.visible(persona)).map(({ to: rawTo, label, icon: Icon }) => {
            const to = typeof rawTo === 'function' ? rawTo(persona) : rawTo;
            const active = pathname === to || pathname.startsWith(`${to}/`);
            return (
              <NavLink key={to} to={to} className={`nav-link ${active ? 'active' : ''}`}><Icon size={17} />{typeof label === 'function' ? label(persona) : label}</NavLink>
            );
          })}
        </nav>
        <div className="header-right">
          <NotificationBell />
          <div className="me">
            <Avatar name={user.name} color={user.avatarColor} size={36} />
            <div className="me-text"><strong>{user.name}</strong><span>{persona.label}</span></div>
          </div>
          <button className="icon-btn" aria-label="Sign out" title="Sign out" onClick={() => { signOut(); nav('/login'); }}><LogOut size={19} /></button>
        </div>
      </div>
    </header>
  );
}
