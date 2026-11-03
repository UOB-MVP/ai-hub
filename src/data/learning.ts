import type { LearningContent, LearnCategory, ContentType } from '@/core/types';

export const LEARN_CATEGORIES: LearnCategory[] = [
  'Getting started', 'Prompt craft', 'Productivity', 'Risk & Compliance', 'Engineering', 'Industry', 'Responsible AI',
];

export const CONTENT_TYPES: { id: ContentType; label: string; blurb: string }[] = [
  { id: 'tip', label: 'Tips & Tricks', blurb: 'Quick wins from colleagues' },
  { id: 'prompt', label: 'Prompt Library', blurb: 'Tested, reusable prompts' },
  { id: 'news', label: 'AI News', blurb: 'What matters for banking' },
  { id: 'showcase', label: 'Use-case Showcase', blurb: 'Real impact across UOB' },
];

/** No pre-seeded posts: content appears once colleagues contribute and a moderator publishes it. */
export const SEED_CONTENT: LearningContent[] = [];

/** The learning areas shown in Discover and on Home. */
export const LEARNING_AREAS: { id: ContentType; title: string; description: string; icon: string; hue: number }[] = [
  { id: 'prompt', title: 'Prompt Library', description: 'A collection of prompts for different use cases, ready to copy and adapt.', icon: 'prompt', hue: 215 },
  { id: 'news', title: 'AI News', description: 'Bank-specific news from the AI industry.', icon: 'news', hue: 160 },
  { id: 'showcase', title: 'Use Cases', description: 'How AI adoption is increasing team productivity across the bank.', icon: 'showcase', hue: 335 },
];
