import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { usePersona } from '@/core/PersonaContext';
import type { Persona } from '@/core/types';

/** Redirects to /login when signed out. Pass `allow` to also gate by capability. */
export function RequireAuth({ allow }: { allow?: (p: Persona) => boolean }) {
  const { isAuthenticated, persona } = usePersona();
  const loc = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: loc.pathname + loc.search }} />;
  if (allow && !allow(persona)) return <Navigate to="/home" replace />;
  return <Outlet />;
}
