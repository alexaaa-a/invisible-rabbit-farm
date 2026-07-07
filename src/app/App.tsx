import { ErrorBoundary } from '@/components/ErrorBoundary';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FarmProvider } from '@/state';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

export function App() {
  return (
    <ErrorBoundary>
      <FarmProvider>
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </FarmProvider>
    </ErrorBoundary>
  );
}
