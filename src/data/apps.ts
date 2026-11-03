import type { AiApp } from '@/core/types';

/** App catalogue. Replace with an API call; keep the shape. */
export const APPS: AiApp[] = [
  {
    id: 'rcp-bot', name: 'RCP BOT', icon: 'recovery', hue: 350, featured: true,
    tagline: 'Recovery Bot',
    description: 'The Recovery Bot (RCP BOT) assists recovery teams across the bank in their day-to-day recovery work.',
    category: 'Recovery', status: 'Live', access: 'Request access', ownerId: 'u-me', department: 'Recovery',
    tags: ['Recovery', 'Bot'],
    capabilities: ['Conversational assistant for recovery teams'],
    url: '#',
  },
  {
    id: 'hr-bot', name: 'HR BOT', icon: 'users', hue: 160, featured: true,
    tagline: 'Helping employees with HR policies and information',
    description: 'The HR Bot helps employees find answers about HR policies and information quickly, without raising a ticket.',
    category: 'Employee Services', status: 'Live', access: 'All staff', ownerId: 'u-me', department: 'Group Human Resources',
    tags: ['HR', 'Policies', 'Bot'],
    capabilities: ['Answers HR policy questions', 'Provides HR information to employees'],
    url: '#',
  },
  {
    id: 'branch-bot', name: 'Branch BOT', icon: 'branch', hue: 215, featured: true,
    tagline: 'Helping the bank’s branches increase productivity',
    description: 'The Branch Bot supports the bank’s branch teams, helping them increase productivity in their daily work.',
    category: 'Branch Banking', status: 'Live', access: 'Request access', ownerId: 'u-me', department: 'Branch Banking',
    tags: ['Branch', 'Productivity', 'Bot'],
    capabilities: ['Assists branch staff with day-to-day tasks', 'Improves branch productivity'],
    url: '#',
  },
  {
    id: 'doc-intel', name: 'DocIntel', icon: 'file', hue: 100,
    tagline: 'Process documents and extract their information',
    description: 'DocIntel processes documents and extracts their information, delivering the result in JSON or Markdown format.',
    category: 'Document Processing', status: 'Live', access: 'All staff', ownerId: 'u-me', department: 'Group Technology & Operations',
    tags: ['Documents', 'JSON', 'Markdown'],
    capabilities: ['Extracts document information', 'JSON output', 'Markdown output'],
    url: '#',
  },
];

export const APP_CATEGORIES = Array.from(new Set(APPS.map((a) => a.category)));
