import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Compass, Eye, EyeOff, KeyRound, Lock, Rocket, ShieldCheck, UserCog } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { usePersona } from '@/core/PersonaContext';
import { DEFAULT_PERSONA, PERSONAS, getPersona } from '@/core/personas';
import type { PersonaId } from '@/core/types';
import './login.css';

const PILLARS = [
  { icon: Compass, title: 'Discover', text: 'Every approved AI app and learning resource across the bank.' },
  { icon: Rocket, title: 'Use', text: 'Launch the tools you have access to in one click.' },
  { icon: BookOpen, title: 'Learn', text: 'Tips, prompts and real use cases from your colleagues.' },
];

export function LoginPage() {
  const { isAuthenticated, signIn } = usePersona();
  const nav = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/home';
  const [role, setRole] = useState<PersonaId>(DEFAULT_PERSONA);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const selected = getPersona(role);

  if (isAuthenticated && !busy) return <Navigate to="/home" replace />;

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    setBusy(true);
    // Simulated authentication latency
    setTimeout(() => { signIn(role); nav(from, { replace: true }); }, 700);
  };

  return (
    <div className="login">
      <section className="login-brand">
        <Logo reversed height={46} />
        <div className="login-copy">
          <span className="login-eyebrow">UOB AI Hub</span>
          <h1>One place for AI at UOB.</h1>
          <p>Discover trusted AI applications, put them to work and grow your AI skills — safely, responsibly and together.</p>
          <ul className="pillars">
            {PILLARS.map((p) => (
              <li key={p.title}><span><p.icon size={20} /></span><div><strong>{p.title}</strong><small>{p.text}</small></div></li>
            ))}
          </ul>
        </div>
        <div className="login-trust"><ShieldCheck size={16} /> Bank-approved, governed AI. Your data stays within UOB.</div>
        <span className="login-orb a" /><span className="login-orb b" />
      </section>

      <section className="login-panel">
        <form className="login-card" onSubmit={submit}>
          <div className="login-card-logo"><Logo height={34} /></div>
          <h2>Welcome back</h2>
          <p className="muted">Sign in with your UOB credentials to continue.</p>

          <div className="field">
            <label htmlFor="l-user">Staff email</label>
            <input id="l-user" type="email" defaultValue="daniel.lim@uobgroup.com" autoComplete="username" required />
          </div>
          <div className="field">
            <label htmlFor="l-pass">Password</label>
            <div className="pw">
              <input id="l-pass" type={show ? 'text' : 'password'} defaultValue="demo-password" autoComplete="current-password" required />
              <button type="button" className="icon-btn" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
          </div>

          <div className="field">
            <label htmlFor="l-role"><UserCog size={14} /> Sign in as</label>
            <select id="l-role" value={role} onChange={(e) => setRole(e.target.value as PersonaId)}>
              {PERSONAS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
            <div className="role-note" aria-live="polite"><strong>{selected.tagline}</strong><span>{selected.description}</span></div>
          </div>

          <button className="btn btn-accent login-submit" type="submit" disabled={busy}>
            {busy ? <><span className="spinner" />Signing in…</> : <>Sign in <ArrowRight size={17} /></>}
          </button>
          <div className="or"><span>or</span></div>
          <button type="button" className="btn btn-ghost login-submit" onClick={() => submit()} disabled={busy}><KeyRound size={17} />Continue with UOB SSO</button>

          <p className="login-foot"><Lock size={13} /> Demo environment – role selection is for preview only. In production your role is assigned from your entitlements.</p>
        </form>
        <p className="login-legal">© {new Date().getFullYear()} United Overseas Bank Limited. Authorised users only.</p>
      </section>
    </div>
  );
}
