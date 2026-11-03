import type { User } from '@/core/types';

/** Demo signed-in user only. Real users come from SSO. */
export const USERS: User[] = [
  { id: 'u-me', name: 'Daniel Lim', title: 'Vice President, Group Technology', department: 'Group Technology & Operations', avatarColor: '#0B3A8D' },
];

export const CURRENT_USER = USERS[0];
export const getUser = (id: string) => USERS.find((u) => u.id === id) ?? USERS[0];
export const initials = (name: string) => name.split(' ').map((p) => p[0]).slice(0, 2).join('');
