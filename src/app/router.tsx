import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';

const DashboardPage = lazy(() =>
  import('@/features/dashboard').then((m) => ({ default: m.DashboardPage })),
);
const SignalsPage = lazy(() =>
  import('@/features/signals').then((m) => ({ default: m.SignalsPage })),
);
const ModelPage = lazy(() =>
  import('@/features/model').then((m) => ({ default: m.ModelPage })),
);
const AiWorklogPage = lazy(() =>
  import('@/features/ai-worklog').then((m) => ({ default: m.AiWorklogPage })),
);

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: (
            <LazyPage>
              <DashboardPage />
            </LazyPage>
          ),
        },
        {
          path: 'signals',
          element: (
            <LazyPage>
              <SignalsPage />
            </LazyPage>
          ),
        },
        {
          path: 'model',
          element: (
            <LazyPage>
              <ModelPage />
            </LazyPage>
          ),
        },
        {
          path: 'worklog',
          element: (
            <LazyPage>
              <AiWorklogPage />
            </LazyPage>
          ),
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
