export type PersonaId = 'consumer' | 'app-owner' | 'learning-moderator' | 'platform-admin';

export interface Persona {
  id: PersonaId;
  label: string;
  tagline: string;
  /** Shown under the role dropdown on the login page. */
  description: string;
  /** Capabilities drive what UI is shown – add new ones here, not in components. */
  can: {
    submitApps: boolean;
    manageOwnApps: boolean;
    moderateLearning: boolean;
    administerPlatform: boolean;
  };
}

export interface User {
  id: string;
  name: string;
  title: string;
  department: string;
  avatarColor: string;
}

/* ---------- Apps ---------- */
export type AppCategory =
  | 'Productivity'
  | 'Risk & Compliance'
  | 'Customer Experience'
  | 'Engineering'
  | 'Data & Analytics'
  | 'Operations';

export type AppStatus = 'Live' | 'Beta' | 'Pilot';
export type AppAccess = 'All staff' | 'Request access';

export interface AiApp {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: AppCategory;
  status: AppStatus;
  access: AppAccess;
  ownerId: string;
  department: string;
  monthlyUsers: number;
  rating: number;
  tags: string[];
  capabilities: string[];
  url: string;
  updated: string;
  /** lucide icon key – see components/ui/AppIcon */
  icon: string;
  hue: number;
}

/* ---------- Learning ---------- */
export type ContentType = 'tip' | 'prompt' | 'news' | 'showcase';
export type ContentStatus = 'draft' | 'published' | 'rejected';
export type LearnCategory =
  | 'Getting started'
  | 'Prompt craft'
  | 'Productivity'
  | 'Risk & Compliance'
  | 'Engineering'
  | 'Industry'
  | 'Responsible AI';

export interface LearningContent {
  id: string;
  type: ContentType;
  title: string;
  summary: string;
  body?: string;
  category: LearnCategory;
  authorId: string;
  status: ContentStatus;
  likes: number;
  likedByMe?: boolean;
  featured?: boolean;
  createdAt: string;
  readMins: number;
  rejectionReason?: string;
  tags: string[];
}

export type LeaderboardMetric = 'posts' | 'likes';
