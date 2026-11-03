import { RouterProvider } from 'react-router-dom';
import { PersonaProvider } from '@/core/PersonaContext';
import { NotificationsProvider } from '@/core/NotificationsContext';
import { PlatformProvider } from '@/core/PlatformContext';
import { ContentProvider } from '@/core/ContentContext';
import { router } from './routes';

// AppAccessProvider needs router hooks (useNavigate), so it's mounted inside the
// route tree itself – see `AppAccessGate` in routes.tsx – not wrapped here.
export default function App() {
  return (
    <PersonaProvider>
      <NotificationsProvider>
        <PlatformProvider>
          <ContentProvider>
            <RouterProvider router={router} />
          </ContentProvider>
        </PlatformProvider>
      </NotificationsProvider>
    </PersonaProvider>
  );
}
