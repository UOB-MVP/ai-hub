import type { User } from '@/core/types';

/**
 * Demo user directory. `CURRENT_USER` is the signed-in identity throughout the
 * illustration – switching persona changes the role lens, not the identity.
 * Real users and roles come from SSO / One Identity.
 */
export const USERS: User[] = [
  { id: 'u-me', name: 'Daniel Lim', title: 'Vice President, Group Technology', department: 'Group Technology & Operations', avatarColor: '#0B3A8D', status: 'active', lanId: 'limda01', country: 'Singapore' },
  { id: 'u-sarah', name: 'Sarah Tan', title: 'AVP, Group Human Resources', department: 'Group Human Resources', avatarColor: '#1F7A54', status: 'active', lanId: 'tansa02', country: 'Singapore' },
  { id: 'u-wei', name: 'Wei Jian Koh', title: 'Manager, Branch Banking', department: 'Branch Banking', avatarColor: '#0B5FA8', status: 'active', lanId: 'kohwe03', country: 'Malaysia' },
  { id: 'u-fatimah', name: 'Fatimah Rahman', title: 'Manager, Innovation Lab', department: 'Innovation Lab', avatarColor: '#8A3FB0', status: 'active', lanId: 'rahfa04', country: 'Indonesia' },
  { id: 'u-grace', name: 'Grace Lim', title: 'Officer, Contact Centre', department: 'Contact Centre', avatarColor: '#B0522D', status: 'active', lanId: 'limgr05', country: 'Singapore' },
  { id: 'u-ben', name: 'Ben Teo', title: 'Associate, Middle Office', department: 'Middle Office', avatarColor: '#2D7FB0', status: 'active', lanId: 'teobe06', country: 'Thailand' },
  { id: 'u-alex', name: 'Alex Cruz', title: 'Contract Staff, Back Office', department: 'Back Office', avatarColor: '#6B6F76', status: 'suspended', lanId: 'cruzal07', country: 'Vietnam' },
  { id: 'u-unassigned', name: 'Unassigned', title: '—', department: '—', avatarColor: '#9AA1AC', status: 'active', lanId: '—', country: '—' },
];

export const CURRENT_USER = USERS[0];
export const getUser = (id: string) => USERS.find((u) => u.id === id) ?? USERS[0];
export const initials = (name: string) => name.split(' ').map((p) => p[0]).slice(0, 2).join('');
