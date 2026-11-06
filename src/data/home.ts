/** Dummy personal data for the Home page. Replace with API calls; keep the shape. */
export interface MyAppStat { appId: string; sessionsThisWeek: number; lastUsed: string; trend: number[] }

export const MY_APP_STATS: MyAppStat[] = [
  { appId: 'rcp-bot', sessionsThisWeek: 18, lastUsed: '2h ago', trend: [3, 5, 4, 7, 6, 9, 8] },
  { appId: 'hr-bot', sessionsThisWeek: 7, lastUsed: 'Yesterday', trend: [1, 0, 2, 1, 3, 2, 4] },
  { appId: 'doc-intel', sessionsThisWeek: 11, lastUsed: '3d ago', trend: [2, 3, 1, 4, 2, 5, 3] },
  { appId: 'branch-bot', sessionsThisWeek: 4, lastUsed: '5d ago', trend: [0, 1, 0, 2, 1, 1, 2] },
];

export interface MyLearningItem {
  id: string; title: string; kind: 'Learning path' | 'Saved' | 'Completed';
  progress: number; lessonsDone: number; lessonsTotal: number; minsLeft: number; hue: number; icon: 'prompt' | 'shield' | 'sparkles' | 'showcase';
}

export const MY_LEARNING: MyLearningItem[] = [
  { id: 'p1', title: 'Prompt craft for banking professionals', kind: 'Learning path', progress: 65, lessonsDone: 5, lessonsTotal: 8, minsLeft: 24, hue: 215, icon: 'prompt' },
  { id: 'p2', title: 'Responsible AI at UOB: guardrails in practice', kind: 'Learning path', progress: 30, lessonsDone: 2, lessonsTotal: 6, minsLeft: 35, hue: 160, icon: 'shield' },
  { id: 'p3', title: 'Your first 30 minutes with UOB Assist', kind: 'Completed', progress: 100, lessonsDone: 4, lessonsTotal: 4, minsLeft: 0, hue: 335, icon: 'sparkles' },
  { id: 'p4', title: 'Building a meeting-notes assistant in an afternoon', kind: 'Saved', progress: 0, lessonsDone: 0, lessonsTotal: 5, minsLeft: 40, hue: 38, icon: 'showcase' },
];

export const MY_LEARNING_SUMMARY = { streakDays: 6, weeklyGoalMins: 60, weeklyMins: 42, badges: 3 };

/** Dummy "since you last visited" figures for the greeting strip. */
export const GREETING_STATS = {
  lastLoginDay: 'Yesterday',
  lastLoginTime: '5:42 PM · Singapore',
  staleApps: 2,
  staleLearnings: 3,
  newApps: 3,
  newLearnings: 7,
};
