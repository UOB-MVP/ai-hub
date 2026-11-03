import { RouterProvider } from 'react-router-dom';
import { PersonaProvider } from '@/core/PersonaContext';
import { ContentProvider } from '@/core/ContentContext';
import { AppAccessProvider } from '@/core/useAppAccess';
import { router } from './routes';

export default function App() {
  return (
    <PersonaProvider>
      <ContentProvider>
        <AppAccessProvider>
          <RouterProvider router={router} />
        </AppAccessProvider>
      </ContentProvider>
    </PersonaProvider>
  );
}
