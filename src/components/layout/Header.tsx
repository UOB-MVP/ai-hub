import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Logo } from './Logo';
import { NAV } from './nav';
import { Avatar } from '@/components/ui';
import { usePersona } from '@/core/PersonaContext';

export function Header() {
  const { user, persona, signOut } = usePersona();
  const nav = useNavigate();
  const { pathname, search } = useLocation();
  return (
    <header className="site-header">
      <div className="container header-inner">
        <NavLink to="/home" className="brand" aria-label="UOB AI Hub home">
          <Logo height={34} />
          <span className="brand-divider" />
          <span className="brand-name">AI Hub</span>
        </NavLink>
        <nav className="main-nav" aria-label="Primary">
          {NAV.filter((n) => !n.visible || n.visible(persona)).map(({ to, label, icon: Icon }) => {
            const [path, q] = to.split('?');
            // Items sharing a path (Learn vs Review queue) are told apart by their query string.
            const active = q ? pathname === path && search.includes(q) : pathname === path && !(path === '/learn' && search.includes('view=review'));
            return (
              <NavLink key={to} to={to} className={`nav-link ${active ? 'active' : ''}`}><Icon size={17} />{label}</NavLink>
            );
          })}
        </nav>
        <div className="header-right">
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
