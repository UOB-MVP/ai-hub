import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { FileEdit, Layers, PenSquare, Send } from 'lucide-react';
import { useContent } from '@/core/ContentContext';
import { usePersona } from '@/core/PersonaContext';
import { FeaturedLearning } from './components/FeaturedLearning';
import './components/learn.css';

/**
 * Shell for /learning/*. Featured learning first, then the section bar.
 * Every section (all, draft, submission, contribute) is its own route + page under ./pages.
 */
export function LearningLayout() {
  const { items } = useContent();
  const { user } = usePersona();
  const { pathname } = useLocation();
  const published = items.filter((i) => i.status === 'published');
  const mine = items.filter((i) => i.authorId === user.id);
  const drafts = mine.filter((i) => i.status === 'draft').length;
  const submissions = mine.filter((i) => i.status !== 'draft').length;
  const contributing = pathname.startsWith('/learning/contribute');

  const tabs = [
    { to: '/learning/all', label: 'All', icon: Layers, count: published.length },
    { to: '/learning/draft', label: 'Draft', icon: FileEdit, count: drafts },
    { to: '/learning/submission', label: 'Submission', icon: Send, count: submissions },
  ];

  return (
    <>
      {!contributing && <FeaturedLearning items={published.filter((i) => i.featured)} />}
      <div className="learning-bar">
        <nav className="tabs learning-tabs" aria-label="Learning sections">
          {tabs.map(({ to, label, icon: Icon, count }) => (
            <NavLink key={to} to={to} className="tab" aria-selected={pathname === to} end>
              <Icon size={16} />{label}<span className="count">{count}</span>
            </NavLink>
          ))}
        </nav>
        <NavLink to="/learning/contribute" className="btn btn-primary btn-sm learning-contribute"><PenSquare size={15} />Contribute</NavLink>
      </div>
      <Outlet />
    </>
  );
}
