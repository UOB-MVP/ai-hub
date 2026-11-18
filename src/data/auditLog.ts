import type { AuditLogEntry } from '@/core/types';
import { getUser } from './users';

const entry = (
  id: string, userId: string, action: AuditLogEntry['action'], activityType: AuditLogEntry['activityType'],
  detail: string, timestamp: string, appId?: string, requestCount = 1,
): AuditLogEntry => ({
  id, userId, action, activityType, detail, timestamp, appId, requestCount,
  lanId: getUser(userId).lanId, country: getUser(userId).country,
  sessionId: `sess-seed-${id}`,
});

/** Seeded audit trail so Platform Monitoring has history on first load; new events are appended at runtime. */
export const SEED_AUDIT_LOG: AuditLogEntry[] = [
  entry('al-1', 'u-me', 'login', 'login', 'Signed in via SSO', '2026-11-17T08:02:00Z'),
  entry('al-2', 'u-me', 'app_launch', 'launch', 'Launched RCP BOT', '2026-11-17T08:05:00Z', 'rcp-bot'),
  entry('al-3', 'u-ben', 'access_requested', 'request', 'Requested access to RCP BOT', '2026-10-29T09:12:00Z', 'rcp-bot'),
  entry('al-4', 'u-me', 'access_approved', 'request', 'Approved u-ben for RCP BOT', '2026-10-30T10:00:00Z', 'rcp-bot'),
  entry('al-5', 'u-grace', 'favourite_app_add', 'content', 'Favourited HR BOT', '2026-10-30T14:21:00Z', 'hr-bot'),
  entry('al-6', 'u-wei', 'favourite_learning_add', 'content', 'Favourited "Branch opening checklist, AI-assisted"', '2026-10-21T11:40:00Z'),
  entry('al-7', 'u-sarah', 'learning_submitted', 'content', 'Submitted "Summarise HR policy changes for a team update" for review', '2026-10-12T09:00:00Z'),
  entry('al-8', 'u-me', 'learning_approved', 'governance', 'Approved and published a Learning submission by u-sarah', '2026-10-12T15:30:00Z'),
  entry('al-9', 'u-me', 'app_onboarded', 'governance', 'Onboarded BYOB Studio (pilot)', '2026-10-28T09:00:00Z', 'byob-studio'),
  entry('al-10', 'u-me', 'app_metadata_updated', 'governance', 'Updated release notes for Branch BOT', '2026-08-20T10:00:00Z', 'branch-bot'),
  entry('al-11', 'u-alex', 'login', 'login', 'Signed in via SSO', '2026-09-18T09:00:00Z'),
  entry('al-12', 'u-me', 'access_rejected', 'request', 'Declined u-alex for Branch BOT', '2026-09-19T10:00:00Z', 'branch-bot'),
];
