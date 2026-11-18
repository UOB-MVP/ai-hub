/**
 * Declarative transcription of the BRD's Access Matrix (Section 4). This is the
 * single source of truth for "who can do what" across the three AI Hub personas
 * named in the BRD. It is read-only reference data surfaced to Platform Admins on
 * the Admin > Access Matrix tab; it documents intent even where a capability is
 * also expressed in code via `Persona.can` or a component-level check.
 *
 * The BRD matrix only names three personas (Platform Admin, Learning Moderator,
 * AI Hub User/"consumer"). The product's optional "App Owner" role is additive and
 * out of scope for this matrix — see personas.ts.
 */
export type MatrixRole = 'platform-admin' | 'learning-moderator' | 'ai-hub-user';
export type MatrixValue = 'yes' | 'no' | 'own' | 'all' | 'view';

export interface AccessMatrixRow {
  category: string;
  function: string;
  values: Record<MatrixRole, MatrixValue>;
}

const row = (category: string, fn: string, admin: MatrixValue, moderator: MatrixValue, user: MatrixValue): AccessMatrixRow => ({
  category, function: fn, values: { 'platform-admin': admin, 'learning-moderator': moderator, 'ai-hub-user': user },
});

export const ACCESS_MATRIX: AccessMatrixRow[] = [
  row('AI Hub Authentication', 'SSO', 'yes', 'yes', 'yes'),
  row('AI Hub Landing Page', 'AI Search', 'yes', 'yes', 'yes'),
  row('AI Hub Landing Page', 'Featured App – View/Launch', 'yes', 'yes', 'yes'),
  row('AI Hub Landing Page', 'Featured Learning – View/Open', 'yes', 'yes', 'yes'),
  row('AI Hub Landing Page', 'Favorite App – View/Launch', 'yes', 'yes', 'yes'),
  row('AI Hub Landing Page', 'Favorite Learning – View/Open', 'yes', 'yes', 'yes'),
  row('AI Hub Landing Page', 'Apps – View/Launch', 'yes', 'yes', 'yes'),
  row('AI Hub Landing Page', 'Learnings – View/Open', 'yes', 'yes', 'yes'),
  row('Apps', 'AI Search / Filter / Sort', 'yes', 'yes', 'yes'),
  row('Apps', 'Featured / Favorite / All Apps – View/Launch', 'yes', 'yes', 'yes'),
  row('Apps', 'App Card – Favorite/Unfavorite', 'yes', 'yes', 'yes'),
  row('Apps', 'App Card – More Details', 'yes', 'yes', 'yes'),
  row('Apps', 'App Card – Rate and Feedback', 'yes', 'yes', 'yes'),
  row('Apps', 'App Card – Share', 'yes', 'yes', 'yes'),
  row('Learning', 'AI Search / Filter / Sort', 'yes', 'yes', 'yes'),
  row('Learning', 'Featured / Favorite Learning – View/Open', 'yes', 'yes', 'yes'),
  row('Learning', 'Learning Card – Copy learning text', 'yes', 'yes', 'yes'),
  row('Learning', 'Learning Card – Share learning', 'yes', 'yes', 'yes'),
  row('Learning', 'Learning Card – Up Vote/withdraw', 'yes', 'yes', 'yes'),
  row('Learning Management', 'Update artifact tagging list', 'yes', 'yes', 'no'),
  row('Learning Management', 'Update artifact publishing guideline', 'yes', 'yes', 'no'),
  row('Learning Management', 'Approve/Reject artifact', 'yes', 'yes', 'no'),
  row('Learning Management', 'Modify tag on artifact', 'yes', 'yes', 'no'),
  row('Learning Management', 'Update featured learning', 'yes', 'yes', 'no'),
  row('Learning Management', 'Contribute (draft / submit / update published)', 'yes', 'yes', 'yes'),
  row('Learning Management', 'View learning artifacts (table)', 'all', 'all', 'own'),
  row('Learning Management', 'Sort/filter learning artifacts list', 'yes', 'yes', 'yes'),
  row('Learning Management', 'Archive artifacts', 'all', 'all', 'own'),
  row('Application Management', 'Onboard app', 'yes', 'no', 'no'),
  row('Application Management', 'Update app metadata', 'yes', 'no', 'no'),
  row('Application Management', 'Update featured app', 'yes', 'no', 'no'),
  row('Application Management', 'View/sort/search all ratings & feedback', 'yes', 'no', 'no'),
  row('Application Management', 'Configure session timeout for apps', 'yes', 'no', 'no'),
  row('Application Management', 'Update predefined tag list for apps', 'yes', 'no', 'no'),
  row('Application Management', 'Archive app', 'yes', 'no', 'no'),
  row('Application Management', 'Add "NEW" banner for recently onboarded apps', 'yes', 'no', 'no'),
  row('Platform Monitoring', 'Monitor user activity (session, login duration, etc.)', 'yes', 'no', 'no'),
  row('Platform Monitoring', 'View user consumption (tokens, pages, etc.)', 'yes', 'no', 'no'),
  row('Platform Monitoring', 'User access review (roles, app, domain, etc.)', 'yes', 'no', 'no'),
  row('Platform Monitoring', 'Access audit logs from apps', 'yes', 'no', 'no'),
  row('Platform Monitoring', 'View favourite-app toggle details', 'yes', 'no', 'no'),
  row('Platform Monitoring', 'View favourite-learning toggle details', 'yes', 'yes', 'no'),
];

export const MATRIX_CATEGORIES = Array.from(new Set(ACCESS_MATRIX.map((r) => r.category)));
