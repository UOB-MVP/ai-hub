import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Persona, PersonaId, User } from './types';
import { DEFAULT_PERSONA, getPersona } from './personas';
import { CURRENT_USER } from '@/data/users';
import { useAuditLog } from './AuditLogContext';

interface PersonaState {
  persona: Persona;
  user: User;
  isAuthenticated: boolean;
  signIn: (id: PersonaId) => void;
  signOut: () => void;
  /** Simulates requesting AD-group membership for a richer role (BRD 1.1) – logged for admin visibility, does not change the session. */
  requestRoleUpgrade: (id: PersonaId) => void;
}

const Ctx = createContext<PersonaState | null>(null);
const KEY = 'uob-ai-hub:session';

const read = (): PersonaId | null => {
  try { return (sessionStorage.getItem(KEY) as PersonaId) || null; } catch { return null; }
};

/**
 * Demo session. In production replace signIn/signOut with the SSO flow and derive
 * the persona from the user's entitlements; consumers only use `usePersona()`.
 * Every sign-in defaults to the "AI Hub User" role; Learning Moderator and Platform
 * Admin are granted via AD group in production (here, via the demo role picker).
 */
export function PersonaProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<PersonaId | null>(read);
  const { log } = useAuditLog();
  const value = useMemo<PersonaState>(() => ({
    persona: getPersona(id ?? DEFAULT_PERSONA),
    user: CURRENT_USER,
    isAuthenticated: id !== null,
    signIn: (next) => {
      setId(next);
      try { sessionStorage.setItem(KEY, next); } catch { /* ignore */ }
      log({ userId: CURRENT_USER.id, action: 'login', activityType: 'login', detail: `Signed in via SSO as ${getPersona(next).label}` });
    },
    signOut: () => { setId(null); try { sessionStorage.removeItem(KEY); } catch { /* ignore */ } },
    requestRoleUpgrade: (next) => {
      log({ userId: CURRENT_USER.id, action: 'role_upgrade_requested', activityType: 'governance', detail: `Requested AD group access for ${getPersona(next).label}` });
    },
  }), [id, log]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePersona() {
  const v = useContext(Ctx);
  if (!v) throw new Error('usePersona must be used inside PersonaProvider');
  return v;
}
