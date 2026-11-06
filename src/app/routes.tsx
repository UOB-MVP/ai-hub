import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { RequireAuth } from './RequireAuth';
import { AppAccessProvider } from '@/core/useAppAccess';
import { LoginPage } from '@/features/login/LoginPage';
import { HomePage } from '@/features/home/HomePage';
import { LearningLayout } from '@/features/learn/LearningLayout';
import { AllPage } from '@/features/learn/pages/AllPage';
import { DraftPage } from '@/features/learn/pages/DraftPage';
import { SubmissionPage } from '@/features/learn/pages/SubmissionPage';
import { ContributePage } from '@/features/learn/pages/ContributePage';
import { AppsPage } from '@/features/apps/AppsPage';
import { ConsoleRedirect } from '@/features/console/ConsolePage';
import { ModerationDesk } from '@/features/console/ModerationDesk';
import { AdminPage } from '@/features/admin/AdminPage';
import { MyUsagePage } from '@/features/my-usage/MyUsagePage';
import { MyAppsPage } from '@/features/manage/MyAppsPage';
import { AppRunPage } from '@/features/apps/AppRunPage';
import { ExternalAppPage } from '@/features/apps/ExternalAppPage';
import { AskPage } from '@/features/ask/AskPage';

/** AppAccessProvider needs router hooks, so it must be mounted inside the route tree. */
function AppAccessGate() {
  return <AppAccessProvider><Outlet /></AppAccessProvider>;
}

/**
 * Add a top-level area: add a route here and an entry in components/layout/nav.ts.
 * Use `RequireAuth allow={...}` to restrict a route by persona capability.
 */
export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <RequireAuth />,
    children: [
      {
        element: <AppAccessGate />,
        children: [
          { path: 'external/:id', element: <ExternalAppPage /> },
          {
            element: <AppShell />,
            children: [
              { index: true, element: <Navigate to="/home" replace /> },
              { path: 'home', element: <HomePage /> },
              { path: 'apps', element: <AppsPage /> },
              { path: 'console', element: <ConsoleRedirect /> },
              { path: 'workspace', element: <MyUsagePage /> },
              { element: <RequireAuth allow={(p) => p.can.moderateLearning} />, children: [{ path: 'moderation', element: <ModerationDesk /> }] },
              { element: <RequireAuth allow={(p) => p.can.administerPlatform} />, children: [{ path: 'control-centre', element: <AdminPage /> }] },
              { path: 'discover', element: <Navigate to="/apps" replace /> },
              { path: 'use', element: <Navigate to="/apps?tab=mine" replace /> },
              { path: 'my-usage', element: <Navigate to="/workspace" replace /> },
              { path: 'apps/:id', element: <AppRunPage /> },
              {
                path: 'learning',
                element: <LearningLayout />,
                children: [
                  { index: true, element: <Navigate to="all" replace /> },
                  { path: 'all', element: <AllPage /> },
                  { path: 'draft', element: <DraftPage /> },
                  { path: 'submission', element: <SubmissionPage /> },
                  { path: 'contribute', element: <ContributePage /> },
                  { path: 'contribute/:id', element: <ContributePage /> },
                ],
              },
              { path: 'learn', element: <Navigate to="/learning/all" replace /> },
              { path: 'ask', element: <AskPage /> },
              { element: <RequireAuth allow={(p) => p.can.manageOwnApps} />, children: [{ path: 'my-apps', element: <MyAppsPage /> }] },
              { element: <RequireAuth allow={(p) => p.can.administerPlatform} />, children: [{ path: 'admin', element: <Navigate to="/control-centre" replace /> }] },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/home" replace /> },
]);
