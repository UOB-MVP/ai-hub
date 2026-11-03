import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { RequireAuth } from './RequireAuth';
import { AppAccessProvider } from '@/core/useAppAccess';
import { LoginPage } from '@/features/login/LoginPage';
import { HomePage } from '@/features/home/HomePage';
import { DiscoverPage } from '@/features/discover/DiscoverPage';
import { UsePage } from '@/features/use/UsePage';
import { LearnPage } from '@/features/learn/LearnPage';
import { MyAppsPage } from '@/features/manage/MyAppsPage';
import { AdminPage } from '@/features/admin/AdminPage';
import { AppRunPage } from '@/features/apps/AppRunPage';
import { ExternalAppPage } from '@/features/apps/ExternalAppPage';

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
              { path: 'discover', element: <DiscoverPage /> },
              { path: 'use', element: <UsePage /> },
              { path: 'apps/:id', element: <AppRunPage /> },
              { path: 'learn', element: <LearnPage /> },
              { element: <RequireAuth allow={(p) => p.can.manageOwnApps} />, children: [{ path: 'my-apps', element: <MyAppsPage /> }] },
              { element: <RequireAuth allow={(p) => p.can.administerPlatform} />, children: [{ path: 'admin', element: <AdminPage /> }] },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/home" replace /> },
]);
