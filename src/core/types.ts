export type PersonaId = 'bank-user' | 'learning-moderator' | 'platform-admin';

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

export type UserStatus = 'active' | 'suspended' | 'blocked';

export interface User {
  id: string;
  name: string;
  title: string;
  department: string;
  avatarColor: string;
  status: UserStatus;
}

/* ---------- Apps ---------- */
export type AppCategory = 'Recovery' | 'Employee Services' | 'Branch Banking' | 'Document Processing' | 'Productivity';

export type AppStatus = 'Live' | 'Beta' | 'Pilot';
export type AppAccess = 'All staff' | 'Request access';
/** AI Hub-hosted apps open in the same tab with back navigation; externally hosted apps open in a new tab. */
export type AppHosting = 'internal' | 'external';
export type AppHealth = 'healthy' | 'degraded' | 'down';
/** Onboarding = registered but not yet publicly discoverable; retired = removed from active use. */
export type AppLifecycle = 'onboarding' | 'published' | 'retired';
export type RaiStatus = 'approved' | 'pending' | 'not_required';

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
  featured?: boolean;
  /** Lower sorts first; only meaningful while `featured` is true. */
  featuredPriority?: number;
  tags: string[];
  capabilities: string[];
  url: string;
  /** lucide icon key – see components/ui/AppIcon */
  icon: string;
  hue: number;

  hosting: AppHosting;
  lifecycle: AppLifecycle;
  /** True for an admin-created shell awaiting owner assignment and onboarding details. */
  placeholder?: boolean;
  version: string;
  releaseDate: string;
  whatsNew: string[];
  supportContact: string;

  rating: number;
  ratingCount: number;
  upvotes: number;
  userCount: number;
  health: AppHealth;
  raiStatus: RaiStatus;
  /** Token/request volume over the trailing 30 days – illustrative only. */
  tokenUsage30d: number;
  requests30d: number;
  dau: number;
  tokenLimitPerUser?: number;
  requestLimitPerUser?: number;
  /** Reference to evidence captured for applicable Responsible AI guardrails, recorded at onboarding. */
  raiEvidence?: string;
  /** Emergency kill-switch a Platform Admin can flip independent of lifecycle, e.g. to mitigate risk. */
  blocked?: boolean;
}

export interface AppFeedback {
  id: string;
  appId: string;
  userId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
}

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface AccessRequest {
  id: string;
  appId: string;
  userId: string;
  status: RequestStatus;
  createdAt: string;
  resolvedAt?: string;
  reason?: string;
}

export type AnnouncementAudience = 'all' | 'bank-user';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: AnnouncementAudience;
  createdAt: string;
  authorId: string;
}

export type NotificationKind = 'access' | 'announcement' | 'health' | 'content';

export interface AppNotification {
  id: string;
  userId: string;
  kind: NotificationKind;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  link?: string;
}

/** A day of mock usage for one user against one app. */
export interface UsageEntry {
  appId: string;
  userId: string;
  date: string; // ISO date
  tokens: number;
  requests: number;
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

export interface LearningComment {
  id: string;
  contentId: string;
  userId: string;
  body: string;
  createdAt: string;
  /** Optional 1-5 star rating submitted alongside the comment. */
  rating?: number;
}

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
  /** Set when AI-assisted content-safety filtering flagged this submission for moderator attention. */
  flagged?: boolean;
  flagReason?: string;
}

export type LeaderboardMetric = 'posts' | 'likes';
