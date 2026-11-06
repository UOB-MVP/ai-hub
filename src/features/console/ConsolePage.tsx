import { Navigate } from 'react-router-dom';
import { usePersona } from '@/core/PersonaContext';
import { consoleRoute } from '@/components/layout/nav';

/** Legacy `/console` entry: sends each role to its own console route. */
export function ConsoleRedirect() {
  const { persona } = usePersona();
  return <Navigate to={consoleRoute(persona)} replace />;
}
