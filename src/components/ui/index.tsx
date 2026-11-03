import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Search, X } from 'lucide-react';
import { initials } from '@/data/users';
import { useEffect } from 'react';

type Variant = 'primary' | 'accent' | 'ghost' | 'light';

export function Button({ variant = 'primary', size, className = '', ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: 'sm' }) {
  return <button {...p} className={`btn btn-${variant} ${size === 'sm' ? 'btn-sm' : ''} ${className}`} />;
}

export function Badge({ tone = 'blue', children }: { tone?: 'blue' | 'green' | 'amber' | 'red' | 'grey'; children: ReactNode }) {
  return <span className={`badge ${tone === 'blue' ? '' : `badge-${tone}`}`}>{children}</span>;
}

export function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: ReactNode }) {
  return <button type="button" className="chip" aria-pressed={!!active} onClick={onClick}>{children}</button>;
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="section-head">
      <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
      {action}
    </div>
  );
}

export function PageHero({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) {
  return (
    <section className="page-hero">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </section>
  );
}

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="search">
      <span className="sr-only">Search</span>
      <Search size={18} />
      <input type="search" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function Avatar({ name, color, size = 36 }: { name: string; color: string; size?: number }) {
  return <span className="avatar" style={{ width: size, height: size, background: color, fontSize: size * 0.38 }} aria-hidden>{initials(name)}</span>;
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string; count?: number; icon?: ReactNode }[]; value: T; onChange: (id: T) => void }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button key={t.id} role="tab" className="tab" aria-selected={value === t.id} onClick={() => onChange(t.id)}>
          {t.icon}{t.label}{t.count !== undefined && <span className="count">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({ title, message }: { title: string; message?: string }) {
  return <div className="empty"><h3>{title}</h3>{message && <p>{message}</p>}</div>;
}

export function Modal({ title, onClose, children, footer }: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head"><h2>{title}</h2><button className="icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button></div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}
