import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Persona, PersonaId, User } from './types';
import { DEFAULT_PERSONA, getPersona } from './personas';
import { CURRENT_USER } from '@/data/users';

interface PersonaState {
  persona: Persona;
  user: User;
  isAuthenticated: boolean;
  signIn: (id: PersonaId) => void;
  signOut: () => void;
}

const Ctx = createContext<PersonaState | null>(null);
const KEY = 'uob-ai-hub:session';

const read = (): PersonaId | null => {
  try { return (sessionStorage.getItem(KEY) as PersonaId) || null; } catch { return null; }
};

/**
 * Demo session. In production replace signIn/signOut with the SSO flow and derive
 * the persona from the user's entitlements; consumers only use `usePersona()`.
 */
export function PersonaProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<PersonaId | null>(read);
  const value = useMemo<PersonaState>(() => ({
    persona: getPersona(id ?? DEFAULT_PERSONA),
    user: CURRENT_USER,
    isAuthenticated: id !== null,
    signIn: (next) => { setId(next); try { sessionStorage.setItem(KEY, next); } catch { /* ignore */ } },
    signOut: () => { setId(null); try { sessionStorage.removeItem(KEY); } catch { /* ignore */ } },
  }), [id]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePersona() {
  const v = useContext(Ctx);
  if (!v) throw new Error('usePersona must be used inside PersonaProvider');
  return v;
}
