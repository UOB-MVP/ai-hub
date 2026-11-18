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
  /** Bank login id (LAN ID), surfaced in monitoring/audit reports per BRD Platform Monitoring requirements. */
  lanId: string;
  country: string;
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

  /** Countries and languages the app is approved for, shown in the "More details" popup and used for App page filtering/sorting. */
  countries?: string[];
  languages?: string[];
  /** Minutes of inactivity before AI Hub ends the session, configurable per app by a Platform Admin; falls back to the platform default when unset. */
  sessionTimeoutMinutes?: number;
  /** "NEW" ribbon on the app card, shown on AiApp cards until it auto-expires. Set by a Platform Admin at onboarding or from App Management. */
  newBadge?: { expiresAt: string };
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
  country: string;
  sessionId: string;
  activityType: 'normal_use' | 'heavy_use';
  requestCount: number;
}

/* ---------- Audit log / Platform Monitoring ---------- */
export type AuditAction =
  | 'login'
  | 'app_launch'
  | 'favourite_app_add' | 'favourite_app_remove'
  | 'favourite_learning_add' | 'favourite_learning_remove'
  | 'access_requested' | 'access_approved' | 'access_rejected'
  | 'app_onboarded' | 'app_metadata_updated' | 'app_archived' | 'app_tag_updated'
  | 'learning_submitted' | 'learning_approved' | 'learning_rejected' | 'learning_tag_updated' | 'learning_archived'
  | 'role_upgrade_requested';

export type ActivityType = 'login' | 'launch' | 'request' | 'content' | 'governance';

/** A single tracked platform event. Powers Platform Monitoring (BRD 7.1-7.6) and governance audit trails. */
export interface AuditLogEntry {
  id: string;
  lanId: string;
  country: string;
  userId: string;
  action: AuditAction;
  activityType: ActivityType;
  appId?: string;
  detail: string;
  sessionId: string;
  requestCount: number;
  timestamp: string; // ISO datetime
}

/** Weekly daily-access report row (BRD 7.5). */
export interface AccessReportRow {
  lanId: string;
  country: string;
  appId: string;
  appName: string;
  role: string;
  domain: string;
  subDomain: string;
  remarks: string;
  isActive: boolean;
  date: string;
}

/* ---------- Learning ---------- */
export type ContentType = 'tip' | 'prompt' | 'news' | 'showcase';
/** draft = saved by the author only · submitted = awaiting moderator · published = approved · rejected = returned with feedback · archived = removed from the public feed. */
export type ContentStatus = 'draft' | 'submitted' | 'published' | 'rejected' | 'archived';
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

  /** Increments each time a published artifact is edited and resubmitted. */
  version: number;
  /** Points at the still-published artifact this is a pending update for; the original stays live until this is approved. */
  revisionOf?: string;
}

export type LeaderboardMetric = 'posts' | 'likes';
