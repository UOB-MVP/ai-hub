import { BarChart3, ClipboardCheck, Compass, GraduationCap, MessageCircleQuestion, PackagePlus, Rocket, ShieldCheck, type LucideIcon } from 'lucide-react';
import type { Persona } from '@/core/types';

export interface NavItem { to: string; label: string; icon: LucideIcon; visible?: (p: Persona) => boolean }

/** Single source for navigation. The "AI Hub" brand mark in the header already links home, so no separate Home item. `visible` hides items per persona capability. */
export const NAV: NavItem[] = [
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/use', label: 'Use', icon: Rocket },
  { to: '/learn', label: 'Learn', icon: GraduationCap },
  { to: '/ask', label: 'Ask Me Anything', icon: MessageCircleQuestion },
  { to: '/my-usage', label: 'My Usage', icon: BarChart3 },
  { to: '/my-apps', label: 'My Apps', icon: PackagePlus, visible: (p) => p.can.manageOwnApps },
  { to: '/learn?view=review', label: 'Review queue', icon: ClipboardCheck, visible: (p) => p.can.moderateLearning },
  { to: '/admin', label: 'Admin', icon: ShieldCheck, visible: (p) => p.can.administerPlatform },
];
