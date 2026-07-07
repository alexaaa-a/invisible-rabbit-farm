import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnalyticsSummaryBar } from '@/features/shared/AnalyticsSummaryBar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

function AnimatedOutlet() {
  const location = useLocation();
  const outlet = useOutlet();
  const previousPath = useRef(location.pathname);
  const shouldAnimate = previousPath.current !== location.pathname;

  useEffect(() => {
    previousPath.current = location.pathname;
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-full min-h-0 flex-1 flex-col overflow-hidden"
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
}

export function AppLayout() {
  const location = useLocation();
  const showSummaryBar = location.pathname !== '/worklog';

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        {showSummaryBar ? <AnalyticsSummaryBar /> : null}
        <main className="min-h-0 flex-1 overflow-hidden pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
          <AnimatedOutlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
