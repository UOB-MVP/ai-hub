import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { RequireAuth } from './RequireAuth';
import { LoginPage } from '@/features/login/LoginPage';
import { HomePage } from '@/features/home/HomePage';
import { DiscoverPage } from '@/features/discover/DiscoverPage';
import { UsePage } from '@/features/use/UsePage';
import { LearnPage } from '@/features/learn/LearnPage';
import { MyAppsPage } from '@/features/manage/MyAppsPage';
import { AdminPage } from '@/features/admin/AdminPage';

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
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/home" replace /> },
          { path: 'home', element: <HomePage /> },
          { path: 'discover', element: <DiscoverPage /> },
          { path: 'use', element: <UsePage /> },
          { path: 'learn', element: <LearnPage /> },
          { element: <RequireAuth allow={(p) => p.can.manageOwnApps} />, children: [{ path: 'my-apps', element: <MyAppsPage /> }] },
          { element: <RequireAuth allow={(p) => p.can.administerPlatform} />, children: [{ path: 'admin', element: <AdminPage /> }] },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/home" replace /> },
]);
