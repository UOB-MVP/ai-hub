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

export const SEED_CONTENT: LearningContent[] = [
  {
    id: 'l-1', type: 'tip', title: 'Summarise a 40-page credit memo in 5 bullets',
    summary: 'Ask RCP BOT or DocIntel to extract the decision, key risks, exposure and recommended action as five bullets before you read the full memo.',
    body: 'Prompt: "Summarise this credit memo in 5 bullets covering: decision, key risks, exposure, mitigants and recommended action." Works best when you paste the executive summary section first.',
    category: 'Prompt craft', authorId: 'u-me', status: 'published', likes: 34, featured: true,
    createdAt: '2026-10-10', readMins: 2, tags: ['Recovery', 'Summarisation', 'Credit'],
  },
  {
    id: 'l-2', type: 'prompt', title: 'Draft a customer email explaining a declined transaction',
    summary: 'A reusable prompt template for Contact Centre staff to draft clear, empathetic decline-explanation emails in under a minute.',
    body: 'Prompt: "Draft a short, empathetic email to a customer explaining their transaction was declined due to [reason], without disclosing internal risk scoring, and inviting them to contact support."',
    category: 'Prompt craft', authorId: 'u-sarah', status: 'published', likes: 21,
    createdAt: '2026-10-18', readMins: 2, tags: ['Contact Centre', 'Email', 'Customer service'],
  },
  {
    id: 'l-3', type: 'news', title: 'UOB expands AI Hub pilot to five business units',
    summary: 'Following the Recovery and HR pilots, AI Hub onboarding now extends to Branch Banking, Innovation Lab and Group Technology teams.',
    category: 'Industry', authorId: 'u-fatimah', status: 'published', likes: 12,
    createdAt: '2026-10-25', readMins: 1, tags: ['AI Hub', 'Rollout'],
  },
  {
    id: 'l-4', type: 'tip', title: 'Branch opening checklist, AI-assisted',
    summary: 'Use Branch BOT to generate a daily opening checklist tailored to your branch size and recent audit findings.',
    body: 'Prompt: "Generate today\'s branch opening checklist for a [small/medium/large] branch, including any follow-ups from the last audit."',
    category: 'Productivity', authorId: 'u-wei', status: 'published', likes: 18, featured: true,
    createdAt: '2026-10-19', readMins: 2, tags: ['Branch Banking', 'Checklist'],
  },
  {
    id: 'l-5', type: 'showcase', title: 'How Recovery cut case write-up time by 40% with RCP BOT',
    summary: 'The Recovery team shares how auto-drafted case summaries freed up two hours a day per officer.',
    body: 'Since adopting RCP BOT\'s case-summary auto-draft feature, the Recovery team reports a 40% reduction in time spent on written case updates, with officers now spending the saved time on borrower outreach.',
    category: 'Industry', authorId: 'u-me', status: 'published', likes: 27,
    createdAt: '2026-10-05', readMins: 3, tags: ['Recovery', 'Case studies'],
  },
  {
    id: 'l-6', type: 'prompt', title: 'Summarise HR policy changes for a team update',
    summary: 'Turn a long HR policy announcement into a 3-bullet team update, ready to paste into an email or chat message.',
    body: 'Prompt: "Summarise this HR policy update in 3 bullets a manager could paste into a team announcement, in plain language."',
    category: 'Prompt craft', authorId: 'u-grace', status: 'published', likes: 15,
    createdAt: '2026-10-12', readMins: 1, tags: ['HR', 'Policies'],
  },
  {
    id: 'l-7', type: 'tip', title: 'Five ways to get better answers from HR BOT',
    summary: 'Be specific about your employment type and location, ask one question at a time, and ask for the policy reference so you can verify it.',
    category: 'Getting started', authorId: 'u-ben', status: 'published', likes: 9,
    createdAt: '2026-10-08', readMins: 2, tags: ['HR', 'Getting started'],
  },
  {
    id: 'l-8', type: 'news', title: "Responsible AI: what UOB's guardrails mean for you",
    summary: 'A plain-language explainer on grounding, source attribution and content-safety filtering now live across AI Hub apps and Learn.',
    body: 'AI Hub answers in Ask Me Anything are grounded in published Learn content only, show their source, and clearly state when they cannot find a confident answer rather than guessing.',
    category: 'Responsible AI', authorId: 'u-fatimah', status: 'published', likes: 22, featured: true,
    createdAt: '2026-10-29', readMins: 2, tags: ['Responsible AI', 'Governance'],
  },
  {
    id: 'l-9', type: 'showcase', title: 'BYOB Studio pilot: building a meeting-notes assistant in an afternoon',
    summary: 'Innovation Lab walks through assembling a lightweight meeting-notes assistant from approved building blocks.',
    body: 'Using BYOB Studio\'s prompt templates, the pilot cohort assembled a working meeting-notes assistant — transcription summary, action items and owners — without writing code.',
    category: 'Engineering', authorId: 'u-fatimah', status: 'published', likes: 11,
    createdAt: '2026-10-28', readMins: 3, tags: ['BYOB Studio', 'Pilot'],
  },
  {
    id: 'l-10', type: 'tip', title: 'Checklist before you contribute to Learn',
    summary: 'A quick self-check before you submit: no customer data, no confidential figures, and prompts tested at least twice.',
    category: 'Risk & Compliance', authorId: 'u-sarah', status: 'published', likes: 7,
    createdAt: '2026-09-29', readMins: 1, tags: ['Risk', 'Contribution guide'],
  },
];

/** The learning areas shown in Discover and on Home. */
export const LEARNING_AREAS: { id: ContentType; title: string; description: string; icon: string; hue: number }[] = [
  { id: 'prompt', title: 'Prompt Library', description: 'A collection of prompts for different use cases, ready to copy and adapt.', icon: 'prompt', hue: 215 },
  { id: 'news', title: 'AI News', description: 'Bank-specific news from the AI industry.', icon: 'news', hue: 160 },
  { id: 'showcase', title: 'Use Cases', description: 'How AI adoption is increasing team productivity across the bank.', icon: 'showcase', hue: 335 },
];
