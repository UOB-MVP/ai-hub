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
    id: 'c1', type: 'showcase', featured: true, status: 'published', category: 'Risk & Compliance', authorId: 'u-1', likes: 214, createdAt: '2026-10-29', readMins: 6,
    title: 'How Credit Copilot cut memo drafting time by 40%',
    summary: 'A walkthrough of the pilot in Group Risk: what we automated, what stays human, and how reviewers keep control.',
    tags: ['Credit', 'Case study'],
  },
  {
    id: 'c2', type: 'tip', featured: true, status: 'published', category: 'Prompt craft', authorId: 'u-4', likes: 188, createdAt: '2026-10-26', readMins: 3,
    title: 'The 4-part prompt: role, context, task, format',
    summary: 'A simple structure that turns vague requests into dependable outputs — with before/after examples from UOB Assist.',
    tags: ['Fundamentals'],
  },
  {
    id: 'c3', type: 'news', featured: true, status: 'published', category: 'Industry', authorId: 'u-7', likes: 96, createdAt: '2026-10-31', readMins: 4,
    title: 'Regulators sharpen focus on AI model risk management',
    summary: 'What recent supervisory guidance means for teams building or using AI in banking, and how the Hub helps you stay aligned.',
    tags: ['Regulation', 'Model risk'],
  },
  {
    id: 'c4', type: 'prompt', status: 'published', category: 'Productivity', authorId: 'u-3', likes: 152, createdAt: '2026-10-22', readMins: 2,
    title: 'Customer email: empathetic, policy-safe reply',
    summary: 'Paste the customer message and the relevant policy; get a clear, empathetic draft that never over-promises.',
    body: 'You are a UOB relationship manager. Using ONLY the policy excerpt below, draft a reply to the customer…',
    tags: ['Email', 'Customer'],
  },
  {
    id: 'c5', type: 'tip', status: 'published', category: 'Responsible AI', authorId: 'u-5', likes: 131, createdAt: '2026-10-19', readMins: 3,
    title: 'Five things never to paste into any AI tool',
    summary: 'Customer identifiers, credentials, unreleased financials and more — a clear, memorable checklist aligned to UOB policy.',
    tags: ['Data protection', 'Policy'],
  },
  {
    id: 'c6', type: 'prompt', status: 'published', category: 'Engineering', authorId: 'u-2', likes: 119, createdAt: '2026-10-17', readMins: 2,
    title: 'Generate unit tests from a function and its edge cases',
    summary: 'A prompt that produces readable tests, covers boundaries and flags ambiguous requirements.',
    body: 'Given the function below, write unit tests using our standard framework. Cover happy path, boundaries…',
    tags: ['Testing', 'CodePilot'],
  },
  {
    id: 'c7', type: 'showcase', status: 'published', category: 'Productivity', authorId: 'u-6', likes: 102, createdAt: '2026-10-12', readMins: 5,
    title: 'DocIntel: from 25 minutes to 4 on trade document checks',
    summary: 'How Operations teams use extraction with confidence scores to focus attention on true exceptions.',
    tags: ['Operations', 'Case study'],
  },
  {
    id: 'c8', type: 'tip', status: 'published', category: 'Getting started', authorId: 'u-7', likes: 87, createdAt: '2026-10-08', readMins: 2,
    title: 'Your first 30 minutes with UOB Assist',
    summary: 'Three starter tasks that show value quickly: summarise, rewrite and ask-your-document.',
    tags: ['Onboarding'],
  },
  {
    id: 'c9', type: 'news', status: 'published', category: 'Industry', authorId: 'u-4', likes: 64, createdAt: '2026-10-05', readMins: 5,
    title: 'Agentic AI in banking: hype, reality and guardrails',
    summary: 'Where autonomous agents are genuinely useful today, and the controls we expect before they touch customer outcomes.',
    tags: ['Agents'],
  },
  {
    id: 'c10', type: 'prompt', status: 'published', category: 'Prompt craft', authorId: 'u-4', likes: 77, createdAt: '2026-09-30', readMins: 2,
    title: 'Ask the model to challenge your assumptions',
    summary: 'A devil’s-advocate prompt for stress-testing a proposal before it reaches committee.',
    tags: ['Critical thinking'],
  },
  /* Current user's contributions across statuses */
  {
    id: 'c11', type: 'tip', status: 'published', category: 'Engineering', authorId: 'u-me', likes: 58, createdAt: '2026-10-15', readMins: 3,
    title: 'Use system prompts to keep AI answers on-policy',
    summary: 'How to pin tone, scope and refusal rules once so every answer follows them.',
    tags: ['System prompt'],
  },
  {
    id: 'c12', type: 'prompt', status: 'draft', category: 'Productivity', authorId: 'u-me', likes: 0, createdAt: '2026-11-02', readMins: 2,
    title: 'Turn a long thread into a decision log',
    summary: 'Extract decisions, owners and deadlines from a lengthy email chain.',
    tags: ['Email'],
  },
  {
    id: 'c13', type: 'showcase', status: 'rejected', category: 'Industry', authorId: 'u-me', likes: 0, createdAt: '2026-10-24', readMins: 4,
    title: 'Vendor chatbot comparison',
    summary: 'A side-by-side of external chatbots we tested.',
    rejectionReason: 'Mentions unapproved external tools. Please focus on UOB-approved apps and resubmit.',
    tags: ['Comparison'],
  },
  {
    id: 'c14', type: 'tip', status: 'draft', category: 'Risk & Compliance', authorId: 'u-5', likes: 0, createdAt: '2026-11-01', readMins: 3,
    title: 'Checklist: validating AI-generated policy summaries',
    summary: 'Seven checks to run before relying on an AI summary of a regulation.',
    tags: ['Validation'],
  },
  {
    id: 'c15', type: 'prompt', status: 'draft', category: 'Getting started', authorId: 'u-3', likes: 0, createdAt: '2026-11-02', readMins: 2,
    title: 'Explain a product to a first-time customer',
    summary: 'Plain-language explainer prompt with built-in suitability disclaimers.',
    tags: ['Customer'],
  },
];
