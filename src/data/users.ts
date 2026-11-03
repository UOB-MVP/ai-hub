import type { User } from '@/core/types';

const colors = ['#0B3A8D', '#C8102E', '#0F766E', '#7C3AED', '#B45309', '#0369A1', '#BE185D', '#4D7C0F'];

export const USERS: User[] = [
  { id: 'u-me', name: 'Daniel Lim', title: 'Vice President, Group Technology', department: 'Group Technology & Operations', avatarColor: colors[0] },
  { id: 'u-1', name: 'Priya Nair', title: 'Senior Manager, Credit Risk', department: 'Group Risk Management', avatarColor: colors[1] },
  { id: 'u-2', name: 'Wei Jie Tan', title: 'Lead Engineer', department: 'Group Technology & Operations', avatarColor: colors[2] },
  { id: 'u-3', name: 'Siti Rahman', title: 'Relationship Manager', department: 'Personal Financial Services', avatarColor: colors[3] },
  { id: 'u-4', name: 'Marcus Chua', title: 'Data Scientist', department: 'Group Data Office', avatarColor: colors[4] },
  { id: 'u-5', name: 'Hannah Ong', title: 'Compliance Officer', department: 'Group Compliance', avatarColor: colors[5] },
  { id: 'u-6', name: 'Arjun Mehta', title: 'Product Owner', department: 'Wholesale Banking', avatarColor: colors[6] },
  { id: 'u-7', name: 'Grace Lee', title: 'Learning Partner', department: 'Group Human Resources', avatarColor: colors[7] },
];

export const CURRENT_USER = USERS[0];
export const getUser = (id: string) => USERS.find((u) => u.id === id) ?? USERS[0];
export const initials = (name: string) => name.split(' ').map((p) => p[0]).slice(0, 2).join('');
