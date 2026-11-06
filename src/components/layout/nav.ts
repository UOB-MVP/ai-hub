import { AppWindow, GraduationCap, Home, LayoutDashboard, type LucideIcon } from 'lucide-react';
import type { Persona } from '@/core/types';

export interface NavItem { to: string | ((p: Persona) => string); label: string | ((p: Persona) => string); icon: LucideIcon; visible?: (p: Persona) => boolean }

/** Role-aware name for the console: what each persona manages from the same entry point. */
export const consoleLabel = (p: Persona) =>
  p.can.administerPlatform ? 'Control Centre' : p.can.moderateLearning ? 'Moderation Desk' : 'My Workspace';

/** Each role has its own console route so its code stays separate; `/console` just redirects to the right one. */
export const consoleRoute = (p: Persona) =>
  p.can.administerPlatform ? '/control-centre' : p.can.moderateLearning ? '/moderation' : '/workspace';

/** Single source for navigation. The Console entry adapts to the signed-in role (see features/console). */
export const NAV: NavItem[] = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/apps', label: 'Apps', icon: AppWindow },
  { to: '/learning', label: 'Learning', icon: GraduationCap },
  { to: consoleRoute, label: consoleLabel, icon: LayoutDashboard },
];
